-- Bookmarks Table
-- Allows users to save favorite blog posts

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id) -- Prevent duplicate bookmarks
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at);

-- RLS Policies
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to check if a post is bookmarked by user
CREATE OR REPLACE FUNCTION public.is_bookmarked(post_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookmarks
    WHERE post_id = post_uuid AND user_id = user_uuid
  );
END;
$$;


