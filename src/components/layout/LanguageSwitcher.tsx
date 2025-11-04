'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Language } from '@/types/blog';
import { useState } from 'react';

interface LanguageSwitcherProps {
  currentLang: Language;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Get the path without the language prefix
  const pathWithoutLang = pathname?.replace(/^\/(en|it)/, '') || '';

  const toggleLanguage = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        aria-label="Change language"
      >
        <span className="text-xl">🌐</span>
        <span className="font-medium uppercase">{currentLang}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden z-50">
            <Link
              href={`/en${pathWithoutLang}`}
              onClick={toggleLanguage}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                currentLang === 'en' ? 'bg-gray-800 text-emerald-500' : 'text-gray-300'
              }`}
            >
              <span className="text-2xl">🇺🇸</span>
              <span className="font-medium">English</span>
            </Link>
            <Link
              href={`/it${pathWithoutLang}`}
              onClick={toggleLanguage}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors ${
                currentLang === 'it' ? 'bg-gray-800 text-emerald-500' : 'text-gray-300'
              }`}
            >
              <span className="text-2xl">🇮🇹</span>
              <span className="font-medium">Italiano</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
