import Link from 'next/link';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import AuthButton from './AuthButton';

interface HeaderProps {
  lang: Language;
}

interface NavItem {
  label: {
    en: string;
    it: string;
  };
  href: string;
}

const navItems: NavItem[] = [
  {
    label: { en: 'Home', it: 'Home' },
    href: '/',
  },
  {
    label: { en: 'Blog', it: 'Blog' },
    href: '/blog',
  },
  {
    label: { en: 'About', it: 'Chi Siamo' },
    href: '/about',
  },
  {
    label: { en: 'Invest', it: 'Investire' },
    href: '/blog',
  },
];

export default function Header({ lang }: HeaderProps) {
  const t = getTranslations(lang);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
      <nav className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between py-4 sm:py-6">
          {/* Logo - Text Only */}
          <Link href={`/${lang}`} className="flex items-center flex-shrink-0 min-w-0">
            <span className="text-base sm:text-lg font-bold text-white truncate max-w-[200px] sm:max-w-none">
              StackMoneyUp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={item.label.en}
                href={`/${lang}${item.href}`}
                className={`font-medium transition-colors text-sm ${
                  index === 0 
                    ? 'hover:opacity-80' 
                    : 'text-white hover:opacity-80'
                }`}
                style={index === 0 ? { color: 'var(--green-primary)' } : {}}
              >
                {item.label[lang]}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <LanguageSwitcher currentLang={lang} />
            
            {/* Auth Button (Login / Dashboard) */}
            <AuthButton lang={lang} />
            
            {/* Contact Button */}
            <Link
              href={`/${lang}#contact`}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all text-sm"
              style={{ color: '#000000' }}
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu lang={lang} navItems={navItems} />
        </div>
      </nav>
    </header>
  );
}
