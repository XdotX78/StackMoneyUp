'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button } from '@/components/ui';
import { signIn, signUp, signInWithGoogle, isAuthenticated, type User } from '@/lib/auth';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface LoginPageProps {
  params: Promise<{ lang: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    const checkAuth = async () => {
      const { lang } = await params;
      const validLang = lang === 'it' ? 'it' : 'en';
      setLang(validLang);
      
      // If already authenticated, redirect to dashboard
      const authenticated = await isAuthenticated();
      if (authenticated) {
        router.push(`/${validLang}/dashboard`);
      }
    };
    checkAuth();
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password confirmation for signup
    if (isSignUp && password !== confirmPassword) {
      setError(t.login.passwordsDontMatch);
      return;
    }

    // Validate password length
    if (isSignUp && password.length < 6) {
      setError(lang === 'it' ? 'La password deve essere di almeno 6 caratteri' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        // Check if email confirmation is required
        // Supabase returns session as null if email confirmation is required
        if (result && result.session) {
          // User is immediately logged in (email confirmation disabled)
          router.push(`/${lang}/dashboard`);
        } else {
          // Email confirmation required
          setLoading(false);
          // Show success message with email confirmation info (using success styling)
          const successMessage = lang === 'it' 
            ? 'Registrazione completata! Controlla la tua email per confermare il tuo account.'
            : 'Registration successful! Please check your email to confirm your account.';
          setError(`✅ ${successMessage}`);
          // Switch back to login mode after a delay
          setTimeout(() => {
            setIsSignUp(false);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
          }, 8000);
        }
      } else {
        try {
          await signIn(email, password);
          // Redirect to dashboard after successful login
          router.push(`/${lang}/dashboard`);
        } catch (signInError: any) {
          // Handle specific "Email not confirmed" error - check for various Supabase error formats
          const errorMessage = signInError?.message?.toLowerCase() || '';
          const errorCode = signInError?.code || '';
          
          // Check for email confirmation errors
          if (
            errorMessage.includes('email not confirmed') ||
            errorMessage.includes('email_not_confirmed') ||
            errorMessage.includes('email needs to be confirmed') ||
            errorMessage.includes('verify your email') ||
            errorMessage.includes('verify your account') ||
            errorCode === 'email_not_confirmed'
          ) {
            setError(t.login.emailNotConfirmed);
          } else {
            setError(signInError instanceof Error ? signInError.message : t.login.loginFailed);
          }
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.loginFailed);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle(lang);
      // The redirect will be handled by Supabase OAuth callback
      // User will be redirected to Google, then back to /auth/callback
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed. Please try again.');
      setGoogleLoading(false);
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
                {t.login.title}
              </h1>
              <div className="w-16 h-1 mx-auto mt-3" style={{ backgroundColor: 'var(--green-primary)' }} />
            </div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              {isSignUp ? (lang === 'it' ? 'Crea un nuovo account' : 'Create a new account') : t.login.subtitle}
            </p>
          </div>

          {/* Google Sign In/Sign Up Button */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleGoogleAuth}
            disabled={loading || googleLoading}
            className="w-full font-semibold text-base py-3 mb-6 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-3"
            isLoading={googleLoading}
          >
            {!googleLoading && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isSignUp ? t.login.signUpWithGoogle : t.login.signInWithGoogle}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {lang === 'it' ? 'oppure' : 'or'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in-0 ${
                error.startsWith('✅')
                  ? 'bg-green-50 border-2 border-green-300 text-green-700'
                  : 'bg-red-50 border-2 border-red-300 text-red-700'
              }`}>
                {error.startsWith('✅') ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t.login.emailLabel}
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
                  placeholder={t.login.emailPlaceholder}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t.login.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
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

            {/* Password Confirmation Field (only for signup) */}
            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {t.login.confirmPasswordLabel}
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
                    placeholder={t.login.confirmPasswordPlaceholder}
                    required={isSignUp}
                    disabled={loading}
                    minLength={6}
                    className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      confirmPassword && password !== confirmPassword
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
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-600">{t.login.passwordsDontMatch}</p>
                )}
              </div>
            )}

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
              disabled={loading || googleLoading}
            >
              {loading 
                ? (isSignUp 
                    ? (lang === 'it' ? 'Registrazione in corso...' : 'Signing up...')
                    : t.login.signingIn
                  )
                : (isSignUp ? t.login.signUp : t.login.signIn)
              }
            </Button>
          </form>

          {/* Forgot Password Link (only show when signing in, not signing up) */}
          {!isSignUp && (
            <div className="mt-4 text-right">
              <Link
                href={`/${lang}/forgot-password`}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                {t.login.forgotPassword}
              </Link>
            </div>
          )}

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {isSignUp ? t.login.alreadyHaveAccount : t.login.dontHaveAccount}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{t.login.mockAuthNote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

