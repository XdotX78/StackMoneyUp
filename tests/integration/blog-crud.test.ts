/**
 * Integration Tests: Blog CRUD Operations
 * Tests blog post creation, reading, updating, and deletion
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { 
  createPost, 
  updatePost, 
  deletePost, 
  getPostBySlug, 
  getAllPosts 
} from '@/lib/blog';
import { signIn, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import type { BlogPost } from '@/types/blog';

// Test credentials (assumes test user exists)
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'TestPassword123!';

describe('Blog CRUD Integration Tests', () => {
  let testPostSlug: string | null = null;
  let testPostId: string | null = null;

  beforeAll(async () => {
    // Sign in before running tests
    await signIn(TEST_EMAIL, TEST_PASSWORD);
  }, 15000);

  afterAll(async () => {
    // Cleanup: Delete test post
    if (testPostId) {
      try {
        await supabase
          .from('blog_posts')
          .delete()
          .eq('id', testPostId);
      } catch (error) {
        console.warn('Failed to cleanup test post:', error);
      }
    }
    
    // Sign out
    await signOut();
  }, 15000);

  describe('Create Post', () => {
    it('should create a new blog post', async () => {
      const postData = {
        title_en: `Test Post ${Date.now()}`,
        title_it: `Post di Test ${Date.now()}`,
        slug: `test-post-${Date.now()}`,
        excerpt_en: 'Test excerpt in English',
        excerpt_it: 'Estratto di test in italiano',
        content_en: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test content' }] }] }),
        content_it: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenuto di test' }] }] }),
        category: 'investing',
        tags: ['test', 'automation'],
        published: false,
        featured_image: null,
        meta_description_en: 'Test meta description',
        meta_description_it: 'Meta descrizione di test',
      };

      const result = await createPost(postData);

      expect(result).toBeDefined();
      expect(result.slug).toBe(postData.slug);
      expect(result.published).toBe(false);

      testPostSlug = result.slug;
      testPostId = result.id;
    }, 15000);

    it('should fail with duplicate slug', async () => {
      if (!testPostSlug) {
        throw new Error('Test post not created');
      }

      const duplicateData = {
        title_en: 'Duplicate Post',
        title_it: 'Post Duplicato',
        slug: testPostSlug, // Same slug
        excerpt_en: 'Duplicate excerpt',
        excerpt_it: 'Estratto duplicato',
        content_en: JSON.stringify({ type: 'doc', content: [] }),
        content_it: JSON.stringify({ type: 'doc', content: [] }),
        category: 'investing',
        tags: [],
        published: false,
      };

      await expect(createPost(duplicateData)).rejects.toThrow();
    }, 15000);
  });

  describe('Read Post', () => {
    it('should retrieve post by slug', async () => {
      if (!testPostSlug) {
        throw new Error('Test post not created');
      }

      const post = await getPostBySlug(testPostSlug);

      expect(post).toBeDefined();
      expect(post?.slug).toBe(testPostSlug);
      expect(post?.title_en).toContain('Test Post');
    }, 15000);

    it('should return null for non-existent slug', async () => {
      const post = await getPostBySlug('non-existent-slug-12345');
      expect(post).toBeNull();
    }, 15000);

    it('should retrieve all posts', async () => {
      const posts = await getAllPosts();

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Update Post', () => {
    it('should update post content', async () => {
      if (!testPostSlug) {
        throw new Error('Test post not created');
      }

      const updatedData = {
        title_en: `Updated Test Post ${Date.now()}`,
        excerpt_en: 'Updated excerpt',
        published: true,
      };

      const result = await updatePost(testPostSlug, updatedData);

      expect(result).toBeDefined();
      expect(result.title_en).toBe(updatedData.title_en);
      expect(result.published).toBe(true);
    }, 15000);

    it('should fail with non-existent slug', async () => {
      await expect(
        updatePost('non-existent-slug-12345', { title_en: 'Updated' })
      ).rejects.toThrow();
    }, 15000);
  });

  describe('Delete Post', () => {
    it('should delete post', async () => {
      if (!testPostSlug) {
        throw new Error('Test post not created');
      }

      await expect(deletePost(testPostSlug)).resolves.not.toThrow();

      // Verify deletion
      const post = await getPostBySlug(testPostSlug);
      expect(post).toBeNull();
      
      // Clear reference so cleanup doesn't fail
      testPostId = null;
    }, 15000);

    it('should fail with non-existent slug', async () => {
      await expect(
        deletePost('non-existent-slug-12345')
      ).rejects.toThrow();
    }, 15000);
  });

  describe('Post Publishing', () => {
    it('should create draft and then publish', async () => {
      // Create draft
      const draftData = {
        title_en: `Draft Post ${Date.now()}`,
        title_it: `Bozza ${Date.now()}`,
        slug: `draft-post-${Date.now()}`,
        excerpt_en: 'Draft excerpt',
        excerpt_it: 'Estratto bozza',
        content_en: JSON.stringify({ type: 'doc', content: [] }),
        content_it: JSON.stringify({ type: 'doc', content: [] }),
        category: 'budgeting',
        tags: [],
        published: false,
      };

      const draft = await createPost(draftData);
      expect(draft.published).toBe(false);
      expect(draft.published_at).toBeNull();

      // Publish it
      const published = await updatePost(draft.slug, { published: true });
      expect(published.published).toBe(true);
      expect(published.published_at).toBeDefined();

      // Cleanup
      await deletePost(draft.slug);
    }, 20000);
  });
});

