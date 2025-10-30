import type { Metadata } from "next";
import { isValidLanguage, getDefaultLanguage } from "@/lib/translations";
import type { Language } from "@/types/blog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  
  return {
    title: titles[validLang],
    description: descriptions[validLang],
  };
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? lang as Language : getDefaultLanguage();
  
  return (
    <>
      <Header lang={validLang} />
      <main className="pt-20">
        {children}
      </main>
      <Footer lang={validLang} />
    </>
  );
}
