-- ============================================
-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for StackMoneyUp
-- Created: January 2025
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Profiles Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================
-- Tags Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_it TEXT NOT NULL,
  description_en TEXT,
  description_it TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tags
CREATE POLICY "Public can read tags"
  ON public.tags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Editors and admins can insert tags"
  ON public.tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can update tags"
  ON public.tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors and admins can delete tags"
  ON public.tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_idx ON public.tags(slug);
CREATE INDEX IF NOT EXISTS tags_post_count_idx ON public.tags(post_count);

-- ============================================
-- Blog Posts Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_it TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  excerpt_it TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_it TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  read_time INTEGER,
  scheduled_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  reads INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Public can read published posts"
  ON public.blog_posts
  FOR SELECT
  TO public
  USING (published = true AND (published_at IS NULL OR published_at <= NOW()));

CREATE POLICY "Authenticated users can read all posts"
  ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors and admins can insert posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Authors and admins can update posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authors and admins can delete posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_tags_gin_idx ON public.blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON public.blog_posts(published_at);

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    'user',
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tags_updated_at ON public.tags;
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update tag counts when posts change
CREATE OR REPLACE FUNCTION public.update_tag_counts_on_post_change()
RETURNS TRIGGER AS $$
DECLARE
  old_tags TEXT[];
  new_tags TEXT[];
  tag_slug TEXT;
BEGIN
  -- Get old and new tag arrays
  IF TG_OP = 'DELETE' THEN
    old_tags := OLD.tags;
    new_tags := ARRAY[]::TEXT[];
  ELSIF TG_OP = 'UPDATE' THEN
    old_tags := OLD.tags;
    new_tags := NEW.tags;
  ELSE -- INSERT
    old_tags := ARRAY[]::TEXT[];
    new_tags := NEW.tags;
  END IF;

  -- Decrement counts for removed tags
  FOREACH tag_slug IN ARRAY old_tags
  LOOP
    IF NOT (tag_slug = ANY(new_tags)) THEN
      UPDATE public.tags
      SET post_count = GREATEST(0, post_count - 1)
      WHERE slug = tag_slug;
    END IF;
  END LOOP;

  -- Increment counts for new tags
  FOREACH tag_slug IN ARRAY new_tags
  LOOP
    IF NOT (tag_slug = ANY(old_tags)) THEN
      UPDATE public.tags
      SET post_count = post_count + 1
      WHERE slug = tag_slug;
    END IF;
  END LOOP;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Triggers for tag count updates
DROP TRIGGER IF EXISTS update_tag_counts_on_post_insert ON public.blog_posts;
CREATE TRIGGER update_tag_counts_on_post_insert
  AFTER INSERT ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_counts_on_post_change();

DROP TRIGGER IF EXISTS update_tag_counts_on_post_update ON public.blog_posts;
CREATE TRIGGER update_tag_counts_on_post_update
  AFTER UPDATE ON public.blog_posts
  FOR EACH ROW
  WHEN (OLD.tags IS DISTINCT FROM NEW.tags)
  EXECUTE FUNCTION public.update_tag_counts_on_post_change();

DROP TRIGGER IF EXISTS update_tag_counts_on_post_delete ON public.blog_posts;
CREATE TRIGGER update_tag_counts_on_post_delete
  AFTER DELETE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_counts_on_post_change();

-- ============================================
-- Permissions
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT SELECT ON public.profiles TO public;
GRANT SELECT ON public.blog_posts TO public;
GRANT SELECT ON public.tags TO public;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO public;

-- ============================================
-- Migration Complete
-- ============================================

