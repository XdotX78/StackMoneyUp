'use client';

import AdSense from './AdSense';

/**
 * Horizontal Banner Ad
 * Best for: Top of pages, between content sections
 * Size: 728x90 (desktop), responsive on mobile
 */
interface AdBannerProps {
  slot?: string;
  className?: string;
}

export default function AdBanner({ slot = '0000000000', className = '' }: AdBannerProps) {
  return (
    <div className={`ad-banner my-8 ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <AdSense
        slot={slot}
        format="horizontal"
        responsive={true}
        style={{ minHeight: '90px' }}
        className="mx-auto max-w-4xl"
      />
    </div>
  );
}


