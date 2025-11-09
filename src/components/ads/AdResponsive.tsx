'use client';

import AdSense from './AdSense';

/**
 * Responsive Ad
 * Best for: Any location, auto-adjusts to available space
 * Size: Automatically adapts
 */
interface AdResponsiveProps {
  slot?: string;
  className?: string;
  minHeight?: string;
}

export default function AdResponsive({ 
  slot = '0000000003', 
  className = '',
  minHeight = '200px'
}: AdResponsiveProps) {
  return (
    <div className={`ad-responsive my-6 ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <AdSense
        slot={slot}
        format="auto"
        responsive={true}
        style={{ minHeight }}
      />
    </div>
  );
}


