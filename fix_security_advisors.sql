-- ============================================
-- Fix Security Advisor Warnings
-- Date: November 2025
-- ============================================

-- ============================================
-- FIX 1: Function Search Path Mutable
-- Add SET search_path to all SECURITY DEFINER functions
-- ============================================

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, avatar_url)
  VALUES (
    NEW.id,
    'user', -- Default role
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$;

-- Fix sync_user_role_to_metadata function (if it exists)
-- This function syncs user role from profiles to auth.users metadata
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

-- Recreate trigger for sync_user_role_to_metadata
DROP TRIGGER IF EXISTS sync_role_to_metadata ON public.profiles;
CREATE TRIGGER sync_role_to_metadata
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_to_metadata();

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_comment_updated_at function (if exists)
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

-- Fix get_post_share_count function (if exists)
CREATE OR REPLACE FUNCTION public.get_post_share_count(post_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  share_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO share_count
  FROM public.share_tracking st
  JOIN public.blog_posts bp ON st.post_id = bp.id
  WHERE bp.slug = post_slug;
  
  RETURN COALESCE(share_count, 0);
END;
$$;

-- Fix is_bookmarked function (if exists)
CREATE OR REPLACE FUNCTION public.is_bookmarked(post_slug TEXT, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bookmark_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM public.bookmarks b
    JOIN public.blog_posts bp ON b.post_id = bp.id
    WHERE bp.slug = post_slug
      AND b.user_id = user_id
  ) INTO bookmark_exists;
  
  RETURN COALESCE(bookmark_exists, false);
END;
$$;

-- Fix increment_post_views function (if exists)
CREATE OR REPLACE FUNCTION public.increment_post_views(post_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE slug = post_slug;
END;
$$;

-- Fix increment_post_reads function (if exists)
CREATE OR REPLACE FUNCTION public.increment_post_reads(post_slug TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET reads = reads + 1
  WHERE slug = post_slug;
END;
$$;

-- ============================================
-- VERIFICATION
-- ============================================

-- List all functions with SECURITY DEFINER to verify they have search_path set
DO $$
DECLARE
  func_record RECORD;
  func_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Checking SECURITY DEFINER functions...';
  
  FOR func_record IN 
    SELECT 
      n.nspname as schema,
      p.proname as function_name,
      pg_get_function_arguments(p.oid) as arguments,
      CASE WHEN p.proconfig IS NOT NULL THEN 'SET' ELSE 'NOT SET' END as search_path_status
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.prosecdef = true  -- SECURITY DEFINER functions
      AND n.nspname = 'public'
  LOOP
    func_count := func_count + 1;
    RAISE NOTICE 'Function: %.%() - search_path: %',
      func_record.schema,
      func_record.function_name,
      func_record.search_path_status;
  END LOOP;
  
  RAISE NOTICE 'Total SECURITY DEFINER functions checked: %', func_count;
END $$;

-- ============================================
-- NOTES FOR LEAKED PASSWORD PROTECTION
-- ============================================

-- Leaked Password Protection must be enabled in Supabase Dashboard:
-- 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/auth
-- 2. Find "Leaked Password Protection" section
-- 3. Click "Enable"
-- 4. This checks user passwords against known leaked password databases (HaveIBeenPwned)

-- This CANNOT be fixed via SQL - must be done through the dashboard UI.

-- ============================================
-- Migration Complete
-- ============================================

SELECT 'Security Advisor fixes applied successfully!' as message;

