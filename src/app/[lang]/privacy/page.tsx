import type { Metadata } from 'next';
import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';
import PrivacyPageClient from './PrivacyPageClient';

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

  return {
    title: `${t.footer.privacy} Policy | StackMoneyUp`,
    description: validLang === 'it'
      ? 'La nostra politica sulla privacy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali.'
      : 'Our privacy policy explains how we collect, use, and protect your personal information.',
    openGraph: {
      title: `${t.footer.privacy} Policy | StackMoneyUp`,
      description: validLang === 'it'
        ? 'La nostra politica sulla privacy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali.'
        : 'Our privacy policy explains how we collect, use, and protect your personal information.',
      url: `${siteUrl}/${validLang}/privacy`,
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}/privacy`,
      languages: {
        en: `${siteUrl}/en/privacy`,
        it: `${siteUrl}/it/privacy`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  return <PrivacyPageClient params={params} />;
}

