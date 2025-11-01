/**
 * Frontend-only authentication utility
 * Uses sessionStorage for mock auth until Supabase is connected
 */

const AUTH_KEY = 'stackmoneyup_auth';
const USER_KEY = 'stackmoneyup_user';

export interface User {
  id: string;
  email: string;
  name?: string;
}

/**
 * Sign in with email and password (mock)
 * In production, this will use Supabase
 */
export function signIn(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock validation - accept any email/password for now
      if (email && password) {
        const user: User = {
          id: 'mock-user-123',
          email,
          name: email.split('@')[0],
        };
        
        // Store in sessionStorage
        sessionStorage.setItem(AUTH_KEY, 'authenticated');
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        
        resolve(user);
      } else {
        reject(new Error('Email and password are required'));
      }
    }, 500);
  });
}

/**
 * Sign out current user
 */
export function signOut(): void {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const auth = sessionStorage.getItem(AUTH_KEY);
  const userStr = sessionStorage.getItem(USER_KEY);
  
  if (auth === 'authenticated' && userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
  
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_KEY) === 'authenticated';
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use this in client components
 */
export function requireAuth(redirectTo: string = '/en/login'): boolean {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return false;
  }
  return true;
}

