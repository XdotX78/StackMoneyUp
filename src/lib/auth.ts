/**
 * Real Supabase authentication utility
 * Replaces the previous mock auth (sessionStorage)
 */

import { supabase } from './supabaseClient'

export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string | null
  role?: UserRole
}

/**
 * Normalize role from Supabase to lowercase (admin, editor, user)
 */
function normalizeRole(role: any): UserRole {
  if (!role || typeof role !== 'string') return 'user'
  const normalized = role.toLowerCase().trim()
  if (normalized === 'admin' || normalized === 'editor' || normalized === 'user') {
    return normalized as UserRole
  }
  return 'user'
}

/**
 * Get user role from profiles table
 */
async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    // If profile doesn't exist, return default 'user'
    return 'user'
  }

  return normalizeRole(data.role)
}

/**
 * Sign in with email and password (Supabase)
 */
export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const user = data.user
  if (!user) throw new Error('User not found')

  // Get role from profiles table
  const role = await getUserRole(user.id)

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || '',
    role
  }
}

/**
 * Sign up (register new user)
 * Returns user and session (session is null if email confirmation is required)
 */
export async function signUp(email: string, password: string): Promise<{ user: User; session: any }> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)

  const user = data.user
  if (!user) throw new Error('User not found')

  // Create profile entry with default role 'user'
  // Note: This will be handled by a database trigger in production
  // For now, we'll query the role (which should default to 'user')
  const role = await getUserRole(user.id)

  return {
    user: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || '',
      role
    },
    session: data.session // null if email confirmation is required
  }
}

/**
 * Sign in with Google (OAuth)
 * @param lang - Language code for redirect (default: 'en')
 */
export async function signInWithGoogle(lang: string = 'en') {
  const redirectUrl = `${window.location.origin}/${lang}/auth/callback?lang=${lang}`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) throw new Error(error.message)
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw new Error(error.message)
  if (!data.user) return null

  // Get profile data (role, full_name) from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .single()

  // If profile doesn't exist, use defaults and metadata as fallback
  const role = profile ? normalizeRole(profile.role) : 'user'
  const name = profile?.full_name || data.user.user_metadata?.name || data.user.user_metadata?.full_name || ''
  const avatar_url = data.user.user_metadata?.avatar_url || null

  return {
    id: data.user.id,
    email: data.user.email!,
    name,
    avatar_url,
    role
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession()
  return !!data.session
}

/**
 * Update user profile (name/display name)
 */
export async function updateProfile(data: { name?: string; avatar_url?: string }): Promise<User> {
  const { data: userData, error: authError } = await supabase.auth.getUser()
  if (authError || !userData.user) throw new Error('User not found')

  const userId = userData.user.id

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()

  // Prepare profile data
  const profileData: { id: string; role?: string; full_name?: string } = {
    id: userId
  }

  // Only set role for new profiles
  if (!existingProfile) {
    profileData.role = 'user' // Default role for new profiles
  }

  // Update full_name if provided (note: database uses full_name, not name)
  if (data.name !== undefined) profileData.full_name = data.name

  // Upsert profile (update if exists, insert if new)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(profileData, { onConflict: 'id' })

  if (profileError) throw new Error(profileError.message)

  // Also update user_metadata for backward compatibility
  if (data.name || data.avatar_url) {
    await supabase.auth.updateUser({
      data: {
        name: data.name,
        avatar_url: data.avatar_url
      }
    })
  }

  // Get updated profile data
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', userId)
    .single()

  // Get auth user data
  const { data: authUser } = await supabase.auth.getUser()
  if (!authUser.user) throw new Error('User not found')

  return {
    id: authUser.user.id,
    email: authUser.user.email!,
    name: updatedProfile?.full_name || authUser.user.user_metadata?.name || authUser.user.user_metadata?.full_name || '',
    avatar_url: authUser.user.user_metadata?.avatar_url || null,
    role: updatedProfile ? normalizeRole(updatedProfile.role) : 'user'
  }
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false
  // Admin has access to everything
  if (user.role === 'admin') return true
  // Editor has access to editor and user roles
  if (user.role === 'editor' && (role === 'editor' || role === 'user')) return true
  // User only has access to user role
  return user.role === role
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin')
}

/**
 * Check if user is editor or admin
 */
export function isEditor(user: User | null): boolean {
  return hasRole(user, 'editor') || isAdmin(user)
}

/**
 * Upload avatar image to Supabase Storage
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 2MB for avatars)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Image size must be less than 2MB')
  }

  // Create unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) throw new Error(error.message)

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Change user password
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  // First verify current password by attempting to sign in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('User not found')

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  })

  if (signInError) {
    throw new Error('Current password is incorrect')
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw new Error(error.message)
}

/**
 * Request password reset email
 */
export async function resetPassword(email: string, lang: string = 'en'): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/${lang}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

/**
 * Update password using reset token
 */
export async function updatePasswordWithToken(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })
  if (error) throw new Error(error.message)
}

/**
 * Require authentication (client-side redirect)
 */
export async function requireAuth(redirectTo: string = '/en/login'): Promise<boolean> {
  const loggedIn = await isAuthenticated()
  if (!loggedIn && typeof window !== 'undefined') {
    window.location.href = redirectTo
    return false
  }
  return true
}

/**
 * Update user role (admin function)
 * This function requires the service role key to bypass RLS
 * Only use this server-side with SUPABASE_SERVICE_ROLE_KEY
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  // This function should be called server-side with service role key
  // For client-side, users need to update via Supabase dashboard or SQL

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    // If RLS blocks the update, provide helpful error message
    if (error.code === '42501' || error.message.includes('policy')) {
      throw new Error(
        'Permission denied. To update roles, you need to either:\n' +
        '1. Use the service role key (server-side only)\n' +
        '2. Update directly in Supabase dashboard SQL editor\n' +
        '3. Run: UPDATE profiles SET role = \'admin\' WHERE id = \'' + userId + '\';'
      )
    }
    throw new Error(error.message)
  }
}
