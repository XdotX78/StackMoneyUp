/**
 * Bookmarks utilities
 * Allows users to save favorite blog posts
 */

import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth';
import type { BlogPostSummary } from '@/types/blog';

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

/**
 * Check if a post is bookmarked by the current user
 */
export async function isBookmarked(postId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking bookmark:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

/**
 * Add a bookmark
 */
export async function addBookmark(postId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to bookmark posts');
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert({
        post_id: postId,
        user_id: user.id,
      });

    if (error) {
      // Ignore duplicate bookmark errors
      if (error.code === '23505') { // Unique constraint violation
        return true; // Already bookmarked
      }
      console.error('Error adding bookmark:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(postId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to remove bookmarks');
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Toggle bookmark (add if not bookmarked, remove if bookmarked)
 */
export async function toggleBookmark(postId: string): Promise<boolean> {
  const bookmarked = await isBookmarked(postId);
  if (bookmarked) {
    await removeBookmark(postId);
    return false;
  } else {
    await addBookmark(postId);
    return true;
  }
}

/**
 * Get all bookmarked posts for the current user
 */
export async function getUserBookmarks(): Promise<BlogPostSummary[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        post_id,
        created_at,
        blog_posts (
          id,
          slug,
          title_en,
          title_it,
          excerpt_en,
          excerpt_it,
          cover_image,
          category,
          tags,
          read_time,
          published_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }

    if (!data) return [];

    // Transform the data to BlogPostSummary format
    return data
      .map((bookmark: any) => {
        const post = bookmark.blog_posts;
        if (!post) return null;

        return {
          id: post.id,
          slug: post.slug,
          title: {
            en: post.title_en,
            it: post.title_it,
          },
          excerpt: {
            en: post.excerpt_en,
            it: post.excerpt_it,
          },
          cover_image: post.cover_image || undefined,
          category: post.category,
          tags: post.tags || [],
          read_time: post.read_time || undefined,
          published_at: post.published_at || undefined,
        };
      })
      .filter(Boolean) as BlogPostSummary[];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
}


