import { describe, it, expect } from 'vitest'
import { hasRole, isAdmin, isEditor } from './auth'
import type { User } from './auth'

// Note: Most auth functions require Supabase client, so we'll test pure functions first
// Integration tests will cover the full auth flow
// Note: normalizeRole is not exported, so we test it indirectly through getUserRole behavior

describe('Auth Utilities', () => {

  describe('hasRole', () => {
    const adminUser: User = {
      id: '1',
      email: 'admin@test.com',
      role: 'admin',
    }

    const editorUser: User = {
      id: '2',
      email: 'editor@test.com',
      role: 'editor',
    }

    const regularUser: User = {
      id: '3',
      email: 'user@test.com',
      role: 'user',
    }

    const userWithoutRole: User = {
      id: '4',
      email: 'norole@test.com',
    }

    it('should return false for null user', () => {
      expect(hasRole(null, 'user')).toBe(false)
      expect(hasRole(null, 'admin')).toBe(false)
    })

    it('admin should have access to all roles', () => {
      expect(hasRole(adminUser, 'admin')).toBe(true)
      expect(hasRole(adminUser, 'editor')).toBe(true)
      expect(hasRole(adminUser, 'user')).toBe(true)
    })

    it('editor should have access to editor and user roles', () => {
      expect(hasRole(editorUser, 'admin')).toBe(false)
      expect(hasRole(editorUser, 'editor')).toBe(true)
      expect(hasRole(editorUser, 'user')).toBe(true)
    })

    it('user should only have access to user role', () => {
      expect(hasRole(regularUser, 'admin')).toBe(false)
      expect(hasRole(regularUser, 'editor')).toBe(false)
      expect(hasRole(regularUser, 'user')).toBe(true)
    })

    it('should handle user without role', () => {
      expect(hasRole(userWithoutRole, 'admin')).toBe(false)
      expect(hasRole(userWithoutRole, 'editor')).toBe(false)
      expect(hasRole(userWithoutRole, 'user')).toBe(false)
    })
  })

  describe('isAdmin', () => {
    const adminUser: User = {
      id: '1',
      email: 'admin@test.com',
      role: 'admin',
    }

    const editorUser: User = {
      id: '2',
      email: 'editor@test.com',
      role: 'editor',
    }

    const regularUser: User = {
      id: '3',
      email: 'user@test.com',
      role: 'user',
    }

    it('should return true for admin user', () => {
      expect(isAdmin(adminUser)).toBe(true)
    })

    it('should return false for non-admin users', () => {
      expect(isAdmin(editorUser)).toBe(false)
      expect(isAdmin(regularUser)).toBe(false)
      expect(isAdmin(null)).toBe(false)
    })
  })

  describe('isEditor', () => {
    const adminUser: User = {
      id: '1',
      email: 'admin@test.com',
      role: 'admin',
    }

    const editorUser: User = {
      id: '2',
      email: 'editor@test.com',
      role: 'editor',
    }

    const regularUser: User = {
      id: '3',
      email: 'user@test.com',
      role: 'user',
    }

    it('should return true for admin user', () => {
      expect(isEditor(adminUser)).toBe(true)
    })

    it('should return true for editor user', () => {
      expect(isEditor(editorUser)).toBe(true)
    })

    it('should return false for regular user', () => {
      expect(isEditor(regularUser)).toBe(false)
      expect(isEditor(null)).toBe(false)
    })
  })
})

