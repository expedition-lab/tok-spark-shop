-- Update the handle_new_user function to auto-create creator profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  creator_shop_name text;
BEGIN
  -- Determine shop name from different auth sources
  IF NEW.raw_user_meta_data->>'username' IS NOT NULL THEN
    creator_shop_name := NEW.raw_user_meta_data->>'username';
  ELSIF NEW.raw_user_meta_data->>'display_name' IS NOT NULL THEN
    creator_shop_name := NEW.raw_user_meta_data->>'display_name';
  ELSIF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    creator_shop_name := NEW.raw_user_meta_data->>'full_name';
  ELSIF NEW.email IS NOT NULL THEN
    creator_shop_name := split_part(NEW.email, '@', 1);
  ELSE
    creator_shop_name := 'Creator_' || substring(NEW.id::text, 1, 8);
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, points, balance_cents)
  VALUES (NEW.id, 0, 0);
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Auto-create creator profile for ALL users
  INSERT INTO public.creators (user_id, shop_name, verified, rating, total_sales)
  VALUES (
    NEW.id,
    creator_shop_name,
    false,
    0,
    0
  );
  
  RETURN NEW;
END;
$function$;