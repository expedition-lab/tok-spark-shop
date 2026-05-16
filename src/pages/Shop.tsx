import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, ShoppingBag, Filter } from "lucide-react";
import { getProducts } from "@/lib/shopify";
import { useCartStore, type ShopifyProduct } from "@/stores/cartStore";
import { PageSeo } from "@/components/PageSeo";

const Shop = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const navigate = useNavigate();
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
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts(50);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.node.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (priceRange === "all") return true;
    
    const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
    switch (priceRange) {
      case "under-25": return price < 25;
      case "25-50": return price >= 25 && price <= 50;
      case "50-100": return price > 50 && price <= 100;
      case "over-100": return price > 100;
      default: return true;
    }
  });

  const handleAddToCart = (product: ShopifyProduct) => {
    const defaultVariant = product.node.variants.edges[0]?.node;
    if (!defaultVariant) return;

    addItem({
      product,
      variantId: defaultVariant.id,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      selectedOptions: defaultVariant.selectedOptions,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Shop creator products on TokMarket"
        description="Browse and buy curated products from independent creators on TokMarket — fast checkout, secure payments."
        path="/shop"
      />
      <Navigation user={user} />
      
      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
                  Shop Products
                </h1>
                <p className="text-muted-foreground text-lg">
                  Discover amazing products from creators
                </p>
              </div>
              <CartDrawer />
            </div>

            <h2 className="sr-only">Search and filter products</h2>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-25">Under $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="over-100">Over $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(searchQuery || priceRange !== "all") && (
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                {(searchQuery || priceRange !== "all") && (
                  <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setPriceRange("all"); }} className="ml-2">
                    Clear filters
                  </Button>
                )}
              </p>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Be the first to add products! Tell me what you'd like to sell and the price."}
              </p>
            </div>
          ) : (
            <>
              <h2 className="sr-only">Product results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const image = product.node.images.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                
                return (
                  <div
                    key={product.node.id}
                    className="glass-card-hover glass-card rounded-2xl overflow-hidden cursor-pointer group backdrop-blur-2xl"
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                  >
                    <div className="aspect-square bg-muted overflow-hidden">
                      {image ? (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                      
                      {product.node.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.node.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-black text-primary">
                          ${parseFloat(price.amount).toFixed(2)}
                        </span>
                        
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Shop;
