# 📊 Database Schema Documentation

**Last Updated:** January 2025  
**Database:** Supabase (PostgreSQL)

---

## Overview

StackMoneyUp uses Supabase (PostgreSQL) for data storage with Row Level Security (RLS) enabled on all tables. The database supports multi-language content (English/Italian) and includes automatic tag management.

---

## Tables

### 1. `profiles` Table

User profile information including roles and metadata.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Columns:**
- `id` (UUID) - Primary key, references `auth.users(id)`
- `role` (TEXT) - User role: 'admin', 'editor', or 'user'
- `full_name` (TEXT) - User's display name
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**RLS Policies:**
- Users can view their own profile
- Users can update their own profile (except role)
- Users can insert their own profile on signup
- Role updates require admin privileges

**Triggers:**
- `handle_new_user()` - Automatically creates profile when user signs up
- `update_updated_at_column()` - Updates `updated_at` on changes

**Indexes:**
- `profiles_role_idx` - Index on `role` for faster role-based queries

---

### 2. `blog_posts` Table

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
- `tags` (TEXT[]) - Array of tag slugs (e.g., ['investing', 'compound-interest'])
- `published` (BOOLEAN) - Whether post is published
- `featured` (BOOLEAN) - Whether post is featured
- `read_time` (INTEGER) - Estimated reading time in minutes
- `scheduled_at` (TIMESTAMPTZ) - Scheduled publication date
- `author_id` (UUID) - Reference to post author
- `views` (INTEGER) - View count
- `reads` (INTEGER) - Read count (tracked when user reads full post)
- `shares` (INTEGER) - Share count
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp
- `published_at` (TIMESTAMPTZ) - Publication timestamp

**RLS Policies:**
- Public can read published posts
- Authenticated users can read all posts (for dashboard)
- Editors and admins can create posts
- Authors and admins can update posts
- Authors and admins can delete posts

**Indexes:**
- `blog_posts_slug_idx` - Unique index on `slug`
- `blog_posts_published_idx` - Index on `published` for filtering
- `blog_posts_category_idx` - Index on `category` for filtering
- `blog_posts_tags_gin_idx` - GIN index on `tags` array for fast tag searches
- `blog_posts_author_id_idx` - Index on `author_id` for author queries

**Triggers:**
- `update_blog_posts_updated_at()` - Updates `updated_at` on changes
- `update_tag_counts_on_post_change()` - Updates tag `post_count` when posts change

---

### 3. `tags` Table

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
- `slug` (TEXT) - URL-friendly identifier (unique, used in blog_posts.tags array)
- `name_en`, `name_it` (TEXT) - Tag names in English and Italian
- `description_en`, `description_it` (TEXT) - Optional tag descriptions
- `post_count` (INTEGER) - Number of posts using this tag (auto-updated)
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**RLS Policies:**
- Public can read tags
- Editors and admins can create tags
- Editors and admins can update tags
- Editors and admins can delete tags

**Indexes:**
- `tags_slug_idx` - Unique index on `slug`
- `tags_post_count_idx` - Index on `post_count` for sorting

**Triggers:**
- `update_tags_updated_at()` - Updates `updated_at` on changes
- `update_tag_counts_on_post_insert()` - Increments tag count when post is created
- `update_tag_counts_on_post_update()` - Updates tag count when post tags change
- `update_tag_counts_on_post_delete()` - Decrements tag count when post is deleted

---

## Relationships

### Post → Tags Relationship

Tags are stored as an array of slugs in the `blog_posts.tags` column:

```sql
tags TEXT[] DEFAULT '{}'
```

**Example:**
```json
{
  "tags": ["investing", "compound-interest", "long-term"]
}
```

**Why this approach:**
- ✅ Simpler queries (no JOINs needed)
- ✅ Fast filtering with GIN index
- ✅ Easy to query: `WHERE 'investing' = ANY(tags)`
- ⚠️ Less normalized (tags referenced by slug, not ID)
- ⚠️ Tag updates require updating all posts with that tag

**Query examples:**
```sql
-- Find posts with a specific tag
SELECT * FROM blog_posts WHERE 'investing' = ANY(tags);

-- Find posts with multiple tags
SELECT * FROM blog_posts WHERE tags @> ARRAY['investing', 'long-term'];
```

### Post → Author Relationship

```sql
author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
```

Posts are linked to authors via `author_id`. If a user is deleted, their posts remain but `author_id` is set to NULL.

---

## Database Functions

### Tag Management Functions

**`update_tag_counts_on_post_change()`**
- Automatically updates tag `post_count` when posts are created, updated, or deleted
- Ensures tag counts stay accurate without manual updates

**`ensureTagsExist(tagSlugs: string[])`** (TypeScript function)
- Called when posts are created/updated
- Creates tags in `tags` table if they don't exist
- Generates tag names from slugs (capitalized, spaces from hyphens)

---

## Storage Buckets

### 1. `avatars` Bucket

User avatar images.

**RLS Policies:**
- Public read access
- Authenticated users can upload
- Users can update/delete their own avatars

### 2. `blog-images` Bucket

Blog post cover images and media.

**RLS Policies:**
- Public read access
- Editors and admins can upload
- Editors and admins can delete

---

## Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
2. **Role-based access control** - Roles stored in `profiles` table
3. **Service role key** - Used server-side for admin operations (bypasses RLS)
4. **Public access** - Published blog posts are readable by anyone
5. **Authentication required** - All write operations require authentication

---

## Migration Notes

To set up the database:

1. Run `supabase_profiles_setup.sql` - Creates profiles table and triggers
2. Create `blog_posts` table (see schema above)
3. Create `tags` table (see schema above)
4. Set up RLS policies for all tables
5. Create indexes for performance
6. Set up storage buckets and policies

---

## TypeScript Types

See `src/types/blog.ts` for TypeScript interfaces matching the database schema:

- `BlogPost` - Full blog post with all fields
- `BlogPostSummary` - Simplified post for listings
- `Tag` - Tag with multi-language names

---

## Future Enhancements

- [ ] Comments system table
- [ ] Categories table (normalize current TEXT field)
- [ ] Post revisions/history table
- [ ] Analytics events table
- [ ] Newsletter subscriptions table

