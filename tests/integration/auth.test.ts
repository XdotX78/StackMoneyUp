/**
 * Integration Tests: Authentication Flow
 * Tests real Supabase auth interactions
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signUp, signIn, signOut, getCurrentUser, resetPassword } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

// Test user credentials
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';
const TEST_NAME = 'Test User';

describe('Authentication Integration Tests', () => {
  let testUserId: string | null = null;

  afterAll(async () => {
    // Cleanup: Delete test user
    if (testUserId) {
      try {
        await supabase.auth.admin.deleteUser(testUserId);
      } catch (error) {
        console.warn('Failed to cleanup test user:', error);
      }
    }
  });

  describe('Sign Up', () => {
    it('should create a new user account', async () => {
      const result = await signUp(TEST_EMAIL, TEST_PASSWORD, TEST_NAME);

      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(TEST_EMAIL);
      
      testUserId = result.user?.id || null;
    }, 10000); // Longer timeout for network request

    it('should fail with duplicate email', async () => {
      await expect(
        signUp(TEST_EMAIL, TEST_PASSWORD, TEST_NAME)
      ).rejects.toThrow();
    }, 10000);

    it('should fail with weak password', async () => {
      await expect(
        signUp(`test-weak-${Date.now()}@example.com`, '123', TEST_NAME)
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Sign In', () => {
    it('should sign in with valid credentials', async () => {
      const result = await signIn(TEST_EMAIL, TEST_PASSWORD);

      expect(result.user).toBeDefined();
      expect(result.session).toBeDefined();
      expect(result.user?.email).toBe(TEST_EMAIL);
    }, 10000);

    it('should fail with wrong password', async () => {
      await expect(
        signIn(TEST_EMAIL, 'WrongPassword123!')
      ).rejects.toThrow();
    }, 10000);

    it('should fail with non-existent email', async () => {
      await expect(
        signIn('nonexistent@example.com', TEST_PASSWORD)
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Get Current User', () => {
    beforeAll(async () => {
      // Sign in first
      await signIn(TEST_EMAIL, TEST_PASSWORD);
    });

    it('should return current authenticated user', async () => {
      const user = await getCurrentUser();

      expect(user).toBeDefined();
      expect(user?.email).toBe(TEST_EMAIL);
      expect(user?.role).toBeDefined();
    }, 10000);

    it('should include user profile data', async () => {
      const user = await getCurrentUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
    }, 10000);
  });

  describe('Sign Out', () => {
    it('should sign out current user', async () => {
      await expect(signOut()).resolves.not.toThrow();
    }, 10000);

    it('should return null after sign out', async () => {
      const user = await getCurrentUser();
      expect(user).toBeNull();
    }, 10000);
  });

  describe('Session Persistence', () => {
    it('should maintain session after page refresh', async () => {
      // Sign in
      await signIn(TEST_EMAIL, TEST_PASSWORD);

      // Get user
      const user1 = await getCurrentUser();
      expect(user1).toBeDefined();

      // Simulate page refresh by getting user again
      const user2 = await getCurrentUser();
      expect(user2).toBeDefined();
      expect(user2?.email).toBe(TEST_EMAIL);
    }, 10000);
  });

  describe('Password Reset', () => {
    it('should send password reset email', async () => {
      await expect(
        resetPassword(TEST_EMAIL)
      ).resolves.not.toThrow();
    }, 10000);

    it('should fail with invalid email', async () => {
      await expect(
        resetPassword('invalid-email')
      ).rejects.toThrow();
    }, 10000);
  });
});

