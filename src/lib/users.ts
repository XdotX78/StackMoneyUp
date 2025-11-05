/**
 * User Management Utilities
 * Admin-only functions for managing users and roles
 */

import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/blog';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

/**
 * Fetch all registered users with their profiles
 * Admin only
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = createClient();

  // First get all user profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, role, avatar_url, created_at')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw new Error('Failed to fetch users');
  }

  // Get auth users to retrieve emails
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('Error fetching auth users:', usersError);
    throw new Error('Failed to fetch user emails');
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
    };
  });

  return userProfiles;
}

/**
 * Update a user's role
 * Admin only
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  const supabase = createClient();

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
export async function getUserStats(): Promise<{
  total: number;
  admins: number;
  editors: number;
  users: number;
}> {
  const supabase = createClient();

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

