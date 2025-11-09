'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Modal, ModalHeader, ModalBody } from './ui/Modal';
import type { Language } from '@/types/blog';

interface CookiePreferences {
  essential: boolean; // Always true, can't be disabled
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  lang: Language;
}

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

export default function CookieConsent({ lang }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentGiven) {
      // Show banner after a short delay (better UX)
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load existing preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    // Save preferences
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    
    // Set a cookie to remember consent (for 1 year)
    document.cookie = `cookie-consent=true; max-age=31536000; path=/; SameSite=Lax`;
    
    // Apply preferences (block/unblock scripts)
    applyPreferences(prefs);
    
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectNonEssential = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Enable/disable analytics and marketing scripts based on user preferences
    // For example, conditionally load Google Analytics based on prefs.analytics
    
    if (prefs.analytics) {
      // Enable analytics (e.g., Google Analytics, Plausible)
      // Example: window.gtag('consent', 'update', { analytics_storage: 'granted' });
    } else {
      // Disable analytics
      // Example: window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    if (prefs.marketing) {
      // Enable marketing cookies (AdSense, etc.)
      // Handled by AdSense component via CookieConsentContext
    } else {
      // Disable marketing cookies
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential can't be toggled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const texts = {
    en: {
      banner: {
        title: '🍪 We value your privacy',
        description: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
        acceptAll: 'Accept All',
        rejectAll: 'Reject Non-Essential',
        customize: 'Customize',
        learnMore: 'Learn more',
      },
      preferences: {
        title: 'Cookie Preferences',
        description: 'We use cookies to improve your experience on our site. You can customize your preferences below.',
        essential: {
          title: 'Essential Cookies',
          description: 'Required for the website to function properly. These cookies enable core functionality such as authentication and security. Cannot be disabled.',
          required: 'Always Active',
        },
        analytics: {
          title: 'Analytics Cookies',
          description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
        },
        marketing: {
          title: 'Marketing Cookies',
          description: 'Used to track visitors across websites to display relevant advertisements and encourage engagement.',
        },
        savePreferences: 'Save Preferences',
        acceptAll: 'Accept All',
      },
    },
    it: {
      banner: {
        title: '🍪 Rispettiamo la tua privacy',
        description: 'Utilizziamo i cookie per migliorare la tua esperienza di navigazione, fornire contenuti personalizzati e analizzare il nostro traffico. Cliccando "Accetta Tutti", acconsenti all\'uso dei cookie.',
        acceptAll: 'Accetta Tutti',
        rejectAll: 'Rifiuta Non Essenziali',
        customize: 'Personalizza',
        learnMore: 'Scopri di più',
      },
      preferences: {
        title: 'Preferenze Cookie',
        description: 'Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. Puoi personalizzare le tue preferenze qui sotto.',
        essential: {
          title: 'Cookie Essenziali',
          description: 'Necessari per il corretto funzionamento del sito. Questi cookie abilitano funzionalità core come autenticazione e sicurezza. Non possono essere disabilitati.',
          required: 'Sempre Attivi',
        },
        analytics: {
          title: 'Cookie Analitici',
          description: 'Ci aiutano a capire come i visitatori interagiscono con il nostro sito raccogliendo e segnalando informazioni in modo anonimo.',
        },
        marketing: {
          title: 'Cookie Marketing',
          description: 'Utilizzati per tracciare i visitatori attraverso i siti web per mostrare annunci rilevanti e incoraggiare il coinvolgimento.',
        },
        savePreferences: 'Salva Preferenze',
        acceptAll: 'Accetta Tutti',
      },
    },
    es: {
      banner: {
        title: '🍪 Valoramos tu privacidad',
        description: 'Utilizamos cookies para mejorar tu experiencia de navegación, ofrecer contenido personalizado y analizar nuestro tráfico. Al hacer clic en "Aceptar Todas", consientes el uso de cookies.',
        acceptAll: 'Aceptar Todas',
        rejectAll: 'Rechazar No Esenciales',
        customize: 'Personalizar',
        learnMore: 'Más información',
      },
      preferences: {
        title: 'Preferencias de Cookies',
        description: 'Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Puedes personalizar tus preferencias a continuación.',
        essential: {
          title: 'Cookies Esenciales',
          description: 'Necesarias para el correcto funcionamiento del sitio. Estas cookies habilitan funcionalidades básicas como autenticación y seguridad. No se pueden desactivar.',
          required: 'Siempre Activas',
        },
        analytics: {
          title: 'Cookies Analíticas',
          description: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio recopilando e informando información de forma anónima.',
        },
        marketing: {
          title: 'Cookies de Marketing',
          description: 'Se utilizan para rastrear visitantes en diferentes sitios web para mostrar anuncios relevantes y fomentar la interacción.',
        },
        savePreferences: 'Guardar Preferencias',
        acceptAll: 'Aceptar Todas',
      },
    },
  };

  const t = texts[lang] || texts.en;

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 shadow-2xl">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                {t.banner.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t.banner.description}{' '}
                <Link 
                  href={`/${lang}/privacy`} 
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  {t.banner.learnMore}
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={rejectNonEssential}
                variant="outline"
                size="sm"
              >
                {t.banner.rejectAll}
              </Button>
              <Button
                onClick={() => setShowPreferences(true)}
                variant="outline"
                size="sm"
              >
                {t.banner.customize}
              </Button>
              <Button
                onClick={acceptAll}
                variant="primary"
                size="sm"
              >
                {t.banner.acceptAll}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      <Modal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        size="lg"
      >
        <ModalHeader>{t.preferences.title}</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t.preferences.description}
            </p>

          {/* Essential Cookies */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t.preferences.essential.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.preferences.essential.description}
                </p>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {t.preferences.essential.required}
                </span>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t.preferences.analytics.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.preferences.analytics.description}
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => togglePreference('analytics')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.analytics ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={preferences.analytics}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {t.preferences.marketing.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t.preferences.marketing.description}
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => togglePreference('marketing')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.marketing ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  role="switch"
                  aria-checked={preferences.marketing}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={acceptAll}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {t.preferences.acceptAll}
              </Button>
              <Button
                onClick={() => savePreferences(preferences)}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                {t.preferences.savePreferences}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

