/**
 * Hook for role-based access control
 */

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getCurrentUser, hasRole, isAdmin, isEditor, type User, type UserRole } from '@/lib/auth';

export function useRole() {
  const { user: supabaseUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserWithRole = async () => {
      if (!supabaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userWithRole = await getCurrentUser();
        setUser(userWithRole);
      } catch (error) {
        console.error('Error fetching user with role:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWithRole();
  }, [supabaseUser]);

  return {
    user,
    loading,
    hasRole: (role: UserRole) => hasRole(user, role),
    isAdmin: () => isAdmin(user),
    isEditor: () => isEditor(user),
    canAccessDashboard: () => user !== null, // All authenticated users can access dashboard
    canManagePosts: () => isEditor(user), // Only editors and admins
    canManageUsers: () => isAdmin(user), // Only admins
    canManageSettings: () => isAdmin(user), // Only admins
  };
}

