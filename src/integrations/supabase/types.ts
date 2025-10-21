export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_listings: {
        Row: {
          created_at: string
          id: string
          languages: string[] | null
          price_suggestion_cents: number | null
          product_id: string
          vision_analysis: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          languages?: string[] | null
          price_suggestion_cents?: number | null
          product_id: string
          vision_analysis?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          languages?: string[] | null
          price_suggestion_cents?: number | null
          product_id?: string
          vision_analysis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          created_at: string
          id: string
          rating: number | null
          shop_name: string | null
          total_sales: number | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating?: number | null
          shop_name?: string | null
          total_sales?: number | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number | null
          shop_name?: string | null
          total_sales?: number | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "creators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          created_at: string
          engagement_type: Database["public"]["Enums"]["engagement_type"]
          id: string
          points_earned: number | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          engagement_type: Database["public"]["Enums"]["engagement_type"]
          id?: string
          points_earned?: number | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          engagement_type?: Database["public"]["Enums"]["engagement_type"]
          id?: string
          points_earned?: number | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagements_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          creator_id: string
          id: string
          payment_method: string | null
          product_id: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"] | null
          total_cents: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          creator_id: string
          id?: string
          payment_method?: string | null
          product_id: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_cents: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          creator_id?: string
          id?: string
          payment_method?: string | null
          product_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comment_count: number | null
          content: string | null
          created_at: string
          creator_id: string
          id: string
          like_count: number | null
          media_type: string | null
          media_url: string | null
          product_id: string | null
          share_count: number | null
          view_count: number | null
        }
        Insert: {
          comment_count?: number | null
          content?: string | null
          created_at?: string
          creator_id: string
          id?: string
          like_count?: number | null
          media_type?: string | null
          media_url?: string | null
          product_id?: string | null
          share_count?: number | null
          view_count?: number | null
        }
        Update: {
          comment_count?: number | null
          content?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          like_count?: number | null
          media_type?: string | null
          media_url?: string | null
          product_id?: string | null
          share_count?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ai_generated: boolean | null
          category: Database["public"]["Enums"]["product_category"] | null
          created_at: string
          creator_id: string
          description: string | null
          id: string
          images: string[] | null
          price_cents: number
          stock_quantity: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean | null
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          images?: string[] | null
          price_cents: number
          stock_quantity?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean | null
          category?: Database["public"]["Enums"]["product_category"] | null
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          images?: string[] | null
          price_cents?: number
          stock_quantity?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance_cents: number | null
          created_at: string
          id: string
          points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_cents?: number | null
          created_at?: string
          id?: string
          points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_cents?: number | null
          created_at?: string
          id?: string
          points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_points: {
        Args: { _points: number; _user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "creator" | "user"
      engagement_type: "view" | "like" | "share" | "comment"
      order_status: "pending" | "completed" | "cancelled"
      product_category:
        | "fashion"
        | "beauty"
        | "electronics"
        | "home"
        | "sports"
        | "art"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "creator", "user"],
      engagement_type: ["view", "like", "share", "comment"],
      order_status: ["pending", "completed", "cancelled"],
      product_category: [
        "fashion",
        "beauty",
        "electronics",
        "home",
        "sports",
        "art",
        "other",
      ],
    },
  },
} as const
