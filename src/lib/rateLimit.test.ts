import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimit, getClientIdentifier, withRateLimit } from './rateLimit'
import type { NextRequest } from 'next/server'

// We need to access the internal store to reset it between tests
// Since it's not exported, we'll test the behavior instead

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset rate limit by using a unique identifier for each test
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('rateLimit', () => {
    it('should allow requests within limit', () => {
      const identifier = `test-${Date.now()}-${Math.random()}`
      const options = { windowMs: 60000, max: 5 }
      
      const result1 = rateLimit(identifier, options)
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4)
      expect(result1.limit).toBe(5)
      
      const result2 = rateLimit(identifier, options)
      expect(result2.success).toBe(true)
      expect(result2.remaining).toBe(3)
    })

    it('should reject requests exceeding limit', () => {
      const identifier = `test-${Date.now()}-${Math.random()}`
      const options = { windowMs: 60000, max: 2 }
      
      rateLimit(identifier, options)
      rateLimit(identifier, options)
      const result = rateLimit(identifier, options)
      
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.message).toBeDefined()
    })

    it('should reset window after expiration', () => {
      const identifier = `test-${Date.now()}-${Math.random()}`
      const options = { windowMs: 1000, max: 2 }
      
      // Make 2 requests
      rateLimit(identifier, options)
      rateLimit(identifier, options)
      
      // Advance time past window
      vi.advanceTimersByTime(1001)
      
      // Should be able to make requests again
      const result = rateLimit(identifier, options)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)
    })

    it('should use custom error message', () => {
      const identifier = `test-${Date.now()}-${Math.random()}`
      const options = { 
        windowMs: 60000, 
        max: 1,
        message: 'Custom rate limit message'
      }
      
      rateLimit(identifier, options)
      const result = rateLimit(identifier, options)
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Custom rate limit message')
    })

    it('should return correct reset timestamp', () => {
      const identifier = `test-${Date.now()}-${Math.random()}`
      const options = { windowMs: 60000, max: 5 }
      
      const result = rateLimit(identifier, options)
      expect(result.reset).toBeGreaterThan(Math.floor(Date.now() / 1000))
      expect(result.reset).toBeLessThan(Math.floor((Date.now() + 61000) / 1000))
    })
  })

  describe('getClientIdentifier', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const headers = new Headers()
      headers.set('x-forwarded-for', '192.168.1.1, 10.0.0.1')
      const request = new Request('https://example.com', { headers })
      
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:192.168.1.1')
    })

    it('should use x-real-ip if x-forwarded-for is not available', () => {
      const headers = new Headers()
      headers.set('x-real-ip', '192.168.1.2')
      const request = new Request('https://example.com', { headers })
      
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:192.168.1.2')
    })

    it('should use unknown if no IP headers available', () => {
      const request = new Request('https://example.com')
      
      const identifier = getClientIdentifier(request)
      expect(identifier).toBe('ip:unknown')
    })

    it('should handle NextRequest type', () => {
      const headers = new Headers()
      headers.set('x-forwarded-for', '192.168.1.3')
      const nextRequest = {
        headers,
      } as unknown as NextRequest
      
      const identifier = getClientIdentifier(nextRequest)
      expect(identifier).toBe('ip:192.168.1.3')
    })
  })

  describe('withRateLimit', () => {
    it('should call handler when under limit', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('OK'))
      const wrapped = withRateLimit(handler, { windowMs: 60000, max: 5 })
      
      const request = new Request('https://example.com')
      await wrapped(request)
      
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should return 429 when over limit', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))
      const wrapped = withRateLimit(handler, { windowMs: 60000, max: 1 })
      
      // Use a unique IP for this test to avoid conflicts
      const uniqueIp = `test-ip-${Date.now()}-${Math.random()}`
      const headers = new Headers()
      headers.set('x-forwarded-for', uniqueIp)
      const request = new Request('https://example.com', { headers })
      
      // First request should succeed (count = 1, max = 1, so 1 <= 1)
      const response1 = await wrapped(request)
      expect(response1.status).toBe(200)
      expect(handler).toHaveBeenCalledTimes(1)
      
      // Second request should be rate limited (count = 2, max = 1, so 2 > 1)
      const response2 = await wrapped(request)
      expect(response2.status).toBe(429)
      expect(handler).toHaveBeenCalledTimes(1) // Handler should not be called again
      
      const body = await response2.json()
      expect(body.error).toBeDefined()
    })

    it('should add rate limit headers to response', async () => {
      const handler = vi.fn().mockResolvedValue(new Response('OK'))
      const wrapped = withRateLimit(handler, { windowMs: 60000, max: 5 })
      
      const request = new Request('https://example.com')
      const response = await wrapped(request)
      
      expect(response.headers.get('X-RateLimit-Limit')).toBe('5')
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
    })
  })
})

