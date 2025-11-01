import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { formatDate } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';
import BlogEditor from '@/components/blog/BlogEditor';
import type { Language } from '@/types/blog';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  
  // Find post by slug
  const post = mockPosts.find(p => p.slug === slug);
  
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

// Mock blog posts data (same as blog listing page - replace with Supabase)
const mockPosts = [
  {
    id: '1',
    slug: 'compound-effect-investing',
    title: {
      en: 'The Compound Effect of Consistent Investing',
      it: "L'Effetto Composto degli Investimenti Costanti",
    },
    excerpt: {
      en: 'Why investing $100 monthly beats trying to time the market with $10,000 once.',
      it: 'Perché investire 100€ mensili batte il tentativo di cronometrare il mercato.',
    },
    content: {
      en: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'When it comes to building wealth, consistency trumps timing every single time.' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Most people wait for the "perfect moment" to invest - saving up $10,000, researching the best stocks, trying to time the market just right. But here\'s the reality: that perfect moment never comes.' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'The compound effect of investing $100 monthly over 20 years will almost always outperform a single $10,000 investment, even if you time it "perfectly".' }]
          }
        ]
      }),
      it: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Quando si tratta di costruire ricchezza, la costanza batte sempre il tempismo.' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'La maggior parte delle persone aspetta il "momento perfetto" per investire, ma la realtà è che quel momento perfetto non arriva mai.' }]
          }
        ]
      }),
    },
    cover_image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    category: 'Investing',
    tags: ['investing', 'compound-interest', 'long-term'],
    read_time: 5,
    published_at: '2024-12-15T10:00:00Z',
    published: true,
  },
  {
    id: '2',
    slug: '50-30-20-rule',
    title: {
      en: 'The 50/30/20 Rule Isn\'t Perfect',
      it: 'La Regola 50/30/20 Non È Perfetta',
    },
    excerpt: {
      en: 'Why the popular budgeting rule fails for most people and what to do instead.',
      it: 'Perché la popolare regola di budget fallisce per la maggior parte delle persone.',
    },
    content: {
      en: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'The 50/30/20 rule is everywhere in personal finance advice.' }] }
        ]
      }),
      it: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'La regola 50/30/20 è ovunque nei consigli di finanza personale.' }] }
        ]
      }),
    },
    cover_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    category: 'Budgeting & Spending',
    tags: ['budgeting', 'personal-finance', 'tips'],
    read_time: 7,
    published_at: '2024-12-10T10:00:00Z',
    published: true,
  },
  // Add other posts...
];

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);

  // Find post by slug
  const post = mockPosts.find(p => p.slug === slug);

  if (!post || !post.published) {
    notFound();
  }

  const title = post.title[validLang] || post.title.en;
  const content = post.content[validLang] || post.content.en;
  const formattedDate = formatDate(post.published_at, validLang === 'it' ? 'it-IT' : 'en-US');

  return (
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

      {/* Related Posts */}
      <RelatedPosts currentSlug={slug} category={post.category} lang={validLang} />

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
  );
}

// Related Posts Component
function RelatedPosts({ currentSlug, category, lang }: { currentSlug: string; category: string; lang: Language }) {
  // Get posts from same category, excluding current post
  const relatedPosts = mockPosts
    .filter(p => p.category === category && p.slug !== currentSlug && p.published)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-6">
        {lang === 'it' ? 'Articoli Correlati' : 'Related Articles'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
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

