'use client';

import AdSense from './AdSense';

/**
 * Sidebar Ad (Skyscraper)
 * Best for: Right sidebar on desktop
 * Size: 300x600 (desktop), hidden on mobile
 */
interface AdSidebarProps {
  slot?: string;
  className?: string;
}

export default function AdSidebar({ slot = '0000000001', className = '' }: AdSidebarProps) {
  return (
    <div className={`ad-sidebar hidden lg:block ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <AdSense
        slot={slot}
        format="vertical"
        responsive={true}
        style={{ minHeight: '600px', minWidth: '300px' }}
      />
    </div>
  );
}


