import { getTranslations } from "@/lib/translations";
import type { Language } from "@/types/blog";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const t = getTranslations(lang);

  return (
    <footer className="bg-black text-white py-20 lg:py-24 border-t border-gray-800">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        {/* Four Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">StackMoneyUp</h2>
            <p className="text-gray-500 text-sm">{t.footer.copyright}</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              {lang === 'it' 
                ? 'Strategie reali per costruire ricchezza. Niente fesserie. Nessuna promessa di soldi facili.'
                : 'Real strategies for building wealth. No bullshit. No easy money promises.'
              }
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-white">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <a href={`/${lang}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.home}
                </a>
              </li>
              <li>
                <a href={`/${lang}/about`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.about}
                </a>
              </li>
              <li>
                <a href={`/${lang}/blog`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.invest}
                </a>
              </li>
              <li>
                <a href={`/${lang}/blog`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.blog}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore More */}
          <div>
            <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-white">{t.footer.exploreMore}</h3>
            <ul className="space-y-3">
              <li>
                <a href={`/${lang}#contact`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.contact}
                </a>
              </li>
              <li>
                <a href={`/${lang}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href={`/${lang}/terms`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a href={`/${lang}/sitemap`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.sitemap}
                </a>
              </li>
              <li>
                <a href={`/${lang}/rss?lang=${lang}`} className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                  </svg>
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect With Us */}
          <div>
            <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-white">{t.footer.connectWithUs}</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.twitter}
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.facebook}
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.instagram}
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t.footer.linkedin}
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500 text-sm">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
