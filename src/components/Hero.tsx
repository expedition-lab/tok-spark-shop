import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Zap } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 gradient-primary opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center animate-float">
            <img src={logo} alt="TokMarket" className="w-32 h-32 shadow-glow-pink" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Shop, Create, Earn
            <br />
            <span className="text-secondary-glow">On TokMarket</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            The TikTok-style marketplace where creators sell products, earn points, 
            and build their brand—all in one addictive feed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-glow hover:scale-105 transition-transform"
              onClick={() => navigate("/auth")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 shadow-glow-pink hover:scale-105 transition-transform"
              onClick={() => navigate("/auth")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Selling
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 mx-auto">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">AI Listings</h3>
              <p className="text-white/80 text-sm">
                Upload a photo and AI creates your entire listing instantly
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Earn Points</h3>
              <p className="text-white/80 text-sm">
                Get rewarded for views, likes, and shares on your posts
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Quick Checkout</h3>
              <p className="text-white/80 text-sm">
                One-tap buying with crypto or card payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
