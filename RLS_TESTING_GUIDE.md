# 🔒 RLS Testing Guide

**Last Updated:** January 2025

This guide explains how to test Row Level Security (RLS) policies in StackMoneyUp to ensure proper access control.

---

## Overview

Row Level Security (RLS) is enabled on all tables in StackMoneyUp:
- `profiles` - User profiles and roles
- `blog_posts` - Blog posts
- `tags` - Tag metadata

RLS policies ensure:
- ✅ Unauthenticated users can only read published posts
- ✅ Authenticated users can read all posts (for dashboard)
- ✅ Only editors/admins can create/update/delete posts
- ✅ Users can only update their own profiles
- ✅ Only admins can update user roles

---

## Prerequisites

1. Supabase project set up
2. Database tables created
3. RLS policies enabled (already done)
4. Test accounts:
   - Admin user
   - Editor user
   - Regular user
   - Unauthenticated (no account)

---

## Testing Checklist

### 1. Test Unauthenticated Access

#### ✅ Should Work (Public Read Access)

- [ ] View published blog posts on `/blog` page
- [ ] View individual published post on `/blog/[slug]`
- [ ] Search and filter published posts
- [ ] View tags (public read access)

#### ❌ Should NOT Work (Blocked)

- [ ] Access dashboard (`/dashboard`)
- [ ] Create/edit/delete posts
- [ ] View unpublished/draft posts
- [ ] Access user profiles
- [ ] Create/update/delete tags

**Test Commands:**

```sql
-- Test unauthenticated access (run in Supabase SQL Editor)
-- This simulates an unauthenticated user

-- Should work: Read published posts
SELECT * FROM blog_posts WHERE published = true LIMIT 5;

-- Should fail: Read unpublished posts
SELECT * FROM blog_posts WHERE published = false;

-- Should fail: Insert post
INSERT INTO blog_posts (slug, title_en, title_it, excerpt_en, excerpt_it, content_en, content_it, category)
VALUES ('test-post', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'general');

-- Should work: Read tags
SELECT * FROM tags LIMIT 5;
```

---

### 2. Test Authenticated User Access

#### ✅ Should Work

- [ ] View own profile
- [ ] Update own profile (except role)
- [ ] View all published posts
- [ ] View tags

#### ❌ Should NOT Work (Regular User)

- [ ] Create/edit/delete posts
- [ ] Access dashboard
- [ ] Update other users' profiles
- [ ] Update user roles
- [ ] Create/update/delete tags

**Test Steps:**

1. Log in as a regular user (`role: 'user'`)
2. Try to access `/dashboard` → Should redirect
3. Try to access `/dashboard/posts` → Should redirect
4. Try to view profile → Should work
5. Try to update profile → Should work (except role)

**Test Commands:**

```sql
-- Set role to 'user' for testing
UPDATE profiles SET role = 'user' WHERE id = 'your-user-id';

-- As regular user, should fail:
INSERT INTO blog_posts (slug, title_en, title_it, excerpt_en, excerpt_it, content_en, content_it, category, author_id)
VALUES ('test-post', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'general', 'your-user-id');
```

---

### 3. Test Editor Access

#### ✅ Should Work

- [ ] View all posts (published and drafts)
- [ ] Create new posts
- [ ] Edit own posts
- [ ] Delete own posts
- [ ] Access dashboard
- [ ] Manage tags (create/update/delete)
- [ ] View media library

#### ❌ Should NOT Work

- [ ] Update other users' profiles
- [ ] Update user roles
- [ ] Delete other users' posts (unless admin policy allows)

**Test Steps:**

1. Log in as editor (`role: 'editor'`)
2. Access `/dashboard` → Should work
3. Create new post → Should work
4. Edit existing post → Should work
5. Delete post → Should work
6. Try to update user role → Should fail

**Test Commands:**

```sql
-- Set role to 'editor' for testing
UPDATE profiles SET role = 'editor' WHERE id = 'your-user-id';

-- As editor, should work:
INSERT INTO blog_posts (slug, title_en, title_it, excerpt_en, excerpt_it, content_en, content_it, category, author_id)
VALUES ('editor-post', 'Editor Post', 'Post Editor', 'Excerpt', 'Estratto', 'Content', 'Contenuto', 'general', 'your-user-id');

-- Should work: Update own post
UPDATE blog_posts SET title_en = 'Updated' WHERE author_id = 'your-user-id';
```

---

### 4. Test Admin Access

#### ✅ Should Work (Everything)

- [ ] All editor permissions
- [ ] Update user roles
- [ ] Delete any post
- [ ] Update any user profile
- [ ] Access all dashboard features

**Test Steps:**

1. Log in as admin (`role: 'admin'`)
2. Update user role → Should work
3. Delete any post → Should work
4. Update any profile → Should work

**Test Commands:**

```sql
-- Set role to 'admin' for testing
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';

-- As admin, should work:
UPDATE profiles SET role = 'editor' WHERE id = 'another-user-id';

-- Should work: Delete any post
DELETE FROM blog_posts WHERE id = 'any-post-id';
```

---

## Testing Tools

### 1. Supabase SQL Editor

Test queries directly in Supabase:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run test queries
3. Check for permission errors

### 2. Browser DevTools

Test from browser:

1. Open DevTools → Network tab
2. Make requests to Supabase
3. Check for 401/403 errors
4. Verify RLS policies are enforced

### 3. Programmatic Testing

Use Supabase client with different auth states:

```typescript
// Test as unauthenticated user
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('published', false);

// Should return error or empty array
```

---

## Common RLS Issues

### Issue: "new row violates row-level security policy"

**Problem:** Insert/update is blocked by RLS policy.

**Solutions:**
1. Check if user has required role
2. Verify policy conditions match your data
3. Ensure `author_id` matches authenticated user ID
4. Check if policy allows the operation

### Issue: "permission denied for table"

**Problem:** User doesn't have table-level permissions.

**Solutions:**
1. Grant necessary permissions:
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts TO authenticated;
   ```
2. Ensure RLS is enabled:
   ```sql
   ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
   ```

### Issue: Can read but can't write

**Problem:** Read policy works, but write policy doesn't.

**Solutions:**
1. Check write policy conditions
2. Verify user role in profiles table
3. Ensure author_id matches authenticated user
4. Check policy USING vs WITH CHECK clauses

---

## Automated Testing Script

Create a test script to verify RLS policies:

```typescript
// scripts/test-rls.ts
import { createClient } from '@supabase/supabase-js';

async function testRLS() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Test 1: Unauthenticated - should only read published posts
  console.log('Test 1: Unauthenticated access');
  const { data: published, error: pubError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .limit(1);
  
  console.log('Published posts:', published ? '✅' : '❌', pubError?.message);

  const { data: drafts, error: draftError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', false)
    .limit(1);
  
  console.log('Draft posts:', drafts ? '❌ Should fail' : '✅', draftError?.message);

  // Test 2: Authenticated as user
  // (Requires actual login)
  
  console.log('RLS tests completed');
}

testRLS();
```

---

## Production Checklist

Before deploying to production:

- [ ] All RLS policies are enabled
- [ ] Unauthenticated users can only read published content
- [ ] Authenticated users can read all content
- [ ] Only editors/admins can write
- [ ] Users can only update own profiles
- [ ] Only admins can update roles
- [ ] Tested with multiple user roles
- [ ] Verified no data leaks
- [ ] Checked error messages are appropriate

---

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Database Schema Documentation](./DATABASE_SCHEMA.md)

