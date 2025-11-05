/**
 * Integration Tests: Comments System
 * Tests comment creation, editing, deletion, and replies
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signIn, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

describe('Comments Integration Tests', () => {
  let testPostId: string | null = null;
  let testCommentId: string | null = null;
  let testReplyId: string | null = null;

  beforeAll(async () => {
    // Sign in
    await signIn(TEST_EMAIL, TEST_PASSWORD);

    // Create a test post for comments
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title_en: `Test Post for Comments ${Date.now()}`,
        title_it: `Post di Test per Commenti ${Date.now()}`,
        slug: `test-comments-post-${Date.now()}`,
        excerpt_en: 'Test excerpt',
        excerpt_it: 'Estratto di test',
        content_en: JSON.stringify({ type: 'doc', content: [] }),
        content_it: JSON.stringify({ type: 'doc', content: [] }),
        category: 'investing',
        published: true,
      })
      .select()
      .single();

    if (error) throw error;
    testPostId = post.id;
  }, 20000);

  afterAll(async () => {
    // Cleanup
    if (testReplyId) {
      await supabase.from('comments').delete().eq('id', testReplyId);
    }
    if (testCommentId) {
      await supabase.from('comments').delete().eq('id', testCommentId);
    }
    if (testPostId) {
      await supabase.from('blog_posts').delete().eq('id', testPostId);
    }
    await signOut();
  }, 20000);

  describe('Create Comment', () => {
    it('should create a new comment on post', async () => {
      if (!testPostId) throw new Error('Test post not created');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: testPostId,
          content: 'This is a test comment',
          parent_id: null,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.content).toBe('This is a test comment');
      expect(data?.post_id).toBe(testPostId);

      testCommentId = data?.id || null;
    }, 15000);

    it('should fail without post_id', async () => {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: 'Comment without post',
          parent_id: null,
        });

      expect(error).toBeDefined();
    }, 15000);
  });

  describe('Reply to Comment', () => {
    it('should create a reply to existing comment', async () => {
      if (!testPostId || !testCommentId) {
        throw new Error('Test comment not created');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: testPostId,
          content: 'This is a reply to the comment',
          parent_id: testCommentId,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.parent_id).toBe(testCommentId);

      testReplyId = data?.id || null;
    }, 15000);
  });

  describe('Read Comments', () => {
    it('should retrieve all comments for a post', async () => {
      if (!testPostId) throw new Error('Test post not created');

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', testPostId)
        .order('created_at', { ascending: true });

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data?.length).toBeGreaterThanOrEqual(2); // Parent + reply
    }, 15000);

    it('should retrieve nested replies', async () => {
      if (!testPostId || !testCommentId) {
        throw new Error('Test data not created');
      }

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', testPostId)
        .eq('parent_id', testCommentId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThanOrEqual(1);
    }, 15000);
  });

  describe('Update Comment', () => {
    it('should update comment content', async () => {
      if (!testCommentId) throw new Error('Test comment not created');

      const { data, error } = await supabase
        .from('comments')
        .update({ content: 'Updated comment content' })
        .eq('id', testCommentId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.content).toBe('Updated comment content');
    }, 15000);
  });

  describe('Delete Comment', () => {
    it('should delete a comment', async () => {
      if (!testReplyId) throw new Error('Test reply not created');

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', testReplyId);

      expect(error).toBeNull();

      // Verify deletion
      const { data } = await supabase
        .from('comments')
        .select()
        .eq('id', testReplyId)
        .single();

      expect(data).toBeNull();
      
      testReplyId = null; // Clear for cleanup
    }, 15000);
  });

  describe('Comment Validation', () => {
    it('should fail with empty content', async () => {
      if (!testPostId) throw new Error('Test post not created');

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: testPostId,
          content: '',
          parent_id: null,
        });

      expect(error).toBeDefined();
    }, 15000);

    it('should fail with invalid post_id', async () => {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: '00000000-0000-0000-0000-000000000000',
          content: 'Comment on non-existent post',
          parent_id: null,
        });

      expect(error).toBeDefined();
    }, 15000);
  });
});

