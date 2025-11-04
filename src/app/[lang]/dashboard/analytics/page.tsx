'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Button, Badge, Input, LoadingSkeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { formatDate } from '@/lib/utils';
import type { Language } from '@/types/blog';

interface AnalyticsPageProps {
  params: Promise<{ lang: string }>;
}

// Mock analytics data (replace with Supabase when ready)
const mockPostsWithAnalytics = [
  {
    id: '1',
    slug: 'compound-effect-investing',
    title: {
      en: 'The Compound Effect of Consistent Investing',
      it: "L'Effetto Composto degli Investimenti Costanti",
    },
    category: 'Investing',
    published: true,
    published_at: '2024-12-15T10:00:00Z',
    views: 1250,
    reads: 890,
    readRate: 71.2,
    avgReadTime: 4.5,
    shares: 45,
  },
  {
    id: '2',
    slug: '50-30-20-rule',
    title: {
      en: 'The 50/30/20 Rule Isn\'t Perfect',
      it: 'La Regola 50/30/20 Non È Perfetta',
    },
    category: 'Budgeting & Spending',
    published: false,
    views: 0,
    reads: 0,
    readRate: 0,
    avgReadTime: 0,
    shares: 0,
  },
  {
    id: '3',
    slug: 'stop-chasing-quick-wins',
    title: {
      en: 'Stop Chasing Quick Wins in Personal Finance',
      it: 'Smetti di Cercare Vittorie Rapide nella Finanza Personale',
    },
    category: 'Money Mindset',
    published: true,
    published_at: '2024-11-20T10:00:00Z',
    views: 2840,
    reads: 2100,
    readRate: 73.9,
    avgReadTime: 6.2,
    shares: 132,
  },
];

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | '7d' | '30d' | '90d'>('30d');
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = useRole();
  const router = useRouter();

  useEffect(() => {
    const loadLang = async () => {
      const { lang: paramLang } = await params;
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);

      if (!authLoading && !user) {
        router.push(`/${validLang}/login`);
        return;
      }

      // Check if user has admin role (analytics is admin-only)
      if (!authLoading && user && !isAdmin()) {
        router.push(`/${validLang}/dashboard`);
      }
    };
    loadLang();
  }, [params, router, user, authLoading, isAdmin]);

  const filteredPosts = mockPostsWithAnalytics.filter(post => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleEn = post.title.en.toLowerCase();
      const titleIt = post.title.it.toLowerCase();
      return titleEn.includes(query) || titleIt.includes(query);
    }
    return true;
  });

  const publishedPosts = filteredPosts.filter(p => p.published);
  const totalViews = publishedPosts.reduce((sum, p) => sum + p.views, 0);
  const totalReads = publishedPosts.reduce((sum, p) => sum + p.reads, 0);
  const avgReadRate = publishedPosts.length > 0
    ? publishedPosts.reduce((sum, p) => sum + p.readRate, 0) / publishedPosts.length
    : 0;
  const totalShares = publishedPosts.reduce((sum, p) => sum + p.shares, 0);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-6">
          <LoadingSkeleton variant="text" width="200px" height="32px" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="card" height="120px" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // const t = getTranslations(lang); // Reserved for future use

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">
            {lang === 'it' ? 'Analisi Post' : 'Post Analytics'}
          </h1>
          <p className="text-gray-600">
            {lang === 'it'
              ? 'Visualizza metriche e statistiche dei tuoi post'
              : 'View metrics and statistics for your posts'
            }
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Visualizzazioni Totali' : 'Total Views'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Tutti i post pubblicati' : 'All published posts'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Letture Totali' : 'Total Reads'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-blue-600">
              {totalReads.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Articoli completati' : 'Articles completed'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Tasso di Lettura' : 'Read Rate'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-purple-600">
              {avgReadRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Media complessiva' : 'Overall average'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Condivisioni' : 'Shares'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-orange-600">
              {totalShares.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Totali' : 'Total'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'it' ? 'Cerca post...' : 'Search posts...'}
              className="w-full"
            />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'all' | '7d' | '30d' | '90d')}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">{lang === 'it' ? 'Tutto il tempo' : 'All time'}</option>
              <option value="7d">{lang === 'it' ? 'Ultimi 7 giorni' : 'Last 7 days'}</option>
              <option value="30d">{lang === 'it' ? 'Ultimi 30 giorni' : 'Last 30 days'}</option>
              <option value="90d">{lang === 'it' ? 'Ultimi 90 giorni' : 'Last 90 days'}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Analytics Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {lang === 'it' ? 'Analisi per Post' : 'Post Analytics'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPosts.filter(p => p.published).length} {lang === 'it' ? 'post pubblicati' : 'published posts'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>
                {searchQuery
                  ? (lang === 'it' ? 'Nessun post trovato' : 'No posts found')
                  : (lang === 'it' ? 'Nessun post disponibile' : 'No posts available')
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Post' : 'Post'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Categoria' : 'Category'}
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Visualizzazioni' : 'Views'}
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Letture' : 'Reads'}
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Tasso' : 'Rate'}
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Condivisioni' : 'Shares'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Azioni' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <Link
                            href={`/${lang}/blog/${post.slug}`}
                            className="font-semibold text-gray-900 hover:text-emerald-600"
                          >
                            {post.title[lang] || post.title.en}
                          </Link>
                          {!post.published && (
                            <Badge variant="default" size="sm" className="ml-2">
                              {lang === 'it' ? 'Bozza' : 'Draft'}
                            </Badge>
                          )}
                        </div>
                        {post.published_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(post.published_at, lang === 'it' ? 'it-IT' : 'en-US')}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success" size="sm">
                          {getCategoryTranslation(post.category, lang)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {post.published ? post.views.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-blue-600">
                        {post.published ? post.reads.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {post.published ? (
                          <span className={`font-semibold ${
                            post.readRate >= 70 ? 'text-green-600' :
                            post.readRate >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {post.readRate.toFixed(1)}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-orange-600">
                        {post.published ? post.shares.toLocaleString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/${lang}/dashboard/edit/${post.slug}`}>
                          <Button variant="outline" size="sm">
                            {lang === 'it' ? 'Modifica' : 'Edit'}
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">
                {lang === 'it' ? 'Nota' : 'Note'}
              </p>
              <p>
                {lang === 'it'
                  ? 'Le analisi mostrate sono dati demo. Quando integrerai Supabase, aggiungi il tracciamento delle visualizzazioni e delle letture.'
                  : 'The analytics shown are demo data. When you integrate Supabase, add view and read tracking.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

