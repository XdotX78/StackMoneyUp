import Link from 'next/link';
import { getTranslations, isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface SitemapPageProps {
  params: Promise<{ lang: string }>;
}

export default async function SitemapPage({ params }: SitemapPageProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);

  const pages = [
    { name: t.nav.home, href: `/${validLang}` },
    { name: t.nav.blog, href: `/${validLang}/blog` },
    { name: t.nav.about, href: `/${validLang}/about` },
    { name: validLang === 'it' ? 'Contatti' : 'Contact', href: `/${validLang}/contact` },
    { name: t.footer.privacy, href: `/${validLang}/privacy` },
    { name: t.footer.terms, href: `/${validLang}/terms` },
    { name: t.footer.sitemap, href: `/${validLang}/sitemap` },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl lg:text-6xl font-black mb-8">
        {t.footer.sitemap}
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6">
            {validLang === 'it' ? 'Pagine Principali' : 'Main Pages'}
          </h2>
          <ul className="space-y-3">
            {pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg"
                >
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">
            {validLang === 'it' ? 'Categorie Blog' : 'Blog Categories'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Investing', 'Saving & Emergency Fund', 'Budgeting & Spending', 'Debt & Loans', 'Income & Earning More', 'Money Mindset'].map((category) => (
              <li key={category}>
                <Link
                  href={`/${validLang}/blog?category=${category}`}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  {getCategoryTranslation(category, validLang)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

