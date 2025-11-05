/**
 * Share tracking utilities
 * Tracks social media shares for analytics
 */

import { supabase } from './supabaseClient';
import { getCurrentUser } from './auth';

export type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'copy';

export interface ShareTracking {
  id: string;
  post_id: string;
  platform: SharePlatform;
  shared_at: string;
  user_id?: string;
}

/**
 * Track a share event
 */
export async function trackShare(
  postId: string,
  platform: SharePlatform
): Promise<void> {
  try {
    const user = await getCurrentUser();
    
    // Get client info (IP, user agent) - these are optional
    const shareData: Partial<ShareTracking> = {
      post_id: postId,
      platform,
      user_id: user?.id,
    };

    const { error } = await supabase
      .from('share_tracking')
      .insert(shareData);

    if (error) {
      console.error('Error tracking share:', error);
      // Don't throw - tracking failures shouldn't break the app
    }
  } catch (error) {
    console.error('Error tracking share:', error);
    // Don't throw - tracking failures shouldn't break the app
  }
}

/**
 * Get share count for a post by platform
 */
export async function getPostShareCounts(postId: string): Promise<Record<SharePlatform, number>> {
  try {
    const { data, error } = await supabase
      .rpc('get_post_share_count', { post_uuid: postId });

    if (error) {
      console.error('Error getting share counts:', error);
      return {
        twitter: 0,
        facebook: 0,
        linkedin: 0,
        copy: 0,
      };
    }

    const counts: Record<SharePlatform, number> = {
      twitter: 0,
      facebook: 0,
      linkedin: 0,
      copy: 0,
    };

    if (data) {
      data.forEach((item: { platform: string; count: number }) => {
        if (item.platform in counts) {
          counts[item.platform as SharePlatform] = item.count;
        }
      });
    }

    return counts;
  } catch (error) {
    console.error('Error getting share counts:', error);
    return {
      twitter: 0,
      facebook: 0,
      linkedin: 0,
      copy: 0,
    };
  }
}


