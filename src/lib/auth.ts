/**
 * Real Supabase authentication utility
 * Replaces the previous mock auth (sessionStorage)
 */

import { supabase } from './supabaseClient'

export interface User {
  id: string
  email: string
  name?: string
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
 */
export async function signUp(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)

  const user = data.user
  if (!user) throw new Error('User not found')

  return { id: user.id, email: user.email!, name: user.user_metadata?.name || '' }
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
  return { id: data.user.id, email: data.user.email!, name: data.user.user_metadata?.name || '' }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data } = await supabase.auth.getSession()
  return !!data.session
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
