/**
 * Integration Tests: Permissions & RLS Policies
 * Tests role-based access control and Row Level Security
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signIn, signOut } from '@/lib/auth';
import { hasRole, isAdmin, isEditor } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

describe('Permissions & RLS Integration Tests', () => {
  let testUserId: string | null = null;
  let testPostId: string | null = null;

  beforeAll(async () => {
    const result = await signIn(TEST_EMAIL, TEST_PASSWORD);
    testUserId = result.user?.id || null;
  }, 15000);

  afterAll(async () => {
    if (testPostId) {
      await supabase.from('blog_posts').delete().eq('id', testPostId);
    }
    await signOut();
  }, 15000);

  describe('Role Checks', () => {
    it('should retrieve user role from profile', async () => {
      if (!testUserId) throw new Error('Not signed in');

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', testUserId)
        .single();

      expect(data).toBeDefined();
      expect(data?.role).toBeDefined();
      expect(['user', 'editor', 'admin']).toContain(data?.role);
    }, 15000);
  });

  describe('Blog Posts RLS', () => {
    it('authenticated user can read published posts', async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 15000);

    it('authenticated user can read own drafts', async () => {
      if (!testUserId) throw new Error('Not signed in');

      // Create a draft post
      const { data: post, error: createError } = await supabase
        .from('blog_posts')
        .insert({
          title_en: `Test Draft ${Date.now()}`,
          title_it: `Bozza Test ${Date.now()}`,
          slug: `test-draft-${Date.now()}`,
          excerpt_en: 'Test',
          excerpt_it: 'Test',
          content_en: JSON.stringify({ type: 'doc', content: [] }),
          content_it: JSON.stringify({ type: 'doc', content: [] }),
          category: 'investing',
          published: false,
          author_id: testUserId,
        })
        .select()
        .single();

      expect(createError).toBeNull();
      testPostId = post?.id || null;

      // Try to read it back
      const { data: readPost, error: readError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', testPostId!)
        .single();

      expect(readError).toBeNull();
      expect(readPost).toBeDefined();
      expect(readPost?.author_id).toBe(testUserId);
    }, 15000);
  });

  describe('Comments RLS', () => {
    it('authenticated user can create comments', async () => {
      // Get a published post
      const { data: post } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('published', true)
        .limit(1)
        .single();

      if (!post) {
        console.warn('No published posts available for comment test');
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          content: 'Test comment for RLS',
          parent_id: null,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Cleanup
      if (data?.id) {
        await supabase.from('comments').delete().eq('id', data.id);
      }
    }, 15000);

    it('authenticated user can update own comments', async () => {
      // Get a published post
      const { data: post } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('published', true)
        .limit(1)
        .single();

      if (!post) {
        console.warn('No published posts available');
        return;
      }

      // Create comment
      const { data: comment } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          content: 'Original content',
          parent_id: null,
        })
        .select()
        .single();

      if (!comment) throw new Error('Failed to create comment');

      // Update it
      const { data: updated, error } = await supabase
        .from('comments')
        .update({ content: 'Updated content' })
        .eq('id', comment.id)
        .select()
        .single();

      expect(error).toBeNull();
      expect(updated?.content).toBe('Updated content');

      // Cleanup
      await supabase.from('comments').delete().eq('id', comment.id);
    }, 15000);
  });

  describe('Profiles RLS', () => {
    it('authenticated user can read own profile', async () => {
      if (!testUserId) throw new Error('Not signed in');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUserId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(testUserId);
    }, 15000);

    it('authenticated user can update own profile', async () => {
      if (!testUserId) throw new Error('Not signed in');

      const testBio = `Test bio ${Date.now()}`;

      const { data, error } = await supabase
        .from('profiles')
        .update({ bio: testBio })
        .eq('id', testUserId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.bio).toBe(testBio);
    }, 15000);
  });

  describe('Unauthenticated Access', () => {
    beforeAll(async () => {
      await signOut();
    }, 15000);

    afterAll(async () => {
      await signIn(TEST_EMAIL, TEST_PASSWORD);
    }, 15000);

    it('unauthenticated user can read published posts', async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    }, 15000);

    it('unauthenticated user cannot read drafts', async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', false);

      // Should return empty array or null due to RLS
      expect(data).toBeDefined();
      expect(data?.length).toBe(0);
    }, 15000);

    it('unauthenticated user cannot create posts', async () => {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title_en: 'Unauthorized Post',
          title_it: 'Post Non Autorizzato',
          slug: `unauthorized-${Date.now()}`,
          excerpt_en: 'Test',
          excerpt_it: 'Test',
          content_en: JSON.stringify({ type: 'doc', content: [] }),
          content_it: JSON.stringify({ type: 'doc', content: [] }),
          category: 'investing',
          published: false,
        });

      expect(error).toBeDefined();
    }, 15000);
  });
});

