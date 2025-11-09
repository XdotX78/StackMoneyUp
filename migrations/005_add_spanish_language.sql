-- ============================================
-- Migration: 005_add_spanish_language.sql
-- Description: Add Spanish (ES) language support to blog_posts and tags
-- Created: January 2025
-- ============================================

-- ============================================
-- Add Spanish fields to blog_posts table
-- ============================================

-- Add title_es column
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS title_es TEXT;

-- Add excerpt_es column
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS excerpt_es TEXT;

-- Add content_es column
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS content_es TEXT;

-- ============================================
-- Add Spanish fields to tags table
-- ============================================

-- Add name_es column
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS name_es TEXT;

-- Add description_es column
ALTER TABLE public.tags 
ADD COLUMN IF NOT EXISTS description_es TEXT;

-- ============================================
-- Set default values for existing records
-- ============================================

-- For blog_posts: Use English content as default for Spanish
-- (will be updated manually/via editor)
UPDATE public.blog_posts 
SET 
  title_es = title_en,
  excerpt_es = excerpt_en,
  content_es = content_en
WHERE title_es IS NULL;

-- For tags: Use English names as default for Spanish
-- (will be updated manually)
UPDATE public.tags 
SET 
  name_es = name_en,
  description_es = description_en
WHERE name_es IS NULL;

-- ============================================
-- Make Spanish fields NOT NULL after setting defaults
-- ============================================

-- Make blog_posts Spanish fields required
ALTER TABLE public.blog_posts 
ALTER COLUMN title_es SET NOT NULL;

ALTER TABLE public.blog_posts 
ALTER COLUMN excerpt_es SET NOT NULL;

ALTER TABLE public.blog_posts 
ALTER COLUMN content_es SET NOT NULL;

-- Make tags Spanish name required (description can be NULL)
ALTER TABLE public.tags 
ALTER COLUMN name_es SET NOT NULL;

-- ============================================
-- Migration Complete
-- ============================================

-- To apply this migration:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run"
-- 
-- To verify:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'blog_posts' AND column_name LIKE '%_es';
--
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'tags' AND column_name LIKE '%_es';

