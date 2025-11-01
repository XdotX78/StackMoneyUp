import type { Metadata } from 'next';
import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';
import TermsPageClient from './TermsPageClient';

interface TermsPageProps {
  params: Promise<{ lang: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

  return {
    title: `${t.footer.terms} of Service | StackMoneyUp`,
    description: validLang === 'it'
      ? 'I termini di servizio di StackMoneyUp. Leggi le condizioni d\'uso del nostro sito web.'
      : 'StackMoneyUp terms of service. Read our website usage terms and conditions.',
    openGraph: {
      title: `${t.footer.terms} of Service | StackMoneyUp`,
      description: validLang === 'it'
        ? 'I termini di servizio di StackMoneyUp. Leggi le condizioni d\'uso del nostro sito web.'
        : 'StackMoneyUp terms of service. Read our website usage terms and conditions.',
      url: `${siteUrl}/${validLang}/terms`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}/terms`,
      languages: {
        en: `${siteUrl}/en/terms`,
        it: `${siteUrl}/it/terms`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  return <TermsPageClient params={params} />;
}

