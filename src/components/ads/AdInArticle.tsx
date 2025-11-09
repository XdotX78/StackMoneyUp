'use client';

import AdSense from './AdSense';

/**
 * In-Article Ad
 * Best for: Middle of blog posts, naturally blends with content
 * Size: Responsive, adapts to content width
 */
interface AdInArticleProps {
  slot?: string;
  className?: string;
}

export default function AdInArticle({ slot = '0000000002', className = '' }: AdInArticleProps) {
  return (
    <div className={`ad-in-article my-8 ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
      <AdSense
        slot={slot}
        format="fluid"
        responsive={true}
        style={{ minHeight: '250px' }}
        className="max-w-3xl mx-auto"
      />
    </div>
  );
}


