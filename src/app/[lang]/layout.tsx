import type { Metadata } from "next";
import { isValidLanguage, getDefaultLanguage } from "@/lib/translations";
import type { Language } from "@/types/blog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import AuthProviderWrapper from "@/components/providers/AuthProviderWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  
  const titles = {
    en: "StackMoneyUp - Personal Finance Growth",
    it: "StackMoneyUp - Crescita Finanziaria Personale"
  };
  
  const descriptions = {
    en: "No bullshit. No easy money promises. Just real strategies for building wealth.",
    it: "Niente cazzate. Niente promesse di soldi facili. Solo strategie reali per costruire ricchezza."
  };
  
  const validLang = isValidLanguage(lang) ? lang as Language : getDefaultLanguage();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://stackmoneyup.com';
  
  return {
    title: titles[validLang],
    description: descriptions[validLang],
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: titles[validLang],
      description: descriptions[validLang],
      url: `${siteUrl}/${validLang}`,
      siteName: 'StackMoneyUp',
      type: 'website',
      locale: validLang === 'it' ? 'it_IT' : 'en_US',
      alternateLocale: validLang === 'it' ? 'en_US' : 'it_IT',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[validLang],
      description: descriptions[validLang],
    },
    alternates: {
      canonical: `${siteUrl}/${validLang}`,
      languages: {
        en: `${siteUrl}/en`,
        it: `${siteUrl}/it`,
      },
    },
  };
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? lang as Language : getDefaultLanguage();
  
  return (
    <ErrorBoundary>
      <AuthProviderWrapper>
        <Header lang={validLang} />
        <main className="pt-20">
          {children}
        </main>
        <Footer lang={validLang} />
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '2px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '2px solid #10b981',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '2px solid #ef4444',
            },
          },
        }}
      />
      </AuthProviderWrapper>
    </ErrorBoundary>
  );
}
