-- ============================================
-- Migration: 003_comments_schema.sql
-- Description: Comments system for blog posts
-- Created: January 2025
-- ============================================

-- ============================================
-- Comments Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT true, -- Set to false if moderation is enabled
  edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS comments_author_id_idx ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS comments_approved_idx ON public.comments(approved);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS comments_post_approved_created_idx 
  ON public.comments(post_id, approved, created_at DESC);

-- ============================================
-- RLS Policies
-- ============================================

-- Public can read approved comments
CREATE POLICY "Public can read approved comments"
  ON public.comments
  FOR SELECT
  TO public
  USING (approved = true);

-- Authenticated users can read all comments (for moderation)
CREATE POLICY "Authenticated users can read all comments"
  ON public.comments
  FOR SELECT
  TO authenticated
  USING (
    approved = true
    OR author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = post_id
      AND blog_posts.published = true
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON public.comments
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Admins and editors can moderate comments
CREATE POLICY "Admins and editors can moderate comments"
  ON public.comments
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

-- Admins and editors can delete any comment
CREATE POLICY "Admins and editors can delete any comment"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at and mark as edited
CREATE OR REPLACE FUNCTION public.update_comment_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    NEW.edited = true;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_updated_at();

-- ============================================
-- Permissions
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT SELECT ON public.comments TO public;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO public;

-- ============================================
-- Migration Complete
-- ============================================

-- Optional: Add comment count to blog_posts (can be calculated on the fly)
-- Or create a materialized view for performance

