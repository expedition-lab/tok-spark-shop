
-- 1. Engagements: restrict SELECT to owner
DROP POLICY IF EXISTS "Users can view all engagements" ON public.engagements;
CREATE POLICY "Users can view own engagements"
  ON public.engagements FOR SELECT
  USING (auth.uid() = user_id);

-- 2. user_roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. course-videos storage: enforce ownership via path prefix = user id
DROP POLICY IF EXISTS "Creators can upload course videos" ON storage.objects;
DROP POLICY IF EXISTS "Creators can update own course videos" ON storage.objects;

CREATE POLICY "Creators can upload own course videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Creators can update own course videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Creators can delete own course videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Fix mutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
