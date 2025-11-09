/**
 * User-related type definitions
 * Centralized source of truth for user data structures
 */

import type { UserRole } from '@/lib/auth';

/**
 * Complete user profile from Supabase
 * Combines auth.users and public.profiles data
 */
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string | null; // Note: This maps to 'full_name' in database
  avatar_url: string | null;
  created_at: string;
  updated_at?: string; // Optional: not always included
  last_sign_in_at: string | null;
  email_confirmed?: boolean; // Optional: not always included
}

/**
 * Simplified user profile for display purposes
 * Used in UI components where full data isn't needed
 */
export interface UserProfileSummary {
  id: string;
  email: string;
  role: UserRole;
  name: string | null; // Note: This maps to 'full_name' in database
  avatar_url: string | null;
}

