import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Star, Package, ShoppingCart, BadgeCheck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface Creator {
  id: string;
  shop_name: string;
  verified: boolean;
  rating: number;
  total_sales: number;
  created_at: string;
  user_id: string;
  profile?: {
    avatar_url?: string;
    bio?: string;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  category: string;
  images: string[];
  stock_quantity: number;
}

export default function CreatorProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    loadCreatorData();
  }, [id]);

  const loadCreatorData = async () => {
    try {
      // Load creator info
      const { data: creatorData, error: creatorError } = await supabase
        .from("creators")
        .select(`
          *,
          profile:profiles(avatar_url, bio)
        `)
        .eq("id", id)
        .single();

      if (creatorError) throw creatorError;
      setCreator(creatorData);

      // Load creator's products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("creator_id", id)
        .gt("stock_quantity", 0)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error("Error loading creator:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    // For now, we're using the internal product system
    // This would need to be updated if switching to Shopify products
    toast.success(`Added ${product.title} to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation user={user} />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
          <Link to="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Creator Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 flex-col md:flex-row">
              <Avatar className="w-24 h-24">
                <AvatarImage src={creator.profile?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {creator.shop_name?.[0]?.toUpperCase() || "C"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{creator.shop_name}</h1>
                  {creator.verified && (
                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                  )}
                </div>

                {creator.profile?.bio && (
                  <p className="text-muted-foreground mb-4">{creator.profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{creator.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-primary" />
                    <span>{products.length} Products</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    <span>{creator.total_sales} Sales</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Products by {creator.shop_name}</h2>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground">
                This creator hasn't listed any products
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square bg-secondary/20 overflow-hidden">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                </Link>

                <CardHeader>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                  {product.category && (
                    <Badge variant="secondary" className="w-fit mt-2">
                      {product.category}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    ${(product.price_cents / 100).toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
