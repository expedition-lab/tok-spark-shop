import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Eye, ShoppingCart, Loader2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useCartStore } from "@/stores/cartStore";

interface Post {
  id: string;
  content: string;
  media_url: string;
  media_type: string;
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  created_at: string;
  creator: {
    id: string;
    shop_name: string;
    verified: boolean;
    user_id: string;
    profile?: {
      avatar_url?: string;
    };
  };
  product?: {
    id: string;
    title: string;
    price_cents: number;
    stock_quantity: number;
  };
}

interface FeedProps {
  user: User;
}

export const Feed = ({ user }: FeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          creator:creators(
            id,
            shop_name,
            verified,
            user_id,
            profile:profiles(avatar_url)
          ),
          product:products(
            id,
            title,
            price_cents,
            stock_quantity
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) {
      toast.info("Already liked");
      return;
    }

    try {
      // Record engagement
      await supabase.from("engagements").insert({
        user_id: user.id,
        post_id: postId,
        engagement_type: "like",
        points_earned: 1
      });

      // Update like count
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from("posts")
          .update({ like_count: post.like_count + 1 })
          .eq("id", postId);

        setPosts(posts.map(p => 
          p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
        ));
        setLikedPosts(new Set([...likedPosts, postId]));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.share({
        title: "Check out this product",
        url: window.location.origin + "/post/" + postId
      });

      // Record engagement
      await supabase.from("engagements").insert({
        user_id: user.id,
        post_id: postId,
        engagement_type: "share",
        points_earned: 2
      });

      // Update share count
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from("posts")
          .update({ share_count: post.share_count + 1 })
          .eq("id", postId);

        setPosts(posts.map(p => 
          p.id === postId ? { ...p, share_count: p.share_count + 1 } : p
        ));
      }
    } catch (error) {
      // Fallback if share not supported
      navigator.clipboard.writeText(window.location.origin + "/post/" + postId);
      toast.success("Link copied to clipboard");
    }
  };

  const handleAddToCart = (product: any) => {
    if (!product) return;
    
    // This is a database product, not Shopify
    // For now just show a toast
    toast.success(`${product.title} added to wishlist`, {
      description: "Database products coming soon"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="space-y-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a product!
              </p>
              <Link to="/create">
                <Button>Create Product</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {/* Creator Header */}
              <div className="p-4 flex items-center gap-3">
                <Link to={`/creator/${post.creator.id}`}>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={post.creator.profile?.avatar_url} />
                    <AvatarFallback>
                      {post.creator.shop_name?.[0]?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <Link 
                    to={`/creator/${post.creator.id}`}
                    className="font-semibold hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {post.creator.shop_name}
                    {post.creator.verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Media */}
              {post.media_url && (
                <div className="aspect-square bg-secondary/20">
                  {post.media_type === "image" ? (
                    <img
                      src={post.media_url}
                      alt="Post media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={post.media_url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              <CardContent className="pt-4">
                {/* Content */}
                {post.content && (
                  <p className="mb-4 text-sm">{post.content}</p>
                )}

                {/* Product Info */}
                {post.product && (
                  <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link 
                          to={`/product/${post.product.id}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {post.product.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-bold text-primary">
                            ${(post.product.price_cents / 100).toFixed(2)}
                          </span>
                          {post.product.stock_quantity > 0 ? (
                            <Badge variant="secondary">In Stock</Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(post.product)}
                        disabled={!post.product || post.product.stock_quantity === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                {/* Engagement Actions */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={likedPosts.has(post.id) ? "text-red-500" : ""}
                    >
                      <Heart className={`w-5 h-5 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                      <span className="text-sm">{post.like_count}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm">{post.comment_count}</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare(post.id)}>
                      <Share2 className="w-5 h-5 mr-1" />
                      <span className="text-sm">{post.share_count}</span>
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{post.view_count.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
