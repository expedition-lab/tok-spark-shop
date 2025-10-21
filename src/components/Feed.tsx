import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FeedProps {
  user: User;
}

interface Post {
  id: string;
  content: string;
  media_url: string;
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  product_id: string | null;
  products?: {
    id: string;
    title: string;
    price_cents: number;
    images: string[];
  };
  creators: {
    user_id: string;
    shop_name: string;
    profiles: {
      username: string;
      display_name: string;
      avatar_url: string;
    };
  };
}

export const Feed = ({ user }: FeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          products (
            id,
            title,
            price_cents,
            images
          ),
          creators (
            user_id,
            shop_name,
            profiles (
              username,
              display_name,
              avatar_url
            )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load feed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEngage = async (postId: string, type: "like" | "share" | "comment") => {
    try {
      const pointsMap = { view: 1, like: 5, share: 10, comment: 8 };
      const points = pointsMap[type];

      const { error } = await supabase.from("engagements").insert({
        user_id: user.id,
        post_id: postId,
        engagement_type: type,
        points_earned: points,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already engaged",
            description: `You've already ${type}d this post`,
          });
        } else {
          throw error;
        }
      } else {
        // Add points to wallet
        await supabase.rpc("add_points", { _user_id: user.id, _points: points });
        
        toast({
          title: "Success!",
          description: `+${points} points earned`,
        });

        loadPosts();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-96 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="p-12 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            Be the first to create a product and share it with the world!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          {/* Creator info */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary" />
              <div>
                <p className="font-semibold">{post.creators.profiles.display_name}</p>
                <p className="text-sm text-muted-foreground">
                  @{post.creators.profiles.username}
                </p>
              </div>
            </div>
            {post.creators.shop_name && (
              <Badge variant="secondary">{post.creators.shop_name}</Badge>
            )}
          </div>

          {/* Media */}
          {post.media_url && (
            <div className="relative aspect-[9/16] md:aspect-video bg-muted">
              <img
                src={post.media_url}
                alt={post.content || "Post media"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          {post.content && <div className="p-4 text-sm">{post.content}</div>}

          {/* Product card */}
          {post.products && (
            <div className="mx-4 mb-4 p-4 bg-muted rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {post.products.images?.[0] && (
                  <img
                    src={post.products.images[0]}
                    alt={post.products.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{post.products.title}</p>
                  <p className="text-lg font-bold text-primary">
                    ${(post.products.price_cents / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button size="sm" className="shadow-glow">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Buy
              </Button>
            </div>
          )}

          {/* Engagement */}
          <div className="p-4 border-t flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                className="flex items-center space-x-1 text-muted-foreground hover:text-secondary transition-colors"
                onClick={() => handleEngage(post.id, "like")}
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm">{post.like_count}</span>
              </button>
              <button
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => handleEngage(post.id, "comment")}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">{post.comment_count}</span>
              </button>
              <button
                className="flex items-center space-x-1 text-muted-foreground hover:text-accent transition-colors"
                onClick={() => handleEngage(post.id, "share")}
              >
                <Share2 className="h-5 w-5" />
                <span className="text-sm">{post.share_count}</span>
              </button>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{post.view_count}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
