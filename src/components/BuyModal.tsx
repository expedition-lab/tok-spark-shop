import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Wallet, Coins } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price_cents: number;
  images: string[];
  stock_quantity: number;
  creator_id: string;
}

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  user: User;
  onSuccess?: () => void;
}

export const BuyModal = ({ open, onClose, product, user, onSuccess }: BuyModalProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "points" | "card">("wallet");
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);

  useState(() => {
    if (open && user) {
      loadWallet();
    }
  });

  const loadWallet = async () => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("balance_cents, points")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setWalletBalance(data.balance_cents);
      setPoints(data.points);
    } catch (error) {
      console.error("Failed to load wallet:", error);
    }
  };

  if (!product) return null;

  const total = product.price_cents * quantity;
  const totalDollars = total / 100;
  const pointsRequired = Math.ceil(totalDollars * 100); // 100 points = $1

  const handleBuy = async () => {
    setProcessing(true);
    try {
      // Call secure server-side purchase function
      const { data, error } = await supabase.rpc('process_purchase', {
        _buyer_id: user.id,
        _product_id: product.id,
        _quantity: quantity,
        _payment_method: paymentMethod
      });

      if (error) throw error;

      // Check if purchase was successful
      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        throw new Error(result.error || "Purchase failed");
      }

      toast({
        title: "Purchase successful! 🎉",
        description: `You bought ${quantity}x ${product.title}`,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const canAfford =
    (paymentMethod === "wallet" && (walletBalance || 0) >= total) ||
    (paymentMethod === "points" && (points || 0) >= pointsRequired) ||
    paymentMethod === "card";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Product</DialogTitle>
          <DialogDescription>Complete your purchase</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{product.title}</h3>
              <p className="text-lg font-bold text-primary">
                ${(product.price_cents / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {product.stock_quantity} available
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="flex-1 flex items-center gap-2 cursor-pointer">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet Balance</span>
                  <span className="ml-auto font-semibold">
                    ${((walletBalance || 0) / 100).toFixed(2)}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="points" id="points" />
                <Label htmlFor="points" className="flex-1 flex items-center gap-2 cursor-pointer">
                  <Coins className="w-4 h-4" />
                  <span>Points</span>
                  <span className="ml-auto font-semibold">{points || 0} pts</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                <RadioGroupItem value="card" id="card" disabled />
                <Label htmlFor="card" className="flex-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card (Coming Soon)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Total */}
          <div className="p-4 bg-gradient-subtle rounded-lg">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-gradient">
                {paymentMethod === "points"
                  ? `${pointsRequired} points`
                  : `$${totalDollars.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={processing || !canAfford || quantity > product.stock_quantity}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Buy Now`
              )}
            </Button>
          </div>

          {!canAfford && (
            <p className="text-xs text-destructive text-center">
              Insufficient {paymentMethod === "points" ? "points" : "balance"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
