import { getTranslations } from "@/lib/translations";
import type { Language } from "@/types/blog";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-20 lg:py-24 border-t border-gray-800">
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
        {/* Four Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">StackMoneyUp</h2>
            <p className="text-gray-500 text-sm">© {currentYear} StackMoneyUp, Inc.</p>
            <p className="text-gray-500 text-sm">All rights reserved.</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Real strategies for building wealth. No bullshit. No easy money promises.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href={`/${lang}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href={`/${lang}#about`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href={`/${lang}/blog`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Invest
                </a>
              </li>
              <li>
                <a href={`/${lang}/blog`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore More */}
          <div>
            <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-white">Explore More</h3>
            <ul className="space-y-3">
              <li>
                <a href={`/${lang}#contact`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href={`/${lang}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy
                </a>
              </li>
              <li>
                <a href={`/${lang}/terms`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms
                </a>
              </li>
              <li>
                <a href={`/${lang}/sitemap`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect With Us */}
          <div>
            <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-white">Connect With Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} StackMoneyUp, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
