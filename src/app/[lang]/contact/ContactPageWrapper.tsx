import type { Metadata } from 'next';
import { isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';
import ContactPageClient from './ContactPageClient';

interface ContactPageWrapperProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContactPageWrapperProps): Promise<Metadata> {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';

  return {
    title: validLang === 'it' ? 'Contatti | StackMoneyUp' : 'Contact | StackMoneyUp',
    description: validLang === 'it'
      ? 'Hai domande o suggerimenti? Saremmo felici di sentirti. Contattaci tramite il form.'
      : 'Have questions or suggestions? We\'d love to hear from you. Contact us via the form.',
    openGraph: {
      title: validLang === 'it' ? 'Contatti | StackMoneyUp' : 'Contact | StackMoneyUp',
      description: validLang === 'it'
        ? 'Hai domande o suggerimenti? Saremmo felici di sentirti. Contattaci tramite il form.'
        : 'Have questions or suggestions? We\'d love to hear from you. Contact us via the form.',
      url: `${siteUrl}/${validLang}/contact`,
      type: 'website',
      locale: validLang === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: validLang === 'it' ? 'en_US' : 'it_IT',
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}/contact`,
      languages: {
        en: `${siteUrl}/en/contact`,
        it: `${siteUrl}/it/contact`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ContactPageWrapper({ params }: ContactPageWrapperProps) {
  return <ContactPageClient params={params} />;
}

