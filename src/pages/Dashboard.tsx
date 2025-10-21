import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Package,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Plus,
  Trash2,
  Edit
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  stock_quantity: number;
  images: string[];
  category: string;
  created_at: string;
}

interface Creator {
  id: string;
  shop_name: string;
  total_sales: number;
  rating: number;
}

interface Post {
  id: string;
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  created_at: string;
  product_id: string;
}

interface Order {
  id: string;
  total_cents: number;
  quantity: number;
  status: string;
  created_at: string;
  product_id: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadDashboard(user.id);
  };

  const loadDashboard = async (userId: string) => {
    try {
      // Get creator profile
      const { data: creatorData } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!creatorData) {
        // Create creator profile if doesn't exist
        const { data: newCreator } = await supabase
          .from("creators")
          .insert({ user_id: userId })
          .select()
          .single();
        setCreator(newCreator);
      } else {
        setCreator(creatorData);
      }

      // Load products
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("creator_id", creatorData?.id || "")
        .order("created_at", { ascending: false });

      setProducts(productsData || []);

      // Load orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("creator_id", creatorData?.id || "")
        .order("created_at", { ascending: false })
        .limit(10);

      setOrders(ordersData || []);

      // Load posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("creator_id", creatorData?.id || "")
        .order("created_at", { ascending: false });

      setPosts(postsData || []);

    } catch (error: any) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_cents, 0) / 100;
  const totalViews = posts.reduce((sum, p) => sum + p.view_count, 0);
  const totalEngagement = posts.reduce((sum, p) => 
    sum + p.like_count + p.share_count + p.comment_count, 0
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation user={user} />
      
      <main className="container mx-auto px-4 py-6 mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              {creator?.shop_name || "Your Shop"}
            </p>
          </div>
          <Button 
            onClick={() => navigate("/create")}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {orders.length} orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Products
              </CardTitle>
              <Package className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
              <Eye className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Engagement
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Likes, shares, comments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4 mt-6">
            {products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No products yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first product to get started
                  </p>
                  <Button onClick={() => navigate("/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  const productPost = posts.find(p => p.product_id === product.id);
                  return (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img 
                          src={product.images?.[0] || "/placeholder.svg"} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                          {product.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-primary">
                            ${(product.price_cents / 100).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Stock: {product.stock_quantity}
                          </span>
                        </div>

                        {productPost && (
                          <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {productPost.view_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {productPost.like_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-3 h-3" />
                              {productPost.share_count}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No orders yet</p>
                  <p className="text-sm text-muted-foreground">
                    Orders will appear here once customers start buying
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ${(order.total_cents / 100).toFixed(2)}
                          </p>
                          <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
