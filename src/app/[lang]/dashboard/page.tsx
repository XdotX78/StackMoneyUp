'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Button, LoadingSkeleton } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';
import { logError } from '@/lib/logger';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  // Safely unwrap params Promise with React.use()
  const resolvedParams = use(params);
  const paramLang = resolvedParams.lang;
  const validLang = paramLang === 'it' ? 'it' : 'en';
  const router = useRouter();
  const [lang, setLang] = useState<Language>(validLang);
  const { user, loading: authLoading, signOut } = useAuthContext();
  const { canManagePosts, isAdmin, loading: roleLoading } = useRole();
  const redirectingRef = useRef(false);

  useEffect(() => {
    setLang(validLang);
  }, [validLang]);

  const t = getTranslations(lang);

  useEffect(() => {
    if (authLoading) return;
    if (redirectingRef.current) return;

    if (!user) {
      redirectingRef.current = true;
      router.push(`/${validLang}/login`);
    }
  }, [authLoading, user, validLang, router]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      logError('Error signing out:', err);
    }
    router.push(`/${lang}/login`);
  };

  // Show loading only if auth is still loading or user data is being fetched for the first time
  // Don't show loading if we already have userData (prevent flicker on redirects)
  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <LoadingSkeleton variant="text" width="200px" height="32px" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">{t.dashboard.title}</h1>
          <p className="text-gray-600">
            {t.dashboard.welcomeBack}, {(user.user_metadata?.name as string) || user.email || 'User'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${lang}/dashboard/profile`} className="text-sm text-gray-600 hover:text-emerald-600">
            {lang === 'it' ? 'Profilo' : 'Profile'}
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            {t.dashboard.logout}
          </Button>
        </div>
      </div>

      {/* ✅ Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t.dashboard.quickActions}</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Always render Links to prevent unmount/remount during role loading */}
            {/* Disable/hide based on permissions while keeping DOM stable */}
            <Link
              href={`/${lang}/dashboard/new-post`}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${roleLoading || !canManagePosts()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              aria-disabled={roleLoading || !canManagePosts()}
            >
              {t.dashboard.newPost}
            </Link>
            <Link
              href={`/${lang}/dashboard/posts`}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${roleLoading || !canManagePosts()
                ? 'border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              aria-disabled={roleLoading || !canManagePosts()}
            >
              {lang === 'it' ? 'Gestisci Post' : 'Manage Posts'}
            </Link>
            <Link
              href={`/${lang}/dashboard/media`}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${roleLoading || !canManagePosts()
                ? 'border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              aria-disabled={roleLoading || !canManagePosts()}
            >
              {lang === 'it' ? 'Libreria Media' : 'Media Library'}
            </Link>
            <Link
              href={`/${lang}/dashboard/tags`}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${roleLoading || !canManagePosts()
                ? 'border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              aria-disabled={roleLoading || !canManagePosts()}
            >
              {lang === 'it' ? 'Gestione Tag' : 'Manage Tags'}
            </Link>
            <Link
              href={`/${lang}/dashboard/analytics`}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${roleLoading || !isAdmin()
                ? 'border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              aria-disabled={roleLoading || !isAdmin()}
            >
              {lang === 'it' ? 'Analisi' : 'Analytics'}
            </Link>
            <Link
              href={`/${lang}/dashboard/users`}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${roleLoading || !isAdmin()
                ? 'border-2 border-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                }`}
              aria-disabled={roleLoading || !isAdmin()}
            >
              {lang === 'it' ? 'Gestione Utenti' : 'User Management'}
            </Link>
          </div>

          {/* Show message if user doesn't have permissions (only after role is loaded) */}
          {!roleLoading && !canManagePosts() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                {lang === 'it'
                  ? 'Non hai i permessi per gestire i post. Contatta un amministratore per ottenere i permessi di editor.'
                  : "You don't have permission to manage posts. Contact an administrator to get editor permissions."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
