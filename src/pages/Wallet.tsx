import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet as WalletIcon, TrendingUp, ShoppingBag, Coins, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageSeo } from "@/components/PageSeo";

interface WalletData {
  points: number;
  balance_cents: number;
}

interface Order {
  id: string;
  total_cents: number;
  quantity: number;
  status: string;
  created_at: string;
  payment_method: string;
  products: {
    title: string;
    images: string[];
  };
}

export default function Wallet() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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
    await loadWalletData(user.id);
  };

  const loadWalletData = async (userId: string) => {
    try {
      // Load wallet
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (walletError) throw walletError;
      setWallet(walletData);

      // Load purchase history
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            title,
            images
          )
        `)
        .eq("buyer_id", userId)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  const balance = (wallet?.balance_cents || 0) / 100;
  const totalSpent = orders.reduce((sum, order) => sum + order.total_cents, 0) / 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <PageSeo
        title="Wallet — TokMarket"
        description="Track your TokMarket points, cash balance, and purchase history in one secure wallet."
        path="/wallet"
      />
      <Navigation user={user} />

      <main className="container mx-auto px-4 py-6 mt-16 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Manage your points and balance</p>
        </div>

        {/* Balance Cards */}
        <h2 className="sr-only">Balances overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Points Balance
              </CardTitle>
              <Coins className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{wallet?.points || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Earn points by engaging with posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cash Balance
              </CardTitle>
              <WalletIcon className="w-5 h-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="w-3 h-3 mr-1" />
                Add Funds
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {orders.length} purchases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases">Purchase History</TabsTrigger>
            <TabsTrigger value="activity">Points Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No purchases yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start shopping to see your order history
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {order.products?.images?.[0] && (
                        <img
                          src={order.products.images[0]}
                          alt={order.products.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{order.products?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} • Qty: {order.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Payment: {order.payment_method || "Wallet"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${(order.total_cents / 100).toFixed(2)}</p>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Coins className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Points Activity</p>
                <p className="text-sm text-muted-foreground">
                  Your points activity will appear here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
