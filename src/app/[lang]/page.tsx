import type { Metadata } from 'next';
import { isValidLanguage, getDefaultLanguage } from "@/lib/translations";
import type { Language } from "@/types/blog";
// import Image from "next/image"; // Reserved for future use
import HomePageClient from "./HomePageClient";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  // Translations used directly in metadata
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

  return {
    title: validLang === 'it'
      ? 'StackMoneyUp - Crescita Finanziaria Personale'
      : 'StackMoneyUp - Personal Finance Growth',
    description: validLang === 'it'
      ? 'Niente cazzate. Niente promesse di soldi facili. Solo strategie reali per costruire ricchezza.'
      : 'No bullshit. No easy money promises. Just real strategies for building wealth.',
    openGraph: {
      title: validLang === 'it'
        ? 'StackMoneyUp - Crescita Finanziaria Personale'
        : 'StackMoneyUp - Personal Finance Growth',
      description: validLang === 'it'
        ? 'Niente cazzate. Niente promesse di soldi facili. Solo strategie reali per costruire ricchezza.'
        : 'No bullshit. No easy money promises. Just real strategies for building wealth.',
      url: `${siteUrl}/${validLang}`,
      siteName: 'StackMoneyUp',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`, // TODO: Add actual OG image
          width: 1200,
          height: 630,
          alt: 'StackMoneyUp',
        },
      ],
      locale: validLang === 'it' ? 'it_IT' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: validLang === 'it'
        ? 'StackMoneyUp - Crescita Finanziaria Personale'
        : 'StackMoneyUp - Personal Finance Growth',
      description: validLang === 'it'
        ? 'Niente cazzate. Niente promesse di soldi facili. Solo strategie reali per costruire ricchezza.'
        : 'No bullshit. No easy money promises. Just real strategies for building wealth.',
      images: [`${siteUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}`,
      languages: {
        en: `${siteUrl}/en`,
        it: `${siteUrl}/it`,
      },
    },
    keywords: validLang === 'it'
      ? ['finanza personale', 'investimenti', 'risparmio', 'budget', 'educazione finanziaria']
      : ['personal finance', 'investing', 'savings', 'budgeting', 'financial education'],
  };
}

export default async function HomePage({ params }: HomePageProps) {
  return <HomePageClient params={params} />;
}
