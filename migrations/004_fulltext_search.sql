-- migrations/004_fulltext_search.sql

-- Enable full-text search for blog posts
-- This migration adds full-text search capabilities to the blog_posts table

-- Create a function to generate searchable text from blog post content
CREATE OR REPLACE FUNCTION public.generate_search_text(
  title_en TEXT,
  title_it TEXT,
  excerpt_en TEXT,
  excerpt_it TEXT,
  content_en TEXT,
  content_it TEXT,
  category TEXT,
  tags TEXT[]
)
RETURNS TEXT AS $$
BEGIN
  -- Combine all searchable fields into a single text
  RETURN COALESCE(title_en, '') || ' ' ||
         COALESCE(title_it, '') || ' ' ||
         COALESCE(excerpt_en, '') || ' ' ||
         COALESCE(excerpt_it, '') || ' ' ||
         COALESCE(content_en, '') || ' ' ||
         COALESCE(content_it, '') || ' ' ||
         COALESCE(category, '') || ' ' ||
         COALESCE(array_to_string(tags, ' '), '');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add a computed column for full-text search (using GIN index)
-- We'll use a generated column with a tsvector for better performance
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create a function to update the search vector
CREATE OR REPLACE FUNCTION public.update_blog_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title_en, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.title_it, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt_en, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.excerpt_it, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_en, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.content_it, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'B');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search_vector on insert/update
DROP TRIGGER IF EXISTS update_blog_post_search_vector_trigger ON public.blog_posts;
CREATE TRIGGER update_blog_post_search_vector_trigger
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_post_search_vector();

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS blog_posts_search_vector_idx 
ON public.blog_posts 
USING GIN (search_vector);

-- Update existing posts to populate search_vector
UPDATE public.blog_posts
SET search_vector =
  setweight(to_tsvector('english', COALESCE(title_en, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(title_it, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(excerpt_en, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(excerpt_it, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(content_en, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(content_it, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'B');

-- Create a function to search blog posts with full-text search
CREATE OR REPLACE FUNCTION public.search_blog_posts(
  search_query TEXT,
  lang_filter TEXT DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  tags_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title_en TEXT,
  title_it TEXT,
  excerpt_en TEXT,
  excerpt_it TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[],
  read_time INTEGER,
  published_at TIMESTAMPTZ,
  search_rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.slug,
    bp.title_en,
    bp.title_it,
    bp.excerpt_en,
    bp.excerpt_it,
    bp.cover_image,
    bp.category,
    bp.tags,
    bp.read_time,
    bp.published_at,
    ts_rank(bp.search_vector, plainto_tsquery('english', search_query)) as search_rank
  FROM public.blog_posts bp
  WHERE 
    bp.published = TRUE
    AND bp.search_vector @@ plainto_tsquery('english', search_query)
    AND (lang_filter IS NULL OR lang_filter = 'all')
    AND (category_filter IS NULL OR category_filter = 'all' OR bp.category = category_filter)
    AND (tags_filter IS NULL OR array_length(tags_filter, 1) IS NULL OR bp.tags && tags_filter)
  ORDER BY search_rank DESC, bp.published_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql STABLE;

