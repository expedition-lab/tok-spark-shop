import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_cents: number;
  quantity: number;
  product: {
    id: string;
    title: string;
    images: string[];
  };
  creator: {
    shop_name: string;
  };
}

export default function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
        loadOrders(user.id);
      }
    });
  }, [navigate]);

  const loadOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          status,
          total_cents,
          quantity,
          product:products(id, title, images),
          creator:creators(shop_name)
        `)
        .eq("buyer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation user={user} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Order History
          </h1>
          <p className="text-muted-foreground">Track your purchases and order status</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">
                Start shopping to see your orders here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(order.created_at), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                      {order.product.images?.[0] && (
                        <img
                          src={order.product.images[0]}
                          alt={order.product.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{order.product.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Sold by: {order.creator.shop_name}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Quantity: {order.quantity}
                        </span>
                        <span className="text-lg font-bold">
                          ${(order.total_cents / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
