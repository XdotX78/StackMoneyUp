'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  preferences: CookiePreferences;
  hasConsent: boolean;
  updatePreferences: (prefs: CookiePreferences) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const COOKIE_PREFERENCES_KEY = 'cookie-preferences';
const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consent && savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
      setHasConsent(true);
    }
  }, []);

  const updatePreferences = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    setHasConsent(true);
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
  };

  return (
    <CookieConsentContext.Provider value={{ preferences, hasConsent, updatePreferences }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}


