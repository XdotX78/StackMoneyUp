-- Share Tracking Table
-- Tracks social media shares for blog posts

CREATE TABLE IF NOT EXISTS share_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'twitter', 'facebook', 'linkedin', 'copy'
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional: track if user is logged in
  ip_address INET, -- Optional: track IP for analytics
  user_agent TEXT, -- Optional: track browser/device
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_share_tracking_post_id ON share_tracking(post_id);
CREATE INDEX IF NOT EXISTS idx_share_tracking_platform ON share_tracking(platform);
CREATE INDEX IF NOT EXISTS idx_share_tracking_shared_at ON share_tracking(shared_at);
CREATE INDEX IF NOT EXISTS idx_share_tracking_user_id ON share_tracking(user_id);

-- RLS Policies
ALTER TABLE share_tracking ENABLE ROW LEVEL SECURITY;

-- Anyone can track shares (for analytics)
CREATE POLICY "Anyone can insert share tracking"
  ON share_tracking
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Users can view their own shares
CREATE POLICY "Users can view own shares"
  ON share_tracking
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all shares
CREATE POLICY "Admins can view all shares"
  ON share_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Function to get share count for a post
CREATE OR REPLACE FUNCTION public.get_post_share_count(post_uuid UUID)
RETURNS TABLE (
  platform VARCHAR,
  count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.platform,
    COUNT(*)::BIGINT as count
  FROM share_tracking st
  WHERE st.post_id = post_uuid
  GROUP BY st.platform;
END;
$$;


