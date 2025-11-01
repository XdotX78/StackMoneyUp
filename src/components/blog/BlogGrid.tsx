import BlogCard from './BlogCard';
import type { BlogPostSummary, Language } from '@/types/blog';
import { Card, CardContent } from '@/components/ui';
import { getTranslations } from '@/lib/translations';

interface BlogGridProps {
  posts: BlogPostSummary[];
  lang: Language;
}

export default function BlogGrid({ posts, lang }: BlogGridProps) {
  const t = getTranslations(lang);
  
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.blogPage.noPostsFound}</h3>
          <p className="text-gray-600">{t.blogPage.noPostsFoundSubtitle}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} lang={lang} />
      ))}
    </div>
  );
}

