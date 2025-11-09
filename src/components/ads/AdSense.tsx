'use client';

import { useEffect, useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

/**
 * Google AdSense Configuration
 */
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '';

/**
 * Ad Slot Types
 */
export type AdSlot = {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
};

/**
 * Base AdSense Component
 * Handles cookie consent, lazy loading, and responsive ads
 */
interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
}: AdSenseProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { preferences } = useCookieConsent();

  useEffect(() => {
    // Only load ads if:
    // 1. AdSense is enabled
    // 2. User accepted marketing cookies
    // 3. Publisher ID is configured
    if (!ADSENSE_ENABLED || !preferences.marketing || !ADSENSE_PUBLISHER_ID) {
      return;
    }

    // Load ad after a short delay (better UX, faster initial page load)
    const timer = setTimeout(() => {
      try {
        // Push ad to AdSense queue
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setIsLoaded(true);
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [preferences.marketing]);

  // Don't render if AdSense is disabled or user hasn't accepted marketing cookies
  if (!ADSENSE_ENABLED || !preferences.marketing || !ADSENSE_PUBLISHER_ID) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}


