'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui';
import BlogEditor from './BlogEditor';
import { getCategoryTranslation } from '@/lib/translations';
import { formatDate, calculateReadTime } from '@/lib/utils';
import type { Language } from '@/types/blog';

interface BlogPostPreviewProps {
  title: string;
  excerpt: string;
  content: string; // JSON string
  category: string;
  tags: string[];
  cover_image?: string;
  lang: Language;
}

export default function BlogPostPreview({
  title,
  excerpt,
  content,
  category,
  tags,
  cover_image,
  lang,
}: BlogPostPreviewProps) {
  // Calculate read time from content
  // Extract text from TipTap JSON content structure
  const extractTextFromContent = (jsonContent: string): string => {
    try {
      const parsed = JSON.parse(jsonContent);
      const extractText = (node: unknown): string => {
        if (typeof node === 'string') return node;
        if (node && typeof node === 'object' && 'content' in node && Array.isArray(node.content)) {
          return (node.content as unknown[]).map(extractText).join(' ');
        }
        if (node && typeof node === 'object' && 'text' in node && typeof node.text === 'string') {
          return node.text;
        }
        if (node && typeof node === 'object' && 'content' in node) {
          return extractText(node.content);
        }
        return '';
      };
      return extractText(parsed);
    } catch {
      return '';
    }
  };
  
  const textContent = extractTextFromContent(content);
  const readTime = calculateReadTime(textContent);

  return (
    <article className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <header className="mb-8">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <Badge variant="success" size="sm">
            {getCategoryTranslation(category, lang)}
          </Badge>
          <span>{formatDate(new Date().toISOString(), lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-US')}</span>
          <span>•</span>
          <span>{readTime} {lang === 'it' ? 'min lettura' : lang === 'es' ? 'min lectura' : 'min read'}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          {title || (lang === 'it' ? 'Titolo non impostato' : lang === 'es' ? 'Título no establecido' : 'Title not set')}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {cover_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 bg-gray-100">
            <Image
              src={cover_image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <BlogEditor
          content={content}
          editable={false}
          className="min-h-0"
        />
      </div>
    </article>
  );
}

