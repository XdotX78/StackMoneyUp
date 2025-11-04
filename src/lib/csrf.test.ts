import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateCsrfToken,
  createCsrfToken,
  verifyCsrfToken,
  getCsrfTokenFromRequest,
  validateCsrfToken,
} from './csrf'

describe('CSRF Utilities', () => {
  describe('generateCsrfToken', () => {
    it('should generate a token', () => {
      const token = generateCsrfToken()
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should generate unique tokens', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()
      expect(token1).not.toBe(token2)
    })

    it('should generate hex-encoded tokens', () => {
      const token = generateCsrfToken()
      expect(token).toMatch(/^[0-9a-f]+$/)
    })
  })

  describe('createCsrfToken', () => {
    it('should create token and signed token', () => {
      const result = createCsrfToken()
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('signed')
      expect(result.token).toBeTruthy()
      expect(result.signed).toBeTruthy()
    })

    it('should include token in signed value', () => {
      const result = createCsrfToken()
      expect(result.signed).toContain(result.token)
    })

    it('should have signature separated by dot', () => {
      const result = createCsrfToken()
      const parts = result.signed.split('.')
      expect(parts.length).toBe(2)
      expect(parts[0]).toBe(result.token)
    })
  })

  describe('verifyCsrfToken', () => {
    it('should verify a valid signed token', () => {
      const { signed } = createCsrfToken()
      expect(verifyCsrfToken(signed)).toBe(true)
    })

    it('should reject invalid token format', () => {
      expect(verifyCsrfToken('invalid')).toBe(false)
      expect(verifyCsrfToken('token.without.signature')).toBe(false)
      expect(verifyCsrfToken('')).toBe(false)
    })

    it('should reject tampered token', () => {
      const { signed } = createCsrfToken()
      const tampered = signed.slice(0, -1) + 'X'
      expect(verifyCsrfToken(tampered)).toBe(false)
    })

    it('should reject token with wrong signature', () => {
      const { token } = createCsrfToken()
      const fakeSignature = 'a'.repeat(64)
      expect(verifyCsrfToken(`${token}.${fakeSignature}`)).toBe(false)
    })
  })

  describe('getCsrfTokenFromRequest', () => {
    it('should get token from X-CSRF-Token header', () => {
      const headers = new Headers()
      headers.set('X-CSRF-Token', 'test-token')
      const request = new Request('https://example.com', { headers })
      
      expect(getCsrfTokenFromRequest(request)).toBe('test-token')
    })

    it('should get token from csrf-token cookie', () => {
      const headers = new Headers()
      headers.set('Cookie', 'csrf-token=test-token; other=value')
      const request = new Request('https://example.com', { headers })
      
      expect(getCsrfTokenFromRequest(request)).toBe('test-token')
    })

    it('should prefer header over cookie', () => {
      const headers = new Headers()
      headers.set('X-CSRF-Token', 'header-token')
      headers.set('Cookie', 'csrf-token=cookie-token')
      const request = new Request('https://example.com', { headers })
      
      expect(getCsrfTokenFromRequest(request)).toBe('header-token')
    })

    it('should return null if no token found', () => {
      const headers = new Headers()
      const request = new Request('https://example.com', { headers })
      
      expect(getCsrfTokenFromRequest(request)).toBeNull()
    })

    it('should handle cookie with spaces', () => {
      const headers = new Headers()
      headers.set('Cookie', 'csrf-token=test-token; other=value')
      const request = new Request('https://example.com', { headers })
      
      expect(getCsrfTokenFromRequest(request)).toBe('test-token')
    })
  })

  describe('validateCsrfToken', () => {
    it('should validate valid token from request', () => {
      const { signed } = createCsrfToken()
      const headers = new Headers()
      headers.set('X-CSRF-Token', signed)
      const request = new Request('https://example.com', { headers })
      
      expect(validateCsrfToken(request)).toBe(true)
    })

    it('should reject invalid token from request', () => {
      const headers = new Headers()
      headers.set('X-CSRF-Token', 'invalid-token')
      const request = new Request('https://example.com', { headers })
      
      expect(validateCsrfToken(request)).toBe(false)
    })

    it('should reject request without token', () => {
      const headers = new Headers()
      const request = new Request('https://example.com', { headers })
      
      expect(validateCsrfToken(request)).toBe(false)
    })
  })
})

