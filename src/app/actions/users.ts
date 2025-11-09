/**
 * Server Actions for User Management
 * Admin-only operations that require service role
 */

'use server';

import { createClient } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/auth';
import type { UserProfile } from '@/types/user';
import { logger } from '@/lib/logger';

/**
 * Fetch all registered users with their profiles
 * Admin only - uses service role
 */
export async function getAllUsersAction(): Promise<UserProfile[]> {
  // Check if service role key is available
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to your .env.local file. Get it from: https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api');
  }

  // Create admin client with service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // First get all user profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, role, avatar_url, created_at')
    .order('created_at', { ascending: false });

  if (profilesError) {
    logger.error('Error fetching profiles', profilesError, { context: 'getAllUsersAction' });
    throw new Error(`Failed to fetch users: ${profilesError.message || profilesError.code || 'Unknown error'}`);
  }

  // Get auth users to retrieve emails and confirmation status
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    logger.error('Error fetching auth users', usersError, { context: 'getAllUsersAction' });
    throw new Error('Failed to fetch user details');
  }

  // Merge profiles with auth data
  const userProfiles: UserProfile[] = profiles.map((profile) => {
    const authUser = users.find((u) => u.id === profile.id);
    return {
      id: profile.id,
      email: authUser?.email || 'N/A',
      name: profile.full_name, // Maps full_name from database to name in UserProfile
      role: profile.role as UserRole,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      last_sign_in_at: authUser?.last_sign_in_at || null,
      email_confirmed: authUser?.email_confirmed_at ? true : false,
    };
  });

  return userProfiles;
}

/**
 * Update a user's role
 * Admin only - uses service role
 */
export async function updateUserRoleAction(userId: string, newRole: UserRole): Promise<void> {
  // Check if service role key is available
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to your .env.local file.');
  }

  // Create admin client with service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    logger.error('Error updating user role', error, { context: 'updateUserRoleAction', userId, newRole });
    throw new Error('Failed to update user role');
  }
}

/**
 * Get user statistics
 * Admin only
 */
export async function getUserStatsAction(): Promise<{
  total: number;
  admins: number;
  editors: number;
  users: number;
}> {
  // Check if service role key is available
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to your .env.local file.');
  }

  // Create admin client with service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data, error } = await supabase
    .from('profiles')
    .select('role');

  if (error) {
    logger.error('Error fetching user stats', error, { context: 'getUserStatsAction' });
    throw new Error('Failed to fetch user statistics');
  }

  const stats = {
    total: data.length,
    admins: data.filter((u) => u.role === 'admin').length,
    editors: data.filter((u) => u.role === 'editor').length,
    users: data.filter((u) => u.role === 'user').length,
  };

  return stats;
}

