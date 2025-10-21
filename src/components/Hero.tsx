import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Zap, TrendingUp, Users, Video, DollarSign, Target, Heart, Star, PlayCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-[hsl(240,10%,3.9%)]">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(340,82%,20%)] via-[hsl(240,10%,3.9%)] to-[hsl(280,70%,20%)] opacity-60" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[hsl(340,82%,58%)] opacity-20 blur-[120px] animate-pulse-slow" />
          <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(280,70%,60%)] opacity-20 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full bg-[hsl(340,82%,58%)] opacity-15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
        <div className="space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Logo with neon glow */}
          <div className="flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-[hsl(340,82%,58%)] rounded-full blur-3xl opacity-60 animate-pulse-glow" />
              <img src={logo} alt="TokMarket" className="relative w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl animate-float" />
            </div>
          </div>

          {/* Main headline - TikTok style bold statement */}
          <div className="text-center space-y-4 animate-slide-up">
            <div className="relative inline-block">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none glow-text tracking-tight">
                STOP
              </h1>
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white/90 leading-tight">
              Scrolling For Free
            </div>
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none">
              <span className="bg-gradient-to-r from-[hsl(340,82%,58%)] via-[hsl(280,70%,60%)] to-[hsl(340,82%,58%)] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                START EARNING
              </span>
            </div>
          </div>

          {/* Explosive value prop */}
          <p className="text-center text-lg sm:text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed animate-fade-in px-4">
            Why make <span className="text-[hsl(340,82%,58%)] font-bold">Zuckerberg</span> rich when you could be building 
            <span className="text-[hsl(280,70%,60%)] font-bold"> YOUR empire?</span> 
            <br className="hidden sm:block" />
            Sell products. Teach courses. Go live. <span className="text-white font-bold">Get PAID.</span>
          </p>

          {/* Dual CTA with urgency */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-scale-in px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-16 py-6 sm:py-8 bg-gradient-to-r from-[hsl(340,82%,58%)] to-[hsl(340,82%,48%)] hover:from-[hsl(340,82%,68%)] hover:to-[hsl(340,82%,58%)] text-white font-black rounded-2xl shadow-[0_0_40px_hsl(340,82%,58%/0.6)] hover:shadow-[0_0_60px_hsl(340,82%,58%/0.8)] hover:scale-105 transition-all duration-300 border-2 border-[hsl(340,82%,68%)]"
              onClick={() => navigate("/auth")}
            >
              <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6 fill-current" />
              JOIN THE MOVEMENT
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-16 py-6 sm:py-8 bg-transparent hover:bg-white/10 text-white font-bold rounded-2xl border-2 border-white/30 hover:border-white/60 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/courses")}
            >
              <PlayCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              See How It Works
            </Button>
          </div>

          {/* Live stats ticker - social proof */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto animate-fade-in backdrop-blur-2xl" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              <div className="text-center border-r border-white/10 last:border-r-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[hsl(340,82%,58%)] mb-1 sm:mb-2 animate-pulse">$47M+</div>
                <div className="text-white/60 text-xs sm:text-sm font-medium">Paid to Creators</div>
              </div>
              <div className="text-center border-r border-white/10 md:border-r">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[hsl(280,70%,60%)] mb-1 sm:mb-2 animate-pulse" style={{ animationDelay: '0.5s' }}>127K+</div>
                <div className="text-white/60 text-xs sm:text-sm font-medium">Active Creators</div>
              </div>
              <div className="text-center border-r border-white/10 last:border-r-0">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2 animate-pulse" style={{ animationDelay: '1s' }}>890K+</div>
                <div className="text-white/60 text-xs sm:text-sm font-medium">Products & Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[hsl(340,82%,58%)] mb-1 sm:mb-2 animate-pulse" style={{ animationDelay: '1.5s' }}>24/7</div>
                <div className="text-white/60 text-xs sm:text-sm font-medium">You're Making $$$</div>
              </div>
            </div>
          </div>

          {/* Feature grid - what you can do */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 max-w-6xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
            
            <div className="glass-card-hover glass-card rounded-3xl p-6 sm:p-8 group cursor-pointer backdrop-blur-2xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[hsl(340,82%,58%)] to-[hsl(340,82%,48%)] flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_hsl(340,82%,58%/0.5)] group-hover:shadow-[0_0_50px_hsl(340,82%,58%/0.8)] transition-all">
                <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2 sm:mb-3">Sell Anything</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Physical products, digital downloads, merch—AI writes your listings in 10 seconds
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-[hsl(340,82%,58%)] font-bold text-sm sm:text-base">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Instant Setup</span>
              </div>
            </div>

            <div className="glass-card-hover glass-card rounded-3xl p-6 sm:p-8 group cursor-pointer backdrop-blur-2xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[hsl(280,70%,60%)] to-[hsl(280,70%,50%)] flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_hsl(280,70%,60%/0.5)] group-hover:shadow-[0_0_50px_hsl(280,70%,60%/0.8)] transition-all">
                <Video className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2 sm:mb-3">Teach & Coach</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Upload courses, go live, build a following. Turn your knowledge into recurring income
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-[hsl(280,70%,60%)] font-bold text-sm sm:text-base">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Scale Fast</span>
              </div>
            </div>

            <div className="glass-card-hover glass-card rounded-3xl p-6 sm:p-8 group cursor-pointer backdrop-blur-2xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center mb-4 sm:mb-6 shadow-[0_0_30px_white/0.3] group-hover:shadow-[0_0_50px_white/0.5] transition-all">
                <Target className="h-7 w-7 sm:h-8 sm:w-8 text-[hsl(240,10%,3.9%)]" />
              </div>
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2 sm:mb-3">Own Your Audience</h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                No algorithm BS. Your fans = your income. Build once, earn forever
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-white font-bold text-sm sm:text-base">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                <span>True Ownership</span>
              </div>
            </div>
          </div>

          {/* Creator types - who's winning */}
          <div className="pt-8 sm:pt-12 animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 sm:mb-8 text-center">
              WHO'S <span className="text-[hsl(340,82%,58%)]">CRUSHING IT</span> HERE?
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
              {[
                { icon: '💪', name: 'Fitness Coaches' },
                { icon: '🎨', name: 'Artists' },
                { icon: '🎵', name: 'Musicians' },
                { icon: '📚', name: 'Teachers' },
                { icon: '🍳', name: 'Food Creators' },
                { icon: '💼', name: 'Business Experts' },
                { icon: '🎮', name: 'Gamers' },
                { icon: '✨', name: 'Lifestyle Influencers' }
              ].map((category, index) => (
                <div 
                  key={category.name}
                  className="glass-card px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white/90 hover:text-white hover:scale-110 hover:bg-white/10 transition-all duration-300 cursor-pointer text-sm sm:text-base backdrop-blur-2xl border border-white/10 hover:border-white/30 animate-scale-in"
                  style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA - urgency */}
          <div className="text-center pt-8 sm:pt-12 pb-8 sm:pb-12 animate-fade-in px-4" style={{ animationDelay: '0.8s' }}>
            <div className="glass-card rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto backdrop-blur-2xl border-2 border-[hsl(340,82%,58%)]/30">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4">
                Stop Making Others Rich
              </div>
              <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed">
                Every scroll on social media = $0 for you. Every scroll here = potential income.
                <br className="hidden sm:block" />
                <span className="text-[hsl(340,82%,58%)] font-bold">The choice is obvious.</span>
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg sm:text-2xl px-10 sm:px-20 py-6 sm:py-10 bg-gradient-to-r from-[hsl(340,82%,58%)] via-[hsl(280,70%,60%)] to-[hsl(340,82%,58%)] hover:scale-105 text-white font-black rounded-2xl shadow-[0_0_60px_hsl(340,82%,58%/0.6)] hover:shadow-[0_0_80px_hsl(340,82%,58%/0.9)] transition-all duration-300 border-2 border-white/20 animate-pulse-glow bg-[length:200%_auto] animate-gradient"
                onClick={() => navigate("/auth")}
              >
                <Sparkles className="mr-3 h-6 w-6 sm:h-7 sm:w-7 fill-current" />
                CLAIM YOUR ACCOUNT NOW
              </Button>
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6 text-white/60 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-[hsl(340,82%,58%)]" />
                  <span>Free forever</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-[hsl(280,70%,60%)]" />
                  <span>Start earning today</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
