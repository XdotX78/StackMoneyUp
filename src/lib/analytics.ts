/**
 * Analytics utilities for dashboard
 * Fetches real analytics data from Supabase
 */

import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth';
import type { BlogPostSummary } from '@/types/blog';

export interface PostAnalytics {
  id: string;
  slug: string;
  title: {
    en: string;
    it: string;
    es: string;
  };
  category: string;
  published: boolean;
  published_at?: string;
  views: number;
  reads: number;
  readRate: number;
  shares: number;
  shareBreakdown: {
    twitter: number;
    facebook: number;
    linkedin: number;
    copy: number;
  };
  bookmarks: number;
}

/**
 * Get analytics for all posts (admin/editor only)
 */
export async function getAllPostsAnalytics(): Promise<PostAnalytics[]> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated');
    }

    // Check if user is admin or editor
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
      throw new Error('Unauthorized: Admin or editor role required');
    }

    // Get all posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('id, slug, title_en, title_it, category, published, published_at, views, reads, shares')
      .order('created_at', { ascending: false });

    if (postsError) {
      throw postsError;
    }

    if (!posts) return [];

    // Get share counts for each post
    const postIds = posts.map(p => p.id);
    const { data: shareData, error: shareError } = await supabase
      .from('share_tracking')
      .select('post_id, platform')
      .in('post_id', postIds);

    if (shareError) {
      console.error('Error fetching share data:', shareError);
    }

    // Get bookmark counts for each post
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('bookmarks')
      .select('post_id')
      .in('post_id', postIds);

    if (bookmarkError) {
      console.error('Error fetching bookmark data:', bookmarkError);
    }

    // Process analytics
    const analytics: PostAnalytics[] = posts.map(post => {
      // Calculate share breakdown
      const postShares = shareData?.filter(s => s.post_id === post.id) || [];
      const shareBreakdown = {
        twitter: postShares.filter(s => s.platform === 'twitter').length,
        facebook: postShares.filter(s => s.platform === 'facebook').length,
        linkedin: postShares.filter(s => s.platform === 'linkedin').length,
        copy: postShares.filter(s => s.platform === 'copy').length,
      };
      const totalShares = Object.values(shareBreakdown).reduce((sum, count) => sum + count, 0);

      // Calculate bookmark count
      const bookmarkCount = bookmarkData?.filter(b => b.post_id === post.id).length || 0;

      // Calculate read rate
      const readRate = post.views > 0 ? (post.reads / post.views) * 100 : 0;

      return {
        id: post.id,
        slug: post.slug,
        title: {
          en: post.title_en,
          it: post.title_it,
        },
        category: post.category,
        published: post.published,
        published_at: post.published_at || undefined,
        views: post.views || 0,
        reads: post.reads || 0,
        readRate: Math.round(readRate * 10) / 10, // Round to 1 decimal
        shares: totalShares,
        shareBreakdown,
        bookmarks: bookmarkCount,
      };
    });

    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

/**
 * Get overall analytics summary
 */
export async function getAnalyticsSummary(): Promise<{
  totalViews: number;
  totalReads: number;
  avgReadRate: number;
  totalShares: number;
  totalBookmarks: number;
  shareBreakdown: {
    twitter: number;
    facebook: number;
    linkedin: number;
    copy: number;
  };
}> {
  try {
    const analytics = await getAllPostsAnalytics();
    const publishedAnalytics = analytics.filter(a => a.published);

    const totalViews = publishedAnalytics.reduce((sum, a) => sum + a.views, 0);
    const totalReads = publishedAnalytics.reduce((sum, a) => sum + a.reads, 0);
    const avgReadRate = publishedAnalytics.length > 0
      ? publishedAnalytics.reduce((sum, a) => sum + a.readRate, 0) / publishedAnalytics.length
      : 0;
    const totalShares = publishedAnalytics.reduce((sum, a) => sum + a.shares, 0);
    const totalBookmarks = publishedAnalytics.reduce((sum, a) => sum + a.bookmarks, 0);

    // Aggregate share breakdown
    const shareBreakdown = publishedAnalytics.reduce(
      (acc, a) => ({
        twitter: acc.twitter + a.shareBreakdown.twitter,
        facebook: acc.facebook + a.shareBreakdown.facebook,
        linkedin: acc.linkedin + a.shareBreakdown.linkedin,
        copy: acc.copy + a.shareBreakdown.copy,
      }),
      { twitter: 0, facebook: 0, linkedin: 0, copy: 0 }
    );

    return {
      totalViews,
      totalReads,
      avgReadRate: Math.round(avgReadRate * 10) / 10,
      totalShares,
      totalBookmarks,
      shareBreakdown,
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
}


