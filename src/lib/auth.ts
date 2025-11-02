/**
 * Real Supabase authentication utility
 * Replaces the previous mock auth (sessionStorage)
 */

import { supabase } from './supabaseClient'

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string | null
}

/**
 * Sign in with email and password (Supabase)
 */
export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const user = data.user
  if (!user) throw new Error('User not found')

  return { id: user.id, email: user.email!, name: user.user_metadata?.name || '' }
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

  return {
    user: { id: user.id, email: user.email!, name: user.user_metadata?.name || '' },
    session: data.session // null if email confirmation is required
  }
}

/**
 * Sign in with Google (OAuth)
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/` },
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
  return { 
    id: data.user.id, 
    email: data.user.email!, 
    name: data.user.user_metadata?.name || '',
    avatar_url: data.user.user_metadata?.avatar_url || null
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
  const { data: userData, error } = await supabase.auth.updateUser({
    data: { 
      name: data.name,
      avatar_url: data.avatar_url
    }
  })
  if (error) throw new Error(error.message)

  const user = userData.user
  if (!user) throw new Error('User not found')

  return { id: user.id, email: user.email!, name: user.user_metadata?.name || '' }
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
