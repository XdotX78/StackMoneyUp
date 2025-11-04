import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { getPostBySlug, incrementPostViews } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';
import BlogEditor from '@/components/blog/BlogEditor';
import CommentsSection from '@/components/blog/CommentsSection';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import ShareButtonsClient from './ShareButtonsClient';
import type { Language } from '@/types/blog';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  
  // Fetch post from Supabase
  const post = await getPostBySlug(slug);
  
  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  const title = post.title[validLang] || post.title.en;
  const excerpt = post.excerpt[validLang] || post.excerpt.en;
  const ogImage = post.cover_image || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';
  const postUrl = `${siteUrl}/${validLang}/blog/${slug}`;

  return {
    title: `${title} | StackMoneyUp`,
    description: excerpt,
    keywords: post.tags?.join(', ') || '',
    openGraph: {
      title: title,
      description: excerpt,
      url: postUrl,
      siteName: 'StackMoneyUp',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: post.published_at,
      authors: ['StackMoneyUp'],
      locale: validLang === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: validLang === 'it' ? 'en_US' : 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
      languages: {
        en: `${siteUrl}/en/blog/${slug}`,
        it: `${siteUrl}/it/blog/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();

  // Fetch post from Supabase
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Increment views (async, don't wait for it)
  incrementPostViews(slug).catch(err => console.error('Error incrementing views:', err));

  const title = post.title[validLang] || post.title.en;
  const excerpt = post.excerpt[validLang] || post.excerpt.en;
  const content = post.content[validLang] || post.content.en;
  const formattedDate = post.published_at 
    ? formatDate(post.published_at, validLang === 'it' ? 'it-IT' : 'en-US')
    : formatDate(new Date(), validLang === 'it' ? 'it-IT' : 'en-US');

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: post.cover_image || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com'}/og-image.jpg`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'StackMoneyUp',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'StackMoneyUp',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com'}/${validLang}/blog/${slug}`,
    },
    keywords: post.tags?.join(', ') || post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back Button */}
      <Link 
        href={`/${validLang}/blog`}
        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-semibold"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {validLang === 'it' ? 'Torna al Blog' : 'Back to Blog'}
      </Link>

      {/* Header */}
      <header className="mb-8">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <Badge variant="success" size="sm">
            {getCategoryTranslation(post.category, validLang)}
          </Badge>
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{post.read_time} {validLang === 'it' ? 'min lettura' : 'min read'}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          {title}
        </h1>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 bg-gray-100">
            <Image
              src={post.cover_image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              priority
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

      {/* Share Buttons */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="text-sm font-semibold text-gray-700">
            {validLang === 'it' ? 'Condividi:' : 'Share:'}
          </span>
          <ShareButtonsClient 
            title={title}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com'}/${validLang}/blog/${slug}`}
            lang={validLang}
          />
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection postId={post.id} postSlug={slug} lang={validLang} />

      {/* Related Posts */}
      <RelatedPosts currentSlug={slug} category={post.category} tags={post.tags} lang={validLang} />

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Link href={`/${validLang}/blog`}>
            <Button variant="outline">
              {validLang === 'it' ? '← Altri Articoli' : '← More Articles'}
            </Button>
          </Link>
        </div>
      </div>
    </article>
    </>
  );
}

// Related Posts Component
async function RelatedPosts({ currentSlug, category, tags, lang }: { 
  currentSlug: string; 
  category: string; 
  tags?: string[];
  lang: Language;
}) {
  const { getPublishedPosts } = await import('@/lib/blog');
  const allPosts = await getPublishedPosts();
  const currentPostTags = tags || [];

  // Score posts by relevance:
  // - Same category: +2 points
  // - Shared tags: +1 point per tag
  // Then sort by score, then by date
  const scoredPosts = allPosts
    .filter(p => p.slug !== currentSlug)
    .map(post => {
      let score = 0;
      
      // Same category gets priority
      if (post.category === category) {
        score += 2;
      }
      
      // Shared tags add points
      if (currentPostTags.length > 0 && post.tags) {
        const sharedTags = post.tags.filter(tag => currentPostTags.includes(tag));
        score += sharedTags.length;
      }
      
      return { post, score };
    })
    .filter(item => item.score > 0) // Only show posts with at least some relevance
    .sort((a, b) => {
      // Sort by score (highest first)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Then by date (newest first)
      const dateA = a.post.published_at || '';
      const dateB = b.post.published_at || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3)
    .map(item => item.post);

  if (scoredPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-6">
        {lang === 'it' ? 'Articoli Correlati' : 'Related Articles'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoredPosts.map((post) => {
          const title = post.title[lang] || post.title.en;
          const excerpt = post.excerpt[lang] || post.excerpt.en;
          
          return (
            <Link
              key={post.id}
              href={`/${lang}/blog/${post.slug}`}
              className="group block"
            >
              <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {post.cover_image && (
                  <div className="relative w-full h-40 bg-gray-100">
                    <Image
                      src={post.cover_image}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    />
                  </div>
                )}
                <div className="p-4">
                  <Badge variant="success" size="sm" className="mb-2">
                    {getCategoryTranslation(post.category, lang)}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {excerpt}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

