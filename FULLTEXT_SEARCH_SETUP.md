# Full-Text Search Setup Guide

This guide explains how to set up and use the full-text search feature for blog posts.

## Overview

The full-text search uses PostgreSQL's built-in full-text search capabilities with:
- **GIN indexes** for fast searching
- **Weighted search** (title > excerpt > content)
- **Automatic updates** via database triggers
- **Server-side search** for better performance

## Database Setup

### Step 1: Run the Migration

Run the migration file in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of migrations/004_fulltext_search.sql
-- Or run it via Supabase CLI
```

The migration will:
1. Add a `search_vector` column to `blog_posts`
2. Create a GIN index for fast searching
3. Set up triggers to auto-update search vectors
4. Create the `search_blog_posts()` function
5. Populate search vectors for existing posts

### Step 2: Verify Setup

Check that everything is set up correctly:

```sql
-- Check search_vector column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name = 'search_vector';

-- Check search function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'search_blog_posts';

-- Check GIN index exists
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'blog_posts' 
AND indexname = 'blog_posts_search_vector_idx';
```

All queries should return results.

## How It Works

### Search Vector

The `search_vector` column contains a `tsvector` (text search vector) that combines:
- **Title (weight A)** - Highest priority
- **Excerpt (weight B)** - Medium priority  
- **Content (weight C)** - Lower priority
- **Category (weight A)** - Highest priority
- **Tags (weight B)** - Medium priority

### Search Function

The `search_blog_posts()` function:
- Takes a search query string
- Converts it to a `tsquery` using `plainto_tsquery()`
- Matches against the `search_vector` using `@@` operator
- Ranks results by relevance using `ts_rank()`
- Supports category and tag filtering

### Automatic Updates

A database trigger automatically updates the `search_vector` whenever:
- A post is created
- A post is updated (title, content, tags, etc.)

## Usage in Code

### Basic Search

```typescript
import { searchPosts } from '@/lib/blog';

// Search all posts
const results = await searchPosts('investment strategies');
```

### Search with Filters

```typescript
// Search with category filter
const results = await searchPosts('investment', {
  category: 'investing',
  tags: ['stocks', 'bonds'],
  limit: 20,
});
```

### Frontend Integration

The search is automatically integrated in the blog page:
- When user types in search box → triggers server-side search
- When user selects category/tags → combined with search
- 300ms debounce to avoid too many requests

## Search Features

### Supported Features

✅ **Full-text search** across titles, content, tags, categories  
✅ **Relevance ranking** (most relevant first)  
✅ **Category filtering** combined with search  
✅ **Tag filtering** combined with search  
✅ **Multi-language** support (EN/IT)  
✅ **Automatic updates** when posts change  
✅ **Fallback** to basic search if full-text fails  

### Search Behavior

- **Case-insensitive** - "Investment" matches "investment"
- **Partial matching** - "invest" matches "investment", "investing"
- **Multi-word** - "investment strategies" searches for both words
- **Ranked results** - Most relevant posts appear first
- **Fast** - Uses GIN index for quick lookups

## Performance

### Index Performance

The GIN index provides:
- **Fast search** even with thousands of posts
- **Scalable** to millions of documents
- **Efficient** storage and updates

### Search Performance Tips

1. **Limit results** - Use `limit` option to restrict results
2. **Debounce** - Search is debounced by 300ms in the UI
3. **Cache** - Consider caching popular searches
4. **Monitor** - Watch query performance in Supabase dashboard

## Troubleshooting

### Search Returns No Results

**Problem:** Search function not working.

**Solutions:**
1. Verify migration ran successfully
2. Check if `search_vector` column has data:
   ```sql
   SELECT id, search_vector FROM blog_posts LIMIT 1;
   ```
3. Manually update a post to trigger search vector update:
   ```sql
   UPDATE blog_posts SET title_en = title_en WHERE id = 'some-id';
   ```

### Search Vector is NULL

**Problem:** `search_vector` column is NULL for posts.

**Solution:**
```sql
-- Manually update all posts to populate search vectors
UPDATE blog_posts
SET search_vector =
  setweight(to_tsvector('english', COALESCE(title_en, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(title_it, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(excerpt_en, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(excerpt_it, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(content_en, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(content_it, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'B');
```

### Function Not Found Error

**Problem:** `search_blog_posts` function doesn't exist.

**Solution:**
1. Re-run the migration
2. Check function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'search_blog_posts';
   ```

### Slow Searches

**Problem:** Search is slow.

**Solutions:**
1. Verify GIN index exists:
   ```sql
   SELECT * FROM pg_indexes WHERE indexname = 'blog_posts_search_vector_idx';
   ```
2. Analyze the table:
   ```sql
   ANALYZE blog_posts;
   ```
3. Check index usage:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM search_blog_posts('test query');
   ```

## Advanced Usage

### Custom Search Weights

To adjust search weights, modify the trigger function:

```sql
CREATE OR REPLACE FUNCTION public.update_blog_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title_en, '')), 'A') ||
    -- Adjust weights here (A=highest, D=lowest)
    setweight(to_tsvector('english', COALESCE(NEW.content_en, '')), 'B'); -- Changed from 'C' to 'B'
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Language-Specific Search

To add language-specific search, modify the search function to use different text search configurations:

```sql
-- For Italian posts, use 'italian' configuration
to_tsvector('italian', COALESCE(NEW.title_it, ''))
```

### Fuzzy Search

For typo tolerance, you can add fuzzy matching using `pg_trgm` extension:

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add trigram index
CREATE INDEX blog_posts_title_trgm_idx 
ON blog_posts 
USING GIN (title_en gin_trgm_ops);
```

## Best Practices

1. **Always run migrations in order** - Full-text search depends on blog_posts table
2. **Monitor search performance** - Use EXPLAIN ANALYZE to check query plans
3. **Keep search vectors updated** - Triggers handle this automatically
4. **Test search regularly** - Verify search works after content updates
5. **Consider caching** - Cache popular search queries for better performance

## References

- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)
- [GIN Indexes](https://www.postgresql.org/docs/current/gin.html)

