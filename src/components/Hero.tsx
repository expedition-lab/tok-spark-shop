import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Zap, TrendingUp, Users, Video } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(220,20%,8%)] via-[hsl(270,80%,15%)] to-[hsl(187,100%,10%)]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Logo with enhanced animation */}
          <div className="flex justify-center animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-2xl opacity-50 animate-pulse-slow" />
              <img src={logo} alt="TokMarket" className="relative w-40 h-40 drop-shadow-2xl" />
            </div>
          </div>

          {/* Main headline with glow effect */}
          <div className="animate-slide-up space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight glow-text">
              Shop, Learn, Earn
            </h1>
            <div className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-slow">
                On TokMarket
              </span>
            </div>
          </div>

          {/* Enhanced description */}
          <p className="text-xl md:text-3xl text-white/95 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in">
            The ultimate creator economy platform. Sell products, teach courses, go live, 
            and build your empire—all in one addictive feed.
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-scale-in">
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-glow hover:shadow-glow-pink hover:scale-110 transition-all duration-300 rounded-2xl font-semibold"
              onClick={() => navigate("/auth")}
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start Creating
            </Button>
            <Button
              size="lg"
              className="text-xl px-12 py-8 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-glow-pink hover:shadow-glow hover:scale-110 transition-all duration-300 rounded-2xl font-semibold"
              onClick={() => navigate("/courses")}
            >
              <Video className="mr-3 h-6 w-6" />
              Explore Courses
            </Button>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/70 text-sm md:text-base">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/70 text-sm md:text-base">Courses & Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">$2M+</div>
              <div className="text-white/70 text-sm md:text-base">Creator Earnings</div>
            </div>
          </div>

          {/* Feature cards with enhanced glass effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-glow">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">AI-Powered Listings</h3>
              <p className="text-white/80">
                Upload a photo and let AI create professional product listings in seconds
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-glow-pink">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Live Streaming & Courses</h3>
              <p className="text-white/80">
                Teach, coach, and share knowledge through live streams and recorded courses
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform duration-300 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">Earn & Grow</h3>
              <p className="text-white/80">
                Get rewarded for views, engagement, and building your creator community
              </p>
            </div>
          </div>

          {/* Creator categories */}
          <div className="pt-16 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Perfect For Every Creator</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Teachers', 'Gym Coaches', 'Nutritionists', 'Psychologists', 'Artists', 'Musicians', 'Entrepreneurs', 'Political Commentators'].map((category, index) => (
                <div 
                  key={category}
                  className="glass-card px-6 py-3 rounded-full text-white/90 hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <Users className="inline-block mr-2 h-4 w-4" />
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
