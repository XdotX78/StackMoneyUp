'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { isAuthenticated, getCurrentUser, signOut } from '@/lib/auth';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    params.then(({ lang }) => {
      const validLang = lang === 'it' ? 'it' : 'en';
      setLang(validLang);

      // Check authentication
      if (!isAuthenticated()) {
        router.push(`/${validLang}/login`);
        return;
      }

      // Get current user
      setUser(getCurrentUser());
    });
  }, [params, router]);

  const handleLogout = () => {
    signOut();
    router.push(`/${lang}/login`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t.dashboard.loading}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">{t.dashboard.title}</h1>
          <p className="text-gray-600">{t.dashboard.welcomeBack}, {user.name || user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
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
          </div>
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

