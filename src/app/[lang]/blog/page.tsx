import type { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const validLang = lang === 'it' ? 'it' : 'en';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

  return {
    title: 'Blog | StackMoneyUp',
    description: validLang === 'it'
      ? 'Esplora i nostri articoli su finanza personale, investimenti e crescita finanziaria'
      : 'Explore our articles on personal finance, investing, and financial growth',
    keywords: validLang === 'it'
      ? 'blog finanza personale, articoli investimenti, risparmio, budget, educazione finanziaria'
      : 'personal finance blog, investment articles, savings, budgeting, financial education',
    openGraph: {
      title: 'Blog | StackMoneyUp',
      description: validLang === 'it'
        ? 'Esplora i nostri articoli su finanza personale, investimenti e crescita finanziaria'
        : 'Explore our articles on personal finance, investing, and financial growth',
      url: `${siteUrl}/${validLang}/blog`,
      siteName: 'StackMoneyUp',
      type: 'website',
      locale: validLang === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: validLang === 'it' ? 'en_US' : 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | StackMoneyUp',
      description: validLang === 'it'
        ? 'Esplora i nostri articoli su finanza personale, investimenti e crescita finanziaria'
        : 'Explore our articles on personal finance, investing, and financial growth',
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}/blog`,
      languages: {
        en: `${siteUrl}/en/blog`,
        it: `${siteUrl}/it/blog`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  return <BlogPageClient params={params} />;
}
