'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Language } from '@/types/blog';

interface NavItem {
  label: {
    en: string;
    it: string;
  };
  href: string;
}

interface MobileMenuProps {
  lang: Language;
  navItems: NavItem[];
}

export default function MobileMenu({ lang, navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="text-white p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          // X icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMenu}
          />

          {/* Menu Content */}
          <div className="fixed top-16 left-0 right-0 bg-black border-b border-gray-800 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${lang}${item.href}`}
                  onClick={toggleMenu}
                  className="text-gray-300 hover:text-white font-medium text-lg py-2 transition-colors"
                >
                  {item.label[lang]}
                </Link>
              ))}

              {/* Language Switcher Mobile */}
              <div className="flex gap-4 pt-4 border-t border-gray-800">
                <Link
                  href={`/en`}
                  onClick={toggleMenu}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    lang === 'en' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>EN</span>
                </Link>
                <Link
                  href={`/it`}
                  onClick={toggleMenu}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    lang === 'it' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <span>🇮🇹</span>
                  <span>IT</span>
                </Link>
              </div>

              {/* Contact Button Mobile */}
              <Link
                href={`/${lang}#contact`}
                onClick={toggleMenu}
                className="bg-emerald-600 text-white px-6 py-3 rounded-md font-semibold text-center hover:bg-emerald-700 transition-colors mt-2"
              >
                Contact
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
