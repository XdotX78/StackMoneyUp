'use client';

import { useEffect } from 'react';

interface BlogPostContentProps {
  children: React.ReactNode;
  postUrl: string;
}

/**
 * BlogPostContent Component
 * 
 * Wraps blog post content and adds automatic source attribution when users copy text.
 * This helps protect content from plagiarism and provides backlinks when content is shared.
 * 
 * Features:
 * - Auto-adds source URL when users copy > 100 characters
 * - Tracks copy events in analytics (if available)
 * - SEO-friendly content protection
 */
export default function BlogPostContent({ children, postUrl }: BlogPostContentProps) {
  useEffect(() => {
    const onCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString() || '';
      
      // Only add attribution for significant text selections (> 100 characters)
      // This avoids annoying users who copy small snippets
      if (selection.length > 100) {
        const source = `\n\n📖 Read more at: ${postUrl}\n© ${new Date().getFullYear()} StackMoneyUp. All rights reserved.`;
        
        // Set custom clipboard data with attribution
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', selection + source);
          e.preventDefault();
        }
        
        // Optional: Track copy events in analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'content_copy', {
            event_category: 'engagement',
            event_label: postUrl,
            value: selection.length,
          });
        }
      }
    };
    
    document.addEventListener('copy', onCopy);
    return () => document.removeEventListener('copy', onCopy);
  }, [postUrl]);

  return <div className="blog-post-content">{children}</div>;
}



