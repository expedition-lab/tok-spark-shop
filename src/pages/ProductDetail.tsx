import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import { getProductByHandle } from "@/lib/shopify";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (handle) {
      loadProduct();
    }
  }, [handle]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const fetchedProduct = await getProductByHandle(handle!);
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        setSelectedVariantId(fetchedProduct.node.variants.edges[0]?.node.id || "");
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedVariant = product.node.variants.edges.find(
      v => v.node.id === selectedVariantId
    )?.node;
    
    if (!selectedVariant) return;

    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} />
        <div className="pt-20 px-4">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate("/shop")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedVariant = product.node.variants.edges.find(
    v => v.node.id === selectedVariantId
  )?.node || product.node.variants.edges[0]?.node;

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/shop")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
                {product.node.images.edges[selectedImage]?.node ? (
                  <img
                    src={product.node.images.edges[selectedImage].node.url}
                    alt={product.node.images.edges[selectedImage].node.altText || product.node.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {product.node.images.edges.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.node.images.edges.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-primary'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image.node.url}
                        alt={image.node.altText || `${product.node.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
                  {product.node.title}
                </h1>
                <p className="text-3xl font-black text-primary">
                  ${parseFloat(selectedVariant.price.amount).toFixed(2)}
                </p>
              </div>

              {product.node.description && (
                <div>
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.node.description}
                  </p>
                </div>
              )}

              {/* Variant Selection */}
              {product.node.variants.edges.length > 1 && (
                <div>
                  <h3 className="font-bold text-lg mb-3">Select Option</h3>
                  <div className="space-y-2">
                    {product.node.variants.edges.map((variant) => (
                      <button
                        key={variant.node.id}
                        onClick={() => setSelectedVariantId(variant.node.id)}
                        disabled={!variant.node.availableForSale}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedVariantId === variant.node.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        } ${!variant.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{variant.node.title}</span>
                          <span className="font-bold">${parseFloat(variant.node.price.amount).toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="flex-1 text-lg py-6"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <CartDrawer />
              </div>

              {!selectedVariant?.availableForSale && (
                <p className="text-destructive font-medium">This variant is currently unavailable</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
