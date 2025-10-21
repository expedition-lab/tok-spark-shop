import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, PlayCircle } from "lucide-react";

const CourseWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/auth");
      } else {
        setUser(data.user);
      }
    });
  }, [navigate]);

  const { data: course } = useQuery({
    queryKey: ["course-watch", id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          course_videos (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: hasPurchased } = useQuery({
    queryKey: ["course-purchase-check", id, user?.id],
    enabled: !!user && !!course,
    queryFn: async () => {
      if (course?.price_cents === 0) return true;
      
      const { data } = await supabase
        .from("course_purchases")
        .select("id")
        .eq("course_id", id!)
        .eq("user_id", user.id)
        .maybeSingle();
      return !!data;
    },
  });

  useEffect(() => {
    if (hasPurchased === false) {
      navigate(`/courses/${id}`);
    }
  }, [hasPurchased, id, navigate]);

  useEffect(() => {
    if (course?.course_videos && !selectedVideo) {
      const sorted = [...course.course_videos].sort((a: any, b: any) => a.order_index - b.order_index);
      setSelectedVideo(sorted[0]);
    }
  }, [course, selectedVideo]);

  if (!course || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const videos = [...(course.course_videos || [])].sort((a: any, b: any) => a.order_index - b.order_index);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation user={user} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate(`/courses/${id}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {selectedVideo ? (
                <>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video 
                      key={selectedVideo.video_url}
                      controls 
                      className="w-full h-full"
                      src={selectedVideo.video_url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{selectedVideo.title}</h1>
                    {selectedVideo.description && (
                      <p className="text-muted-foreground">{selectedVideo.description}</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Select a video to start watching</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold">Course Content</h2>
              <div className="space-y-2">
                {videos.map((video: any, idx: number) => (
                  <Card 
                    key={video.id}
                    className={`cursor-pointer transition-colors ${
                      selectedVideo?.id === video.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-3">
                        <PlayCircle className={`h-5 w-5 mt-0.5 ${
                          selectedVideo?.id === video.id ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium">
                            {idx + 1}. {video.title}
                          </CardTitle>
                          {video.description && (
                            <CardDescription className="text-xs mt-1 line-clamp-2">
                              {video.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseWatch;
