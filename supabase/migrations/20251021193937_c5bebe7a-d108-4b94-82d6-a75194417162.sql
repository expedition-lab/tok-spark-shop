-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  total_enrollments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course videos table
CREATE TABLE public.course_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course purchases table
CREATE TABLE public.course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  purchase_price_cents INTEGER NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

-- Courses policies (public can view published courses)
CREATE POLICY "Published courses are viewable by everyone"
  ON public.courses FOR SELECT
  USING (is_published = true OR EXISTS (
    SELECT 1 FROM public.creators 
    WHERE creators.id = courses.creator_id 
    AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can insert own courses"
  ON public.courses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.creators 
    WHERE creators.id = creator_id 
    AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can update own courses"
  ON public.courses FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.creators 
    WHERE creators.id = creator_id 
    AND creators.user_id = auth.uid()
  ));

CREATE POLICY "Creators can delete own courses"
  ON public.courses FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.creators 
    WHERE creators.id = creator_id 
    AND creators.user_id = auth.uid()
  ));

-- Course videos policies
CREATE POLICY "Videos viewable by course viewers"
  ON public.course_videos FOR SELECT
  USING (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = course_videos.course_id 
      AND courses.is_published = true
      AND (
        courses.price_cents = 0 OR
        EXISTS (
          SELECT 1 FROM public.course_purchases 
          WHERE course_purchases.course_id = courses.id 
          AND course_purchases.user_id = auth.uid()
        )
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.creators cr ON c.creator_id = cr.id
      WHERE c.id = course_videos.course_id 
      AND cr.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can manage course videos"
  ON public.course_videos FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.creators cr ON c.creator_id = cr.id
    WHERE c.id = course_videos.course_id 
    AND cr.user_id = auth.uid()
  ));

-- Course purchases policies
CREATE POLICY "Users can view own purchases"
  ON public.course_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON public.course_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for course videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-videos', 'course-videos', true);

-- Storage policies for course videos
CREATE POLICY "Course videos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-videos');

CREATE POLICY "Creators can upload course videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-videos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Creators can update own course videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-videos' AND
    auth.uid() IS NOT NULL
  );

-- Update trigger for courses
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();