import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Video } from "lucide-react";
import { PageSeo } from "@/components/PageSeo";

const ManageCourses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_cents: 0,
    category: "",
    is_published: false,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/auth");
      } else {
        setUser(data.user);
        
        // Get creator profile
        supabase
          .from("creators")
          .select("*")
          .eq("user_id", data.user.id)
          .maybeSingle()
          .then(({ data: creatorData }) => {
            if (!creatorData) {
              toast({
                title: "Creator profile required",
                description: "Please create a creator profile first",
                variant: "destructive",
              });
              navigate("/dashboard");
            } else {
              setCreator(creatorData);
            }
          });
      }
    });
  }, [navigate, toast]);

  const { data: courses } = useQuery({
    queryKey: ["my-courses", creator?.id],
    enabled: !!creator,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          course_videos (count)
        `)
        .eq("creator_id", creator.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      const { data, error } = await supabase
        .from("courses")
        .insert({ ...courseData, creator_id: creator.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      setIsCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        price_cents: 0,
        category: "",
        is_published: false,
      });
      toast({
        title: "Course created",
        description: "You can now add videos to your course",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      toast({
        title: "Course deleted",
        description: "The course has been removed",
      });
    },
  });

  if (!user || !creator) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <PageSeo
        title="My courses — TokMarket"
        description="Create, edit, and publish your TokMarket video courses, and manage their lessons."
        path="/manage-courses"
      />
      <Navigation user={user} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Courses</h1>
              <p className="text-muted-foreground">Create and manage your educational content</p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>Fill in the details for your new course</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Introduction to React"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Learn the fundamentals of React..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price_cents / 100}
                      onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value) * 100) })}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Programming, Business, Art..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Publish immediately</Label>
                    <Switch
                      id="published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    onClick={() => createCourseMutation.mutate(formData)}
                    disabled={!formData.title || createCourseMutation.isPending}
                  >
                    Create Course
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {courses && courses.length > 0 ? (
            <>
              <h2 className="sr-only">Your courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: any) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">
                          {course.price_cents === 0 ? "Free" : `$${(course.price_cents / 100).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{course.total_enrollments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={course.is_published ? "text-green-600" : "text-amber-600"}>
                          {course.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/manage-courses/${course.id}/videos`)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Videos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Edit ${course.title}`}
                      onClick={() => navigate(`/manage-courses/${course.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Delete ${course.title}`}
                      onClick={() => {
                        if (confirm("Delete this course?")) {
                          deleteCourseMutation.mutate(course.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <PlusCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course to start teaching</p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCourses;
