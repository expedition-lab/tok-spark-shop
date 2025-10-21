import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Zap, TrendingUp, Users, Video, DollarSign, Target, Heart, Star, PlayCircle, Check, Shield, Smartphone, Lock, Clock, ArrowRight, Trophy, Eye } from "lucide-react";
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
            Stop giving away your content for free on platforms that keep 100% of the profit.
            <br className="hidden sm:block" />
            Here, <span className="text-[hsl(340,82%,58%)] font-bold">you keep 90%</span> of every sale. 
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
              onClick={() => navigate("/shop")}
            >
              <PlayCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Browse Products
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

          {/* Comparison Table - TokMarket vs Others */}
          <div className="pt-12 sm:pt-16 animate-fade-in px-4" style={{ animationDelay: '1s' }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-8 sm:mb-12 text-center">
              Why Creators Are <span className="text-[hsl(340,82%,58%)]">Switching</span>
            </h2>
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto backdrop-blur-2xl overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-white/60 text-sm font-medium"></div>
                  <div className="text-center">
                    <div className="text-[hsl(340,82%,58%)] font-black text-lg mb-2">TokMarket</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/40 font-bold text-lg mb-2">Platform A</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/40 font-bold text-lg mb-2">Platform B</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                    <div className="text-white/80 font-medium text-sm">You Keep</div>
                    <div className="text-center text-[hsl(340,82%,58%)] font-black text-2xl">90%</div>
                    <div className="text-center text-white/40 font-bold text-xl">0%</div>
                    <div className="text-center text-white/40 font-bold text-xl">0%</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                    <div className="text-white/80 font-medium text-sm">Sell Products</div>
                    <div className="text-center"><Check className="h-6 w-6 text-[hsl(340,82%,58%)] mx-auto" /></div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                    <div className="text-white/80 font-medium text-sm">Sell Courses</div>
                    <div className="text-center"><Check className="h-6 w-6 text-[hsl(340,82%,58%)] mx-auto" /></div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                    <div className="text-white/80 font-medium text-sm">Own Your Audience</div>
                    <div className="text-center"><Check className="h-6 w-6 text-[hsl(340,82%,58%)] mx-auto" /></div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                    <div className="text-white/80 font-medium text-sm">AI Listing Creator</div>
                    <div className="text-center"><Check className="h-6 w-6 text-[hsl(340,82%,58%)] mx-auto" /></div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                    <div className="text-white/80 font-medium text-sm">Algorithm BS</div>
                    <div className="text-center text-white/20 font-bold text-2xl">✕</div>
                    <div className="text-center"><Check className="h-6 w-6 text-white/40 mx-auto" /></div>
                    <div className="text-center"><Check className="h-6 w-6 text-white/40 mx-auto" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges & Real Numbers */}
          <div className="pt-12 sm:pt-16 animate-fade-in px-4" style={{ animationDelay: '1.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="glass-card rounded-2xl p-6 text-center backdrop-blur-2xl">
                <div className="w-16 h-16 rounded-full bg-[hsl(340,82%,58%)]/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-[hsl(340,82%,58%)]" />
                </div>
                <div className="text-3xl font-black text-white mb-2">$3,247</div>
                <div className="text-white/60 text-sm">Average monthly earnings</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 text-center backdrop-blur-2xl">
                <div className="w-16 h-16 rounded-full bg-[hsl(280,70%,60%)]/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-[hsl(280,70%,60%)]" />
                </div>
                <div className="text-3xl font-black text-white mb-2">24 Hours</div>
                <div className="text-white/60 text-sm">Average time to first sale</div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 text-center backdrop-blur-2xl">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-black text-white mb-2">100%</div>
                <div className="text-white/60 text-sm">Secure payments guaranteed</div>
              </div>
            </div>
          </div>

          {/* Social Proof - Live Activity */}
          <div className="pt-12 sm:pt-16 animate-fade-in px-4" style={{ animationDelay: '1.4s' }}>
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-2xl border border-[hsl(340,82%,58%)]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-[hsl(340,82%,58%)] animate-pulse" />
                <div className="text-white font-bold text-lg">Live Activity</div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Sarah M.", action: "just sold a fitness course for", amount: "$197", time: "2 min ago", icon: Video },
                  { name: "Mike D.", action: "earned from product sale", amount: "$89", time: "5 min ago", icon: ShoppingBag },
                  { name: "Jessica K.", action: "got their first 100 followers", amount: "", time: "8 min ago", icon: Users },
                  { name: "Chris P.", action: "went live and earned", amount: "$543", time: "12 min ago", icon: Eye }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(340,82%,58%)] to-[hsl(280,70%,60%)] flex items-center justify-center">
                        <activity.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/90 text-sm">
                          <span className="font-bold">{activity.name}</span> {activity.action} {activity.amount && <span className="text-[hsl(340,82%,58%)] font-black">{activity.amount}</span>}
                        </div>
                        <div className="text-white/40 text-xs">{activity.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="text-[hsl(340,82%,58%)] font-bold">+247 creators joined today</div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="pt-12 sm:pt-16 animate-fade-in px-4" style={{ animationDelay: '1.6s' }}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              Real Creators. Real <span className="text-[hsl(340,82%,58%)]">Results</span>.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { name: "Alex Rivera", role: "Fitness Coach", earnings: "$12K/mo", quote: "I made more in my first month here than 2 years on other platforms combined. The AI listing tool is a game changer.", avatar: "💪" },
                { name: "Emma Chen", role: "Art Teacher", earnings: "$8.5K/mo", quote: "Finally a platform that values creators. My students love the course format and I love the earnings!", avatar: "🎨" },
                { name: "Jordan Lee", role: "Business Coach", earnings: "$15K/mo", quote: "Went from 0 to $15K monthly in 90 days. The audience ownership changed everything for my business.", avatar: "💼" }
              ].map((testimonial, i) => (
                <div key={i} className="glass-card rounded-3xl p-6 backdrop-blur-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(340,82%,58%)] to-[hsl(280,70%,60%)] flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold">{testimonial.name}</div>
                      <div className="text-white/60 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-white/80 text-sm leading-relaxed mb-4 italic">"{testimonial.quote}"</div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[hsl(340,82%,58%)]" />
                    <span className="text-[hsl(340,82%,58%)] font-black text-lg">{testimonial.earnings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pt-12 sm:pt-16 animate-fade-in px-4" style={{ animationDelay: '1.8s' }}>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              Common <span className="text-[hsl(340,82%,58%)]">Questions</span>
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "How do I get paid?", a: "Instant payouts to your bank account or digital wallet. You keep 90% of every sale." },
                { q: "Is it really free?", a: "100% free to join and create. We only make money when you make money (10% platform fee)." },
                { q: "How fast can I start selling?", a: "Upload a product photo, AI creates the listing in 10 seconds. You can be live in under 5 minutes." },
                { q: "Do I need followers to start?", a: "Nope! Our feed algorithm shows your content to interested buyers from day one." }
              ].map((faq, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 backdrop-blur-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[hsl(340,82%,58%)]/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[hsl(340,82%,58%)] font-black">?</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold text-lg mb-2">{faq.q}</div>
                      <div className="text-white/70 leading-relaxed">{faq.a}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA - urgency */}
          <div className="text-center pt-12 sm:pt-16 pb-12 sm:pb-16 animate-fade-in px-4" style={{ animationDelay: '2s' }}>
            <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto backdrop-blur-2xl border-2 border-[hsl(340,82%,58%)]/30">
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6">
                Your Content.<br />Your Money.<br />Your Rules.
              </div>
              <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-10 leading-relaxed">
                Every minute you wait is money left on the table.
                <br className="hidden sm:block" />
                <span className="text-[hsl(340,82%,58%)] font-bold">Join 127,000+ creators already earning.</span>
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto text-xl sm:text-2xl px-12 sm:px-20 py-8 sm:py-10 bg-gradient-to-r from-[hsl(340,82%,58%)] via-[hsl(280,70%,60%)] to-[hsl(340,82%,58%)] hover:scale-105 text-white font-black rounded-2xl shadow-[0_0_60px_hsl(340,82%,58%/0.6)] hover:shadow-[0_0_80px_hsl(340,82%,58%/0.9)] transition-all duration-300 border-2 border-white/20 animate-pulse-glow bg-[length:200%_auto] animate-gradient"
                onClick={() => navigate("/auth")}
              >
                <Zap className="mr-3 h-7 w-7 fill-current" />
                START EARNING TODAY
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(340,82%,58%)]" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(340,82%,58%)]" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(340,82%,58%)]" />
                  <span>Start earning in 24hrs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
