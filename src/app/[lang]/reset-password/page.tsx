'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button } from '@/components/ui';
import { updatePasswordWithToken } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface ResetPasswordPageProps {
  params: Promise<{ lang: string }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    const loadLang = async () => {
      const { lang } = await params;
      const validLang = lang === 'it' ? 'it' : 'en';
      setLang(validLang);

      // Check if we have a valid token in the URL
      // Supabase sets hash fragments with access_token and type=recovery
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.substring(1)); // Remove the '#' and parse
        
        const accessToken = hashParams.get('access_token');
        const tokenType = hashParams.get('type');
        
        if (accessToken && tokenType === 'recovery') {
          // Set the session with the recovery token
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });
          
          if (sessionError) {
            setTokenValid(false);
            setError(t.passwordReset.invalidTokenMessage);
          } else {
            setTokenValid(true);
            // Clear the hash from URL
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          // Check if user is already authenticated (might have been set by previous step)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setTokenValid(true);
          } else {
            setTokenValid(false);
          }
        }
      }
    };
    loadLang();
  }, [params, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError(lang === 'it' ? 'Le password non corrispondono' : 'Passwords do not match');
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError(lang === 'it' ? 'La password deve essere di almeno 6 caratteri' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await updatePasswordWithToken(newPassword);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" 
        style={{ 
          marginTop: 0,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
        }}
      >
        <div className="w-full max-w-md relative z-10 px-4">
          <div 
            className="bg-white rounded-2xl p-8 sm:p-10 border-2 shadow-2xl"
            style={{ 
              borderColor: 'var(--green-primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 255, 0, 0.1)'
            }}
          >
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-black mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {t.passwordReset.invalidToken}
                </h1>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {t.passwordReset.invalidTokenMessage}
              </p>
              <Link href={`/${lang}/forgot-password`}>
                <Button variant="primary" size="lg" className="w-full">
                  {t.passwordReset.backToLogin}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                {t.passwordReset.resetPasswordTitle}
              </h1>
              <div className="w-16 h-1 mx-auto mt-3" style={{ backgroundColor: 'var(--green-primary)' }} />
            </div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              {t.passwordReset.resetPasswordSubtitle}
            </p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="px-4 py-3 rounded-lg bg-green-50 border-2 border-green-300 text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{t.passwordReset.passwordUpdated}</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {t.passwordReset.passwordUpdatedMessage}
              </p>
              <p className="text-xs text-gray-500 text-center">
                {lang === 'it' ? 'Reindirizzamento al login...' : 'Redirecting to login...'}
              </p>
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
                  {t.passwordReset.newPasswordLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t.passwordReset.newPasswordPlaceholder}
                    required
                    disabled={loading}
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.passwordReset.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t.passwordReset.confirmPasswordPlaceholder}
                    required
                    disabled={loading}
                    minLength={6}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-600">
                    {lang === 'it' ? 'Le password non corrispondono' : 'Passwords do not match'}
                  </p>
                )}
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
                {loading ? t.passwordReset.updatingPassword : t.passwordReset.updatePassword}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

