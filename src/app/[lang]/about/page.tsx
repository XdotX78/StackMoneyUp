import type { Metadata } from 'next';
import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';
import AboutPageClient from './AboutPageClient';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

  return {
    title: `${t.about.title} | StackMoneyUp`,
    description: `${t.about.text1} ${t.about.text2}`,
    openGraph: {
      title: `${t.about.title} | StackMoneyUp`,
      description: `${t.about.text1} ${t.about.text2}`,
      url: `${siteUrl}/${validLang}/about`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}/about`,
      languages: {
        en: `${siteUrl}/en/about`,
        it: `${siteUrl}/it/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  return <AboutPageClient params={params} />;
}
