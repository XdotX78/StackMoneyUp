-- ============================================
-- FIX ALL SECURITY ADVISOR WARNINGS
-- Date: November 2025
-- This script fixes all 9 warnings from Supabase Security Advisor
-- ============================================

-- ============================================
-- FUNCTIONS THAT NEED search_path FIXED
-- ============================================

-- 1. Fix get_post_share_count
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

-- 2. Fix is_bookmarked
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

-- 3. Fix update_blog_post_updated_at (if exists, otherwise create)
CREATE OR REPLACE FUNCTION public.update_blog_post_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 4. Fix set_blog_post_published_at (if exists, otherwise create)
CREATE OR REPLACE FUNCTION public.set_blog_post_published_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Set published_at timestamp when post is published for the first time
  IF NEW.published = true AND OLD.published = false AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Fix update_tag_updated_at (if exists, otherwise create)
CREATE OR REPLACE FUNCTION public.update_tag_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 6. Fix update_tag_post_count (if exists, otherwise create)
CREATE OR REPLACE FUNCTION public.update_tag_post_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
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
      UPDATE tags
      SET post_count = GREATEST(0, post_count - 1)
      WHERE slug = tag_slug;
    END IF;
  END LOOP;

  -- Increment counts for new tags
  FOREACH tag_slug IN ARRAY new_tags
  LOOP
    IF NOT (tag_slug = ANY(old_tags)) THEN
      UPDATE tags
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
$$;

-- 7. Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, role, name, avatar_url)
  VALUES (
    NEW.id,
    'user', -- Default role
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$;

-- 8. Fix sync_user_role_to_metadata
CREATE OR REPLACE FUNCTION public.sync_user_role_to_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the user's metadata with their role
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- ENSURE TRIGGERS ARE PROPERLY SET UP
-- ============================================

-- Trigger for handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger for sync_user_role_to_metadata
DROP TRIGGER IF EXISTS sync_role_to_metadata ON public.profiles;
CREATE TRIGGER sync_role_to_metadata
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_to_metadata();

-- Trigger for update_blog_post_updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_post_updated_at();

-- Trigger for set_blog_post_published_at
DROP TRIGGER IF EXISTS set_blog_post_published_timestamp ON public.blog_posts;
CREATE TRIGGER set_blog_post_published_timestamp
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  WHEN (NEW.published IS DISTINCT FROM OLD.published)
  EXECUTE FUNCTION public.set_blog_post_published_at();

-- Trigger for update_tag_updated_at
DROP TRIGGER IF EXISTS update_tags_updated_at ON public.tags;
CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_updated_at();

-- Trigger for update_tag_post_count (multiple triggers for INSERT/UPDATE/DELETE)
DROP TRIGGER IF EXISTS update_tag_counts_on_post_insert ON public.blog_posts;
CREATE TRIGGER update_tag_counts_on_post_insert
  AFTER INSERT ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_post_count();

DROP TRIGGER IF EXISTS update_tag_counts_on_post_update ON public.blog_posts;
CREATE TRIGGER update_tag_counts_on_post_update
  AFTER UPDATE ON public.blog_posts
  FOR EACH ROW
  WHEN (OLD.tags IS DISTINCT FROM NEW.tags)
  EXECUTE FUNCTION public.update_tag_post_count();

DROP TRIGGER IF EXISTS update_tag_counts_on_post_delete ON public.blog_posts;
CREATE TRIGGER update_tag_counts_on_post_delete
  AFTER DELETE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tag_post_count();

-- ============================================
-- VERIFICATION QUERY
-- ============================================

SELECT 
  '✅ All functions fixed!' as message,
  'Run this query to verify:' as instruction;

-- Query to check all SECURITY DEFINER functions have search_path set:
SELECT 
  n.nspname as schema,
  p.proname as function_name,
  CASE 
    WHEN p.proconfig IS NOT NULL AND EXISTS (
      SELECT 1 FROM unnest(p.proconfig) AS config 
      WHERE config LIKE 'search_path=%'
    ) 
    THEN '✅ SET' 
    ELSE '⚠️ NOT SET' 
  END as search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND (p.prosecdef = true OR p.provolatile != 'i')  -- SECURITY DEFINER or non-immutable
ORDER BY search_path_status, p.proname;

-- ============================================
-- INSTRUCTIONS FOR LEAKED PASSWORD PROTECTION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🔐 IMPORTANT: Enable Leaked Password Protection';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  This CANNOT be fixed via SQL - You must enable it manually:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Go to your Supabase Dashboard';
  RAISE NOTICE '2. Navigate to: Authentication → Settings';
  RAISE NOTICE '3. Scroll to "Leaked Password Protection"';
  RAISE NOTICE '4. Click the toggle to ENABLE';
  RAISE NOTICE '';
  RAISE NOTICE 'This will check user passwords against HaveIBeenPwned database';
  RAISE NOTICE 'URL: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/auth';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

