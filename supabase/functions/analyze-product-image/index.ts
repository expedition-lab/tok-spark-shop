import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("Missing authorization header");
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.log("Authentication failed:", authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Authenticated user:", user.id);

    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error("No image provided");
    }

    // Validate image size (max ~7MB base64)
    if (imageBase64.length > 10_000_000) {
      throw new Error("Image too large. Maximum size is 7MB");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing product image with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a product listing AI for TokMarket, a social shopping platform. Analyze product images and generate compelling listings.
            
Return a JSON object with:
- title: catchy product name (max 60 chars)
- description: engaging description highlighting features & benefits (max 500 chars)
- category: one of (fashion, electronics, home, beauty, sports, toys, books, food, other)
- tags: 3-5 relevant search tags
- suggestedPrice: estimated price in USD (number only)
- languages: ["en"] (default English, add others if multilingual text detected)

Be creative, persuasive, and accurate.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this product image and create a listing"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_product_listing",
              description: "Generate product listing data from image analysis",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Product title, max 60 characters"
                  },
                  description: {
                    type: "string",
                    description: "Product description, max 500 characters"
                  },
                  category: {
                    type: "string",
                    enum: ["fashion", "electronics", "home", "beauty", "sports", "toys", "books", "food", "other"],
                    description: "Product category"
                  },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "3-5 relevant tags"
                  },
                  suggestedPrice: {
                    type: "number",
                    description: "Suggested price in USD"
                  },
                  languages: {
                    type: "array",
                    items: { type: "string" },
                    description: "Languages detected"
                  }
                },
                required: ["title", "description", "category", "tags", "suggestedPrice", "languages"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_product_listing" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const listing = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(listing),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing product:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
