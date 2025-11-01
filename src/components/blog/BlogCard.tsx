import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui';
import { formatDate, calculateReadTime } from '@/lib/utils';
import { getTranslations } from '@/lib/translations';
import type { BlogPostSummary, Language } from '@/types/blog';

interface BlogCardProps {
  post: BlogPostSummary;
  lang: Language;
}

export default function BlogCard({ post, lang }: BlogCardProps) {
  const t = getTranslations(lang);
  const title = post.title[lang] || post.title.en;
  const excerpt = post.excerpt[lang] || post.excerpt.en;
  const formattedDate = post.published_at 
    ? formatDate(post.published_at, lang === 'it' ? 'it-IT' : 'en-US')
    : formatDate(new Date().toISOString(), lang === 'it' ? 'it-IT' : 'en-US');
  
  const readTime = post.read_time || 5; // Default 5 min if not set

  return (
    <Link href={`/${lang}/blog/${post.slug}`}>
      <article className="group h-full flex flex-col rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            <Image
              src={post.cover_image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-6">
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
            <Badge variant="success" size="sm">
              {t.categories[post.category]?.[lang] || post.category}
            </Badge>
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{readTime} {lang === 'it' ? 'min lettura' : 'min read'}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
            {excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Read More */}
          <div className="flex items-center gap-2 text-emerald-600 font-semibold mt-auto">
            <span>{t.blog.readMore}</span>
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

