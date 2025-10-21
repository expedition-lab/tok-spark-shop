import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, PlayCircle, Lock, DollarSign, Users, Clock } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          creators (
            shop_name,
            rating,
            profiles (username, avatar_url)
          ),
          course_videos (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: hasPurchased } = useQuery({
    queryKey: ["course-purchase", id, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("course_purchases")
        .select("id")
        .eq("course_id", id!)
        .eq("user_id", user.id)
        .maybeSingle();
      return !!data;
    },
  });

  const handlePurchase = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!course) return;

    try {
      if (course.price_cents === 0) {
        // Free course - just enroll
        const { error } = await supabase
          .from("course_purchases")
          .insert({
            course_id: course.id,
            user_id: user.id,
            purchase_price_cents: 0,
            payment_method: "free"
          });

        if (error) throw error;

        toast({
          title: "Enrolled!",
          description: "You can now access all course videos",
        });

        navigate(`/courses/${course.id}/watch`);
      } else {
        // Paid course - use wallet
        const { data: wallet } = await supabase
          .from("wallets")
          .select("balance_cents")
          .eq("user_id", user.id)
          .single();

        if (!wallet || wallet.balance_cents < course.price_cents) {
          toast({
            title: "Insufficient balance",
            description: "Please add funds to your wallet",
            variant: "destructive",
          });
          navigate("/wallet");
          return;
        }

        // Deduct from wallet and create purchase
        const { error: purchaseError } = await supabase
          .from("course_purchases")
          .insert({
            course_id: course.id,
            user_id: user.id,
            purchase_price_cents: course.price_cents,
            payment_method: "wallet"
          });

        if (purchaseError) throw purchaseError;

        const { error: walletError } = await supabase
          .from("wallets")
          .update({ balance_cents: wallet.balance_cents - course.price_cents })
          .eq("user_id", user.id);

        if (walletError) throw walletError;

        toast({
          title: "Purchase successful!",
          description: "You can now access all course videos",
        });

        navigate(`/courses/${course.id}/watch`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>;
  }

  const videos = course.course_videos || [];
  const sortedVideos = videos.sort((a: any, b: any) => a.order_index - b.order_index);
  const totalDuration = videos.reduce((acc: number, v: any) => acc + (v.duration_seconds || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {user && <Navigation user={user} />}
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden flex items-center justify-center">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="h-24 w-24 text-primary/40" />
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                {course.creators?.[0] && (
                  <p className="text-muted-foreground mb-4">
                    By {course.creators[0].shop_name || course.creators[0].profiles?.username}
                  </p>
                )}
                <p className="text-lg leading-relaxed">{course.description}</p>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="space-y-2">
                  {sortedVideos.map((video: any, idx: number) => (
                    <Card key={video.id}>
                      <CardHeader className="flex flex-row items-center justify-between py-4">
                        <div className="flex items-center gap-3 flex-1">
                          {video.is_preview || hasPurchased ? (
                            <PlayCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <CardTitle className="text-base">
                              {idx + 1}. {video.title}
                            </CardTitle>
                            {video.description && (
                              <CardDescription className="text-sm">{video.description}</CardDescription>
                            )}
                          </div>
                        </div>
                        {video.duration_seconds && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {Math.floor(video.duration_seconds / 60)}m
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {course.price_cents === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6" />
                        {(course.price_cents / 100).toFixed(2)}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{course.total_enrollments} students enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4" />
                      <span>{videos.length} videos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(totalDuration / 60)} minutes total</span>
                    </div>
                  </div>

                  <Separator />

                  {hasPurchased ? (
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/courses/${course.id}/watch`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handlePurchase}
                    >
                      {course.price_cents === 0 ? "Enroll for Free" : "Purchase Course"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
