import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Users, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageSeo } from "@/components/PageSeo";

const Courses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  useState(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select(`
          *,
          creators (
            shop_name,
            rating,
            profiles (username, avatar_url)
          ),
          course_videos (count)
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <PageSeo
        title="Browse creator-led courses on TokMarket"
        description="Learn from expert creators with on-demand video courses across business, art, fitness, tech and more."
        path="/courses"
      />
      {user && <Navigation user={user} />}
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gradient">Learn Anything</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover courses from expert creators on any topic
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <>
              <h2 className="sr-only">Course catalog</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <Card 
                  key={course.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.total_enrollments} students</span>
                    </div>
                    
                    {course.creators?.[0] && (
                      <div className="text-sm text-muted-foreground">
                        By {course.creators[0].shop_name || course.creators[0].profiles?.username || "Unknown"}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <DollarSign className="h-5 w-5" />
                      {course.price_cents === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>${(course.price_cents / 100).toFixed(2)}</span>
                      )}
                    </div>
                    
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course.id}`);
                      }}
                    >
                      View Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Be the first to create a course!"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
