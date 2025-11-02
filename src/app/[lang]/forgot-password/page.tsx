'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button } from '@/components/ui';
import { resetPassword } from '@/lib/auth';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface ForgotPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    const loadLang = async () => {
      const { lang } = await params;
      const validLang = lang === 'it' ? 'it' : 'en';
      setLang(validLang);
    };
    loadLang();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email, lang);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" 
      style={{ 
        marginTop: 0,
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'var(--green-primary)' }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'var(--green-primary)' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <div 
          className="bg-white rounded-2xl p-8 sm:p-10 border-2 shadow-2xl"
          style={{ 
            borderColor: 'var(--green-primary)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 255, 0, 0.1)'
          }}
        >
          <div className="text-center mb-10">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent break-words">
                {t.passwordReset.forgotPasswordTitle}
              </h1>
              <div className="w-16 h-1 mx-auto mt-3" style={{ backgroundColor: 'var(--green-primary)' }} />
            </div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              {t.passwordReset.forgotPasswordSubtitle}
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="px-4 py-3 rounded-lg bg-green-50 border-2 border-green-300 text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{t.passwordReset.resetLinkSent}</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {t.passwordReset.resetLinkSentMessage}
              </p>
              <Link href={`/${lang}/login`}>
                <Button variant="primary" size="lg" className="w-full">
                  {t.passwordReset.backToLogin}
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border-2 border-red-300 text-red-700 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.passwordReset.emailLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.passwordReset.emailPlaceholder}
                    required
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, var(--green-primary) 0%, #00cc00 100%)',
                  boxShadow: loading ? 'none' : '0 10px 25px rgba(0, 255, 0, 0.3)'
                }}
                isLoading={loading}
                disabled={loading}
              >
                {loading ? t.passwordReset.sendingResetLink : t.passwordReset.sendResetLink}
              </Button>

              <div className="text-center">
                <Link
                  href={`/${lang}/login`}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  {t.passwordReset.backToLogin}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

