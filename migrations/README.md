# 📦 Database Migrations

This directory contains SQL migration files for setting up the StackMoneyUp database.

---

## Migration Files

### `001_initial_schema.sql`

Creates the complete database schema including:
- `profiles` table with RLS policies
- `blog_posts` table with RLS policies
- `tags` table with RLS policies
- All indexes for performance
- Database triggers for:
  - Auto-creating profiles on user signup
  - Updating `updated_at` timestamps
  - Auto-updating tag post counts

**Usage:**
```sql
-- Run in Supabase SQL Editor
-- Copy and paste the entire file contents
```

### `002_seed_data.sql`

Seeds the database with initial data:
- Sample tags (only if they don't exist)
- Example blog posts (commented out - uncomment if needed)

**⚠️ WARNING:** Only run this in development!

**Usage:**
```sql
-- Run in Supabase SQL Editor
-- Only after 001_initial_schema.sql has been run
```

### `003_comments_schema.sql`

Creates the comments system including:
- `comments` table with nested replies support
- RLS policies for comment moderation
- Indexes for performance
- Triggers for updating `updated_at` and marking edited comments

**Usage:**
```sql
-- Run in Supabase SQL Editor
-- After 001_initial_schema.sql has been run
```

### `004_fulltext_search.sql`

Sets up PostgreSQL full-text search for blog posts:
- Adds `search_vector` column to `blog_posts` table
- Creates GIN index for fast full-text search
- Adds trigger to automatically update search vector on post changes
- Creates `search_blog_posts()` function for server-side search
- Supports weighted search (title > excerpt > content)

**Usage:**
```sql
-- Run in Supabase SQL Editor
-- After 001_initial_schema.sql has been run
```

### `005_add_spanish_language.sql`

Adds Spanish (ES) language support:
- Adds `title_es`, `excerpt_es`, `content_es` to `blog_posts` table
- Adds `name_es`, `description_es` to `tags` table
- Sets English content as default for existing posts
- Makes Spanish fields required (NOT NULL)

**Usage:**
```sql
-- Run in Supabase SQL Editor
-- After 001_initial_schema.sql has been run
```

**📖 See:** `SPANISH_LANGUAGE_SETUP.md` for complete setup guide

---

## Running Migrations

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the migration file contents
5. Click **Run**

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Option 3: Direct PostgreSQL Connection

```bash
psql -h your-db-host -U postgres -d postgres -f migrations/001_initial_schema.sql
```

---

## Migration Order

**IMPORTANT:** Run migrations in order:

1. ✅ `001_initial_schema.sql` - Must run first
2. ✅ `002_seed_data.sql` - Optional, run after schema
3. ✅ `003_comments_schema.sql` - Comments system, run after initial schema
4. ✅ `004_fulltext_search.sql` - Full-text search setup, run after initial schema
5. ✅ `005_add_spanish_language.sql` - Spanish language support, run after initial schema

---

## Verifying Migrations

After running migrations, verify:

### 1. Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'blog_posts', 'tags', 'comments');
```

Should return 4 rows (if all migrations are run).

### 4. Full-Text Search Setup

```sql
-- Check if search_vector column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name = 'search_vector';
```

Should return 1 row.

```sql
-- Check if search function exists
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'search_blog_posts';
```

Should return 1 row.

```sql
-- Check if GIN index exists
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'blog_posts' 
AND indexname = 'blog_posts_search_vector_idx';
```

Should return 1 row.

### 2. RLS Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'blog_posts', 'tags', 'comments');
```

All should have `rowsecurity = true`.

### 3. Triggers Created

```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Should see triggers for:
- `on_auth_user_created`
- `update_profiles_updated_at`
- `update_blog_posts_updated_at`
- `update_tags_updated_at`
- `update_tag_counts_on_post_insert`
- `update_tag_counts_on_post_update`
- `update_tag_counts_on_post_delete`
- `update_comments_updated_at`

### 4. Indexes Created

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'blog_posts', 'tags', 'comments');
```

Should see all indexes listed in the schema.

---

## Rollback

If you need to rollback a migration:

### Rollback 002_seed_data.sql

```sql
-- Remove seeded tags (be careful!)
DELETE FROM public.tags WHERE slug IN (
  'investing', 'budgeting', 'saving', 'debt', 'personal-finance',
  'compound-interest', 'emergency-fund', 'side-hustle', 'mindset', 'long-term'
);
```

### Rollback 001_initial_schema.sql

**⚠️ WARNING:** This will delete all data!

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
DROP TRIGGER IF EXISTS update_tags_updated_at ON public.tags;
DROP TRIGGER IF EXISTS update_tag_counts_on_post_insert ON public.blog_posts;
DROP TRIGGER IF EXISTS update_tag_counts_on_post_update ON public.blog_posts;
DROP TRIGGER IF EXISTS update_tag_counts_on_post_delete ON public.blog_posts;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_tag_counts_on_post_change();

-- Drop tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

---

## Troubleshooting

### Error: "relation already exists"

**Problem:** Tables already exist.

**Solution:** 
- Check if tables were created manually
- Use `IF NOT EXISTS` in CREATE TABLE (already included)
- Or drop existing tables first (be careful with data!)

### Error: "permission denied"

**Problem:** Don't have permission to create objects.

**Solution:**
- Ensure you're using a user with proper permissions
- In Supabase, use the SQL Editor (has admin privileges)

### Error: "function already exists"

**Problem:** Functions were created previously.

**Solution:**
- Use `CREATE OR REPLACE FUNCTION` (already included)
- Or drop functions first

### Triggers not firing

**Problem:** Triggers aren't executing.

**Solution:**
1. Verify triggers exist:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%update%';
   ```
2. Check trigger function exists
3. Verify trigger is enabled
4. Test with a simple insert/update

---

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in development first
3. **Run migrations** in order
4. **Verify** after each migration
5. **Document** any custom changes
6. **Use transactions** for complex migrations (wrapped automatically in Supabase)

---

## Future Migrations

When adding new migrations:

1. Number them sequentially: `003_*.sql`, `004_*.sql`, etc.
2. Include description in file header
3. Add to this README
4. Test thoroughly before running in production
5. Consider rollback strategy

---

## References

- [Supabase Database Migrations](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Schema Documentation](../DATABASE_SCHEMA.md)

