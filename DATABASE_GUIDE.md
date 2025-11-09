# 📊 Complete Database & Architecture Guide

**Last Updated:** January 2025  
**Database:** Supabase (PostgreSQL)  
**Project:** StackMoneyUp - Personal Finance Blog Platform

This comprehensive guide covers database schema, relationships, full-text search, Row Level Security (RLS), and testing.

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Schema & Tables](#2-schema--tables)
3. [Categories & Tags Architecture](#3-categories--tags-architecture)
4. [Full-Text Search Setup](#4-full-text-search-setup)
5. [Row Level Security (RLS)](#5-row-level-security-rls)
6. [RLS Testing Guide](#6-rls-testing-guide)

---

## 1. Database Overview

StackMoneyUp uses **Supabase (PostgreSQL)** for data storage with:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Multi-language support (English/Italian)
- ✅ Automatic tag management via triggers
- ✅ Full-text search with GIN indexes
- ✅ Role-based access control (admin/editor/user)

---

## 2. Schema & Tables

### 2.1. `profiles` Table

User profile information including roles and metadata.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Columns:**
- `id` (UUID) - Primary key, references `auth.users(id)`
- `role` (TEXT) - User role: `'admin'`, `'editor'`, or `'user'`
- `full_name` (TEXT) - User's display name
- `avatar_url` (TEXT) - URL to profile avatar
- `bio` (TEXT) - User biography
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `profiles_role_idx` - Index on `role` for faster role-based queries

**Triggers:**
- `handle_new_user()` - Automatically creates profile when user signs up
- `update_updated_at_column()` - Updates `updated_at` on changes
- `sync_user_role_to_metadata()` - Syncs role to auth.users metadata

---

### 2.2. `blog_posts` Table

Blog posts with multi-language support and analytics.

```sql
CREATE TABLE public.blog_posts (
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
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);
```

**Columns:**
- `id` (UUID) - Primary key
- `slug` (TEXT) - URL-friendly identifier (unique)
- `title_en`, `title_it` (TEXT) - Post titles in English and Italian
- `excerpt_en`, `excerpt_it` (TEXT) - Post excerpts
- `content_en`, `content_it` (TEXT) - Full post content (JSON for rich text)
- `cover_image` (TEXT) - URL to cover image
- `category` (TEXT) - Post category (default: 'general')
- `tags` (TEXT[]) - Array of tag slugs (e.g., `['investing', 'compound-interest']`)
- `published` (BOOLEAN) - Whether post is published
- `featured` (BOOLEAN) - Whether post is featured
- `read_time` (INTEGER) - Estimated reading time in minutes
- `scheduled_at` (TIMESTAMPTZ) - Scheduled publication date
- `author_id` (UUID) - Reference to post author
- `views` (INTEGER) - View count
- `reads` (INTEGER) - Read count (tracked when user reads full post)
- `shares` (INTEGER) - Share count
- `search_vector` (TSVECTOR) - Full-text search vector
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp
- `published_at` (TIMESTAMPTZ) - Publication timestamp

**Indexes:**
- `blog_posts_slug_idx` - Unique index on `slug`
- `blog_posts_published_idx` - Index on `published` for filtering
- `blog_posts_category_idx` - Index on `category` for filtering
- `blog_posts_tags_gin_idx` - GIN index on `tags` array for fast tag searches
- `blog_posts_author_id_idx` - Index on `author_id` for author queries
- `blog_posts_search_vector_idx` - GIN index on `search_vector` for full-text search

**Triggers:**
- `update_blog_posts_updated_at()` - Updates `updated_at` on changes
- `update_tag_counts_on_post_change()` - Updates tag `post_count` when posts change
- `update_blog_post_search_vector()` - Updates search vector automatically
- `set_blog_post_published_at()` - Sets `published_at` when post is published

---

### 2.3. `tags` Table

Tag metadata with multi-language support and automatic post count tracking.

```sql
CREATE TABLE public.tags (
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
```

**Columns:**
- `id` (UUID) - Primary key
- `slug` (TEXT) - URL-friendly identifier (unique, used in `blog_posts.tags` array)
- `name_en`, `name_it` (TEXT) - Tag names in English and Italian
- `description_en`, `description_it` (TEXT) - Optional tag descriptions
- `post_count` (INTEGER) - Number of posts using this tag (auto-updated)
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `tags_slug_idx` - Unique index on `slug`
- `tags_post_count_idx` - Index on `post_count` for sorting

**Triggers:**
- `update_tags_updated_at()` - Updates `updated_at` on changes
- `update_tag_counts_on_post_insert()` - Increments tag count when post is created
- `update_tag_counts_on_post_update()` - Updates tag count when post tags change
- `update_tag_counts_on_post_delete()` - Decrements tag count when post is deleted

---

### 2.4. `comments` Table

User comments on blog posts with nested replies support.

```sql
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 2.5. `bookmarks` Table

User bookmarks for saving favorite posts.

```sql
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

---

### 2.6. `share_tracking` Table

Tracks social media shares for analytics.

```sql
CREATE TABLE public.share_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Categories & Tags Architecture

### 3.1. Categories Implementation

**Categories are NOT stored in a separate table.**

Categories are stored as a **TEXT field** in the `blog_posts` table:

```sql
category TEXT NOT NULL DEFAULT 'general'
```

**Characteristics:**
- No separate categories table
- No enum/constraint - any string value is allowed
- Default value: `'general'`
- Categories are extracted dynamically from existing posts

**Frontend Extraction:**
```typescript
// Extract unique categories from posts
const categories = useMemo(() => {
  const cats = new Set(posts.map(post => post.category));
  return Array.from(cats).sort();
}, [posts]);
```

**Filtering:**
```typescript
// Filter by category
if (selectedCategory !== 'all') {
  filtered = filtered.filter(post => post.category === selectedCategory);
}
```

---

### 3.2. Tags Architecture

**Tags ARE stored in a separate table with metadata.**

#### Relationship Model

```
┌─────────────────┐
│   tags          │
│  ─────────────  │
│  id (UUID)      │
│  slug (TEXT)    │◄──┐
│  name_en        │   │
│  name_it        │   │
│  post_count     │   │
└─────────────────┘   │
                      │ (references slug)
                      │
┌─────────────────┐   │
│  blog_posts     │   │
│  ─────────────  │   │
│  id             │   │
│  category (TEXT)│   │
│  tags (TEXT[])  │───┘ (array contains tag slugs)
│  ...            │
└─────────────────┘
```

**Key Points:**
- Tags are stored as an **array of slugs** in `blog_posts.tags`
- The `tags` table stores metadata (names, descriptions)
- Tags are referenced by **slug**, not ID
- No foreign key constraint (array relationship)
- Tag counts auto-updated via database trigger

#### Why This Approach?

✅ **Advantages:**
- Simpler queries (no JOINs needed)
- Fast filtering with GIN index
- Easy to query: `WHERE 'investing' = ANY(tags)`

⚠️ **Trade-offs:**
- Less normalized (tags referenced by slug, not ID)
- Tag updates require updating all posts with that tag

#### Query Examples

```sql
-- Find posts with a specific tag
SELECT * FROM blog_posts WHERE 'investing' = ANY(tags);

-- Find posts with multiple tags (must have ALL)
SELECT * FROM blog_posts WHERE tags @> ARRAY['investing', 'long-term'];

-- Find posts with any of several tags (OR)
SELECT * FROM blog_posts 
WHERE tags && ARRAY['investing', 'stocks', 'bonds'];
```

#### Tag Creation Flow

1. Editor adds tags in post form (as array of strings)
2. When post is saved, `ensureTagsExist()` function is called
3. Function automatically creates tags in `tags` table if they don't exist
4. Tag slugs are stored in `blog_posts.tags` array
5. Database trigger automatically updates tag `post_count`

---

### 3.3. Filter Combination Logic

**File:** `src/app/[lang]/blog/BlogPageClient.tsx`

```typescript
// Filter by category (AND)
if (selectedCategory !== 'all') {
  filtered = filtered.filter(post => post.category === selectedCategory);
}

// Filter by tags (OR - post needs at least ONE selected tag)
if (selectedTags.length > 0) {
  filtered = filtered.filter(post => 
    post.tags.some(tag => selectedTags.includes(tag))
  );
}

// Search query (AND with everything)
if (searchQuery) {
  filtered = filtered.filter(post =>
    post.title[lang].toLowerCase().includes(searchQuery) ||
    post.excerpt[lang].toLowerCase().includes(searchQuery)
  );
}
```

**Logic:**
- **Category + Tags = AND relationship**  
  Post must match selected category **AND** have at least one selected tag
- **Multiple tags = OR relationship**  
  Post must have **at least one** of the selected tags
- **Search query = AND with everything**  
  Applies additional text search on top of category/tag filters

---

## 4. Full-Text Search Setup

### 4.1. Overview

The full-text search uses PostgreSQL's built-in capabilities with:
- **GIN indexes** for fast searching
- **Weighted search** (title > excerpt > content)
- **Automatic updates** via database triggers
- **Server-side search** for better performance

### 4.2. Search Vector

The `search_vector` column contains a `tsvector` (text search vector) that combines:
- **Title (weight A)** - Highest priority
- **Excerpt (weight B)** - Medium priority
- **Content (weight C)** - Lower priority
- **Category (weight A)** - Highest priority
- **Tags (weight B)** - Medium priority

### 4.3. Setup Script

Run this in Supabase SQL Editor (or use `migrations/004_fulltext_search.sql`):

```sql
-- Add search_vector column
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Create GIN index for fast searching
CREATE INDEX IF NOT EXISTS blog_posts_search_vector_idx 
ON blog_posts USING GIN (search_vector);

-- Create trigger function to update search vector
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

-- Create trigger
CREATE TRIGGER blog_posts_search_vector_update
BEFORE INSERT OR UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_post_search_vector();

-- Populate search vectors for existing posts
UPDATE blog_posts SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title_en, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(title_it, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(excerpt_en, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(excerpt_it, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(content_en, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(content_it, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'B');
```

### 4.4. Search Function

Create an RPC function for searching:

```sql
CREATE OR REPLACE FUNCTION search_blog_posts(search_query TEXT)
RETURNS SETOF blog_posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM blog_posts
  WHERE search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;
```

### 4.5. Usage in Code

```typescript
import { searchPosts } from '@/lib/blog';

// Basic search
const results = await searchPosts('investment strategies');

// Search with filters
const results = await searchPosts('investment', {
  category: 'investing',
  tags: ['stocks', 'bonds'],
  limit: 20,
});
```

### 4.6. Search Features

✅ **Full-text search** across titles, content, tags, categories  
✅ **Relevance ranking** (most relevant first)  
✅ **Category filtering** combined with search  
✅ **Tag filtering** combined with search  
✅ **Multi-language** support (EN/IT)  
✅ **Automatic updates** when posts change  
✅ **Fallback** to basic search if full-text fails  

**Search Behavior:**
- **Case-insensitive** - "Investment" matches "investment"
- **Partial matching** - "invest" matches "investment", "investing"
- **Multi-word** - "investment strategies" searches for both words
- **Ranked results** - Most relevant posts appear first
- **Fast** - Uses GIN index for quick lookups

---

## 5. Row Level Security (RLS)

### 5.1. RLS Policies Overview

RLS is enabled on all tables to ensure:
- ✅ Unauthenticated users can only read published posts
- ✅ Authenticated users can read all posts (for dashboard)
- ✅ Only editors/admins can create/update/delete posts
- ✅ Users can only update their own profiles
- ✅ Only admins can update user roles

### 5.2. Profiles Policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  role = (SELECT role FROM profiles WHERE id = auth.uid())
);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Only admins can update roles
CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 5.3. Blog Posts Policies

```sql
-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published posts"
ON blog_posts FOR SELECT
TO public
USING (published = true);

-- Authenticated users can read all posts
CREATE POLICY "Authenticated can read all posts"
ON blog_posts FOR SELECT
TO authenticated
USING (true);

-- Editors and admins can create posts
CREATE POLICY "Editors can create posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
);

-- Authors and admins can update posts
CREATE POLICY "Authors can update own posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (
  author_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Authors and admins can delete posts
CREATE POLICY "Authors can delete own posts"
ON blog_posts FOR DELETE
TO authenticated
USING (
  author_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 5.4. Tags Policies

```sql
-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Public can read tags
CREATE POLICY "Public can read tags"
ON tags FOR SELECT
TO public
USING (true);

-- Editors and admins can manage tags
CREATE POLICY "Editors can manage tags"
ON tags FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('editor', 'admin')
  )
);
```

---

## 6. RLS Testing Guide

### 6.1. Testing Checklist

#### Unauthenticated Access

**✅ Should Work:**
- View published blog posts
- View individual published post
- Search and filter published posts
- View tags

**❌ Should NOT Work:**
- Access dashboard
- Create/edit/delete posts
- View unpublished/draft posts
- Access user profiles

#### Authenticated User (Regular)

**✅ Should Work:**
- View own profile
- Update own profile (except role)
- View all published posts

**❌ Should NOT Work:**
- Create/edit/delete posts
- Update other users' profiles
- Update user roles

#### Editor Access

**✅ Should Work:**
- View all posts (published and drafts)
- Create new posts
- Edit own posts
- Delete own posts
- Manage tags

**❌ Should NOT Work:**
- Update other users' profiles
- Update user roles

#### Admin Access

**✅ Should Work (Everything):**
- All editor permissions
- Update user roles
- Delete any post
- Update any user profile

### 6.2. Automated Testing Script

```typescript
// scripts/test-rls.ts
import { createClient } from '@supabase/supabase-js';

async function testRLS() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  console.log('Testing RLS Policies...\n');

  // Test 1: Unauthenticated - should only read published posts
  console.log('Test 1: Unauthenticated access');
  const { data: published, error: pubError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .limit(1);
  
  console.log('Published posts:', published ? '✅ PASS' : '❌ FAIL', pubError?.message);

  const { data: drafts, error: draftError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', false)
    .limit(1);
  
  console.log('Draft posts:', !drafts || drafts.length === 0 ? '✅ PASS (blocked)' : '❌ FAIL (should be blocked)', draftError?.message);

  console.log('\nRLS tests completed');
}

testRLS();
```

**Run with:**
```bash
tsx scripts/test-rls.ts
```

---

## Quick Reference

### Database Tables
- `profiles` - User profiles and roles
- `blog_posts` - Blog posts with multi-language support
- `tags` - Tag metadata
- `comments` - User comments on posts
- `bookmarks` - User bookmarks
- `share_tracking` - Share analytics

### Key Features
- ✅ Row Level Security (RLS) enabled
- ✅ Multi-language support (EN/IT)
- ✅ Full-text search with GIN indexes
- ✅ Role-based access control
- ✅ Automatic tag management
- ✅ Analytics tracking (views, reads, shares)

### User Roles
- **user** - Can read posts, manage own profile
- **editor** - Can create/edit posts, manage tags
- **admin** - Full access to all features

---

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Array Types](https://www.postgresql.org/docs/current/arrays.html)

---

**Database Setup Complete!** 🎉

For setup instructions, see `SETUP_GUIDE.md`.  
For deployment, see `DEPLOYMENT_GUIDE.md`.



