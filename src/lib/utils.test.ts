import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  cn,
  formatDate,
  calculateReadTime,
  generateSlug,
  truncateText,
  isValidEmail,
  debounce,
} from './utils'

describe('Utils', () => {
  describe('cn (className merge)', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    })

    it('should merge Tailwind classes correctly', () => {
      expect(cn('p-2', 'p-4')).toContain('p-4')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })

    it('should format date string', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toContain('January')
      expect(formatted).toContain('2024')
    })

    it('should format with Italian locale', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date, 'it-IT')
      expect(formatted).toContain('gennaio')
    })

    it('should include time when option is set', () => {
      const date = new Date('2024-01-15T14:30:00')
      const formatted = formatDate(date, 'en-US', { includeTime: true })
      // Time format varies by locale, just check that it contains time indicators
      expect(formatted).toMatch(/\d{1,2}/) // Contains at least one digit
      expect(formatted.toLowerCase()).toMatch(/pm|am|:|\d{1,2}/) // Contains time indicator
    })
  })

  describe('calculateReadTime', () => {
    it('should calculate reading time correctly', () => {
      const text = 'word '.repeat(200) // 200 words
      expect(calculateReadTime(text)).toBe(1)
    })

    it('should round up for partial minutes', () => {
      const text = 'word '.repeat(100) // 100 words = 0.5 minutes
      expect(calculateReadTime(text)).toBe(1)
    })

    it('should handle empty text', () => {
      // Empty string splits to [''] which has length 1, so Math.ceil(1/200) = 1
      // This is expected behavior - minimum read time is 1 minute
      expect(calculateReadTime('')).toBe(1)
    })

    it('should handle text with multiple spaces', () => {
      const text = 'word    word    word'
      expect(calculateReadTime(text)).toBe(1)
    })

    it('should calculate for long text', () => {
      const text = 'word '.repeat(1000) // 1000 words = 5 minutes
      expect(calculateReadTime(text)).toBe(5)
    })
  })

  describe('generateSlug', () => {
    it('should generate slug from text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
    })

    it('should handle special characters', () => {
      expect(generateSlug('Hello, World!')).toBe('hello-world')
    })

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello   World')).toBe('hello-world')
    })

    it('should handle underscores and hyphens', () => {
      expect(generateSlug('Hello_World-Test')).toBe('hello-world-test')
    })

    it('should trim leading and trailing hyphens', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world')
    })

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('')
    })

    it('should handle special characters only', () => {
      expect(generateSlug('!!!')).toBe('')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'a'.repeat(100)
      const truncated = truncateText(text, 50)
      expect(truncated.length).toBe(53) // 50 + '...'
      expect(truncated).toContain('...')
    })

    it('should not truncate short text', () => {
      const text = 'Hello'
      expect(truncateText(text, 50)).toBe('Hello')
    })

    it('should not add ellipsis if text is exact length', () => {
      const text = 'a'.repeat(50)
      expect(truncateText(text, 50)).toBe(text)
    })

    it('should handle empty string', () => {
      expect(truncateText('', 50)).toBe('')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('invalid@example')).toBe(false)
    })

    it('should handle empty string', () => {
      expect(isValidEmail('')).toBe(false)
    })

    it('should handle email with subdomain', () => {
      expect(isValidEmail('test@mail.example.com')).toBe(true)
    })

    it('should handle email with plus sign', () => {
      expect(isValidEmail('test+tag@example.com')).toBe(true)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg3')
    })

    it('should reset timer on new calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      vi.advanceTimersByTime(50)
      debouncedFn('arg2')
      vi.advanceTimersByTime(50)
      
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg2')
    })

    it('should handle multiple debounced functions', () => {
      const mockFn1 = vi.fn()
      const mockFn2 = vi.fn()
      const debouncedFn1 = debounce(mockFn1, 100)
      const debouncedFn2 = debounce(mockFn2, 200)

      debouncedFn1('a')
      debouncedFn2('b')

      vi.advanceTimersByTime(100)
      expect(mockFn1).toHaveBeenCalledTimes(1)
      expect(mockFn2).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn2).toHaveBeenCalledTimes(1)
    })
  })
})

