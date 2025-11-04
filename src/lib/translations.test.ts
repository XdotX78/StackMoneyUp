import { describe, it, expect } from 'vitest'
import {
  getTranslations,
  getCategoryTranslation,
  getLocalizedContent,
  isValidLanguage,
  getDefaultLanguage,
} from './translations'
import type { Language } from '@/types/blog'

describe('Translation Utilities', () => {
  describe('getTranslations', () => {
    it('should return English translations for en', () => {
      const t = getTranslations('en')
      expect(t.nav.home).toBe('Home')
      expect(t.blog.title).toBe('Financial Wisdom')
    })

    it('should return Italian translations for it', () => {
      const t = getTranslations('it')
      expect(t.nav.home).toBe('Home')
      expect(t.blog.title).toBe('Saggezza Finanziaria')
    })

    it('should fallback to English for invalid language', () => {
      const t = getTranslations('fr' as Language)
      expect(t.nav.home).toBe('Home')
    })
  })

  describe('getCategoryTranslation', () => {
    it('should return translated category in English', () => {
      expect(getCategoryTranslation('Investing', 'en')).toBe('Investing')
      expect(getCategoryTranslation('Saving & Emergency Fund', 'en')).toBe('Saving & Emergency Fund')
    })

    it('should return translated category in Italian', () => {
      expect(getCategoryTranslation('Investing', 'it')).toBe('Investimenti')
      expect(getCategoryTranslation('Saving & Emergency Fund', 'it')).toBe('Risparmio & Fondo Emergenza')
    })

    it('should fallback to original category if not found', () => {
      expect(getCategoryTranslation('Unknown Category', 'en')).toBe('Unknown Category')
      expect(getCategoryTranslation('Unknown Category', 'it')).toBe('Unknown Category')
    })
  })

  describe('getLocalizedContent', () => {
    it('should return English content for en', () => {
      const content = { en: 'Hello', it: 'Ciao' }
      expect(getLocalizedContent(content, 'en')).toBe('Hello')
    })

    it('should return Italian content for it', () => {
      const content = { en: 'Hello', it: 'Ciao' }
      expect(getLocalizedContent(content, 'it')).toBe('Ciao')
    })

    it('should fallback to English if language not available', () => {
      const content = { en: 'Hello', it: 'Ciao' }
      expect(getLocalizedContent(content, 'fr' as Language)).toBe('Hello')
    })
  })

  describe('isValidLanguage', () => {
    it('should return true for valid languages', () => {
      expect(isValidLanguage('en')).toBe(true)
      expect(isValidLanguage('it')).toBe(true)
    })

    it('should return false for invalid languages', () => {
      expect(isValidLanguage('fr')).toBe(false)
      expect(isValidLanguage('de')).toBe(false)
      expect(isValidLanguage('')).toBe(false)
      expect(isValidLanguage('en-US')).toBe(false)
    })
  })

  describe('getDefaultLanguage', () => {
    it('should return en as default language', () => {
      expect(getDefaultLanguage()).toBe('en')
    })
  })
})

