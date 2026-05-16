import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Camera, Loader2, Sparkles, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { z } from "zod";

type Category = "fashion" | "electronics" | "home" | "beauty" | "sports" | "art" | "other";

interface AIAnalysis {
  title: string;
  description: string;
  category: Category;
  tags: string[];
  suggestedPrice: number;
  languages: string[];
}

// Input validation schema
const productSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(60, "Title must be less than 60 characters"),
  description: z.string().trim().max(500, "Description must be less than 500 characters"),
  price: z.number().positive("Price must be positive").max(1000000, "Price must be less than $10,000"),
  stock: z.number().int("Stock must be a whole number").nonnegative("Stock cannot be negative").max(10000, "Stock must be less than 10,000"),
  tags: z.array(z.string().trim().max(30, "Tag too long")).max(10, "Maximum 10 tags allowed")
});

export default function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("other");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-product-image", {
        body: { imageBase64: image }
      });

      if (error) throw error;

      const analysis = data as AIAnalysis;
      setTitle(analysis.title);
      setDescription(analysis.description);
      setCategory(analysis.category);
      setPrice(analysis.suggestedPrice.toFixed(2));
      setTags(analysis.tags);

      toast.success("✨ AI generated your listing!", {
        description: "Review and adjust as needed"
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!title || !price || !image) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      // Validate input
      const priceNum = parseFloat(price);
      const stockNum = parseInt(stock);
      
      const validationResult = productSchema.safeParse({
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        stock: stockNum,
        tags: tags.map(t => t.trim())
      });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || "Invalid input";
        toast.error(errorMessage);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get or create creator profile
      let { data: creator } = await supabase
        .from("creators")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!creator) {
        const { data: newCreator, error: creatorError } = await supabase
          .from("creators")
          .insert({ user_id: user.id, shop_name: user.email?.split("@")[0] })
          .select("id")
          .single();

        if (creatorError) throw creatorError;
        creator = newCreator;
      }

      // Create product with validated data
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert([{
          creator_id: creator.id,
          title: validationResult.data.title,
          description: validationResult.data.description,
          category,
          price_cents: Math.round(validationResult.data.price * 100),
          stock_quantity: validationResult.data.stock,
          tags: validationResult.data.tags,
          images: [image],
          ai_generated: true
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Create post
      const { error: postError } = await supabase
        .from("posts")
        .insert({
          creator_id: creator.id,
          product_id: product.id,
          content: validationResult.data.description,
          media_url: image,
          media_type: "image"
        });

      if (postError) throw postError;

      toast.success("🎉 Product listed!", {
        description: "Your product is now live"
      });

      navigate("/");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation user={user} />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-elegant">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Create Product
          </h1>

          {/* Image Upload */}
          <div className="mb-6">
            <Label>Product Photo</Label>
            <div className="mt-2">
              {!image ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  <Camera className="w-12 h-12 text-primary" />
                  <p className="text-sm text-muted-foreground">Tap to upload photo</p>
                </button>
              ) : (
                <div className="relative">
                  <img src={image} alt="Uploaded product photo preview" className="w-full aspect-square object-cover rounded-2xl" />
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Remove uploaded photo"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {image && !title && (
              <Button
                onClick={analyzeImage}
                disabled={analyzing}
                className="w-full mt-4 bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Listing with AI
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pb-24">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product name"
                maxLength={60}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell buyers about your product"
                rows={4}
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                max="10000"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="1"
              />
            </div>

            {tags.length > 0 && (
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Publish Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm border-t">
            <div className="container mx-auto max-w-2xl">
              <Button
                onClick={handleSave}
                disabled={saving || !title || !price || !image}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant text-lg font-semibold"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Product"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
