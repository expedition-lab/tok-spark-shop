-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'creator', 'user');
CREATE TYPE public.product_category AS ENUM ('fashion', 'beauty', 'electronics', 'home', 'sports', 'art', 'other');
CREATE TYPE public.engagement_type AS ENUM ('view', 'like', 'share', 'comment');
CREATE TYPE public.order_status AS ENUM ('pending', 'completed', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create creators table
CREATE TABLE public.creators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  shop_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  total_sales INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  category product_category,
  tags TEXT[],
  images TEXT[],
  ai_generated BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create posts table (shoppable feed posts)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wallets table (points and balance)
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  balance_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create engagements table
CREATE TABLE public.engagements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  engagement_type engagement_type NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id, engagement_type)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_cents INTEGER NOT NULL,
  status order_status DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ai_listings table
CREATE TABLE public.ai_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  vision_analysis JSONB,
  price_suggestion_cents INTEGER,
  languages TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_listings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to add points
CREATE OR REPLACE FUNCTION public.add_points(_user_id UUID, _points INTEGER)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id, points)
  VALUES (_user_id, _points)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    points = wallets.points + _points,
    updated_at = NOW();
END;
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for creators
CREATE POLICY "Creators are viewable by everyone"
ON public.creators FOR SELECT
USING (true);

CREATE POLICY "Users can create creator profile"
ON public.creators FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update own profile"
ON public.creators FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Creators can create products"
ON public.products FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.creators
    WHERE id = creator_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Creators can update own products"
ON public.products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.creators
    WHERE id = creator_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Creators can delete own products"
ON public.products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.creators
    WHERE id = creator_id AND user_id = auth.uid()
  )
);

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone"
ON public.posts FOR SELECT
USING (true);

CREATE POLICY "Creators can create posts"
ON public.posts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.creators
    WHERE id = creator_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Creators can update own posts"
ON public.posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.creators
    WHERE id = creator_id AND user_id = auth.uid()
  )
);

-- RLS Policies for wallets
CREATE POLICY "Users can view own wallet"
ON public.wallets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
ON public.wallets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for engagements
CREATE POLICY "Users can view all engagements"
ON public.engagements FOR SELECT
USING (true);

CREATE POLICY "Users can create engagements"
ON public.engagements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = buyer_id OR EXISTS (
  SELECT 1 FROM public.creators
  WHERE id = creator_id AND user_id = auth.uid()
));

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for ai_listings
CREATE POLICY "AI listings are viewable by everyone"
ON public.ai_listings FOR SELECT
USING (true);

CREATE POLICY "Creators can insert AI listings"
ON public.ai_listings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.creators c ON p.creator_id = c.id
    WHERE p.id = product_id AND c.user_id = auth.uid()
  )
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
BEFORE UPDATE ON public.wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, points, balance_cents)
  VALUES (NEW.id, 0, 0);
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();