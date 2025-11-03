'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Button, LoadingSkeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';
import { getCurrentUser } from '@/lib/auth';
import { logError } from '@/lib/logger';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [userData, setUserData] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const { canManagePosts, isAdmin, loading: roleLoading } = useRole();
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    const loadUser = async () => {
      const { lang } = await params;
      const validLang = lang === 'it' ? 'it' : 'en';
      setLang(validLang);

      if (!user) {
        router.push(`/${validLang}/login`);
        return;
      }

      try {
        // Get current user data
        const currentUser = await getCurrentUser();
        setUserData(currentUser);

        // Redirect regular users to profile page (they only have access to profile)
        if (currentUser && !currentUser.role) {
          router.push(`/${validLang}/dashboard/profile`);
          return;
        }
        if (currentUser && currentUser.role === 'user') {
          router.push(`/${validLang}/dashboard/profile`);
          return;
        }
      } catch (error) {
        logError('Error loading user:', error, { lang: validLang });
        router.push(`/${validLang}/login`);
      }
    };

    if (!authLoading) {
      loadUser();
    }
  }, [params, router, user, authLoading]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push(`/${lang}/login`);
      router.refresh();
    } catch (error) {
      logError('Error signing out:', error, { lang });
      // Still redirect even if signOut fails
      router.push(`/${lang}/login`);
    }
  };

  if (authLoading || roleLoading || !user || !userData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-6">
          <LoadingSkeleton variant="text" width="200px" height="32px" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" height="150px" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">{t.dashboard.title}</h1>
          <div className="flex items-center gap-3">
            <p className="text-gray-600">{t.dashboard.welcomeBack}, {userData.name || userData.email}</p>
            {userData.role && (
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                userData.role === 'admin'
                  ? 'bg-red-100 text-red-800'
                  : userData.role === 'editor'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {userData.role.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/${lang}/dashboard/profile`}
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors font-medium"
          >
            {lang === 'it' ? 'Profilo' : 'Profile'}
          </Link>
          <span className="text-sm text-gray-600">{userData.email}</span>
          <Button variant="outline" onClick={handleLogout}>
            {t.dashboard.logout}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">{t.dashboard.totalPosts}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">0</p>
            <p className="text-sm text-gray-500 mt-2">{t.dashboard.postsCreated}</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">{t.dashboard.published}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">0</p>
            <p className="text-sm text-gray-500 mt-2">{t.dashboard.livePosts}</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">{t.dashboard.drafts}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">0</p>
            <p className="text-sm text-gray-500 mt-2">{t.dashboard.unpublishedPosts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t.dashboard.quickActions}</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {canManagePosts() && (
              <>
                <Link href={`/${lang}/dashboard/new-post`}>
                  <Button variant="primary" size="lg">
                    {t.dashboard.newPost}
                  </Button>
                </Link>
                <Link href={`/${lang}/dashboard/posts`}>
                  <Button variant="outline" size="lg">
                    {lang === 'it' ? 'Gestisci Post' : 'Manage Posts'}
                  </Button>
                </Link>
                <Link href={`/${lang}/dashboard/media`}>
                  <Button variant="outline" size="lg">
                    {lang === 'it' ? 'Libreria Media' : 'Media Library'}
                  </Button>
                </Link>
                <Link href={`/${lang}/dashboard/tags`}>
                  <Button variant="outline" size="lg">
                    {lang === 'it' ? 'Gestione Tag' : 'Manage Tags'}
                  </Button>
                </Link>
              </>
            )}
            {isAdmin() && (
              <Link href={`/${lang}/dashboard/analytics`}>
                <Button variant="outline" size="lg">
                  {lang === 'it' ? 'Analisi' : 'Analytics'}
                </Button>
              </Link>
            )}
          </div>
          {!canManagePosts() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                {lang === 'it'
                  ? 'Non hai i permessi per gestire i post. Contatta un amministratore per ottenere i permessi di editor.'
                  : 'You don\'t have permission to manage posts. Contact an administrator to get editor permissions.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t.dashboard.recentPosts}</h2>
            <Link href={`/${lang}/dashboard/posts`}>
              <Button variant="outline" size="sm">
                {lang === 'it' ? 'Vedi tutti' : 'View All'}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">{t.dashboard.noPostsYet}</p>
            <Link href={`/${lang}/dashboard/new-post`}>
              <Button variant="primary">{t.dashboard.createFirstPost}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

