/**
 * Server Actions for User Management
 * Admin-only operations that require service role
 */

'use server';

import { createClient } from '@supabase/supabase-js';
import type { UserRole } from '@/types/blog';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
}

/**
 * Fetch all registered users with their profiles
 * Admin only - uses service role
 */
export async function getAllUsersAction(): Promise<UserProfile[]> {
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
    .select('id, name, role, avatar_url, created_at')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw new Error('Failed to fetch users');
  }

  // Get auth users to retrieve emails and confirmation status
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error fetching auth users:', usersError);
    throw new Error('Failed to fetch user details');
  }

  // Merge profiles with auth data
  const userProfiles: UserProfile[] = profiles.map((profile) => {
    const authUser = users.find((u) => u.id === profile.id);
    return {
      id: profile.id,
      email: authUser?.email || 'N/A',
      name: profile.name,
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
    console.error('Error updating user role:', error);
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
    console.error('Error fetching user stats:', error);
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

