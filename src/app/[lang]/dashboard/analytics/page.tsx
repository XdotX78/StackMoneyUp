'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, Button, Badge, Input, LoadingSkeleton } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { formatDate } from '@/lib/utils';
import { getAllPostsAnalytics, getAnalyticsSummary, type PostAnalytics } from '@/lib/analytics';
import toast from 'react-hot-toast';
import type { Language } from '@/types/blog';

interface AnalyticsPageProps {
  params: Promise<{ lang: string }>;
}

// Helper function to calculate summary from posts data (avoid double fetch)
function calculateSummaryFromPosts(postsData: PostAnalytics[]) {
  const publishedPosts = postsData.filter(p => p.published);
  
  const totalViews = publishedPosts.reduce((sum, p) => sum + p.views, 0);
  const totalReads = publishedPosts.reduce((sum, p) => sum + p.reads, 0);
  const avgReadRate = publishedPosts.length > 0
    ? publishedPosts.reduce((sum, p) => sum + p.readRate, 0) / publishedPosts.length
    : 0;
  const totalShares = publishedPosts.reduce((sum, p) => sum + p.shares, 0);
  const totalBookmarks = publishedPosts.reduce((sum, p) => sum + p.bookmarks, 0);

  const shareBreakdown = publishedPosts.reduce(
    (acc, p) => ({
      twitter: acc.twitter + p.shareBreakdown.twitter,
      facebook: acc.facebook + p.shareBreakdown.facebook,
      linkedin: acc.linkedin + p.shareBreakdown.linkedin,
      copy: acc.copy + p.shareBreakdown.copy,
    }),
    { twitter: 0, facebook: 0, linkedin: 0, copy: 0 }
  );

  return {
    totalViews,
    totalReads,
    avgReadRate: Math.round(avgReadRate * 10) / 10,
    totalShares,
    totalBookmarks,
    shareBreakdown,
  };
}

export default function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { lang: paramLang } = use(params);
  const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
  const [lang, setLang] = useState<Language>(validLang);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | '7d' | '30d' | '90d'>('30d');
  const [posts, setPosts] = useState<PostAnalytics[]>([]);
  const [summary, setSummary] = useState({
    totalViews: 0,
    totalReads: 0,
    avgReadRate: 0,
    totalShares: 0,
    totalBookmarks: 0,
    shareBreakdown: { twitter: 0, facebook: 0, linkedin: 0, copy: 0 },
  });
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    setLang(validLang);
  }, [validLang]);

  // Separate effect for auth/role checks and data loading
  useEffect(() => {
    // Wait for both auth and role to finish loading
    if (authLoading || roleLoading) return;

    if (!user) {
      router.push(`/${validLang}/login`);
      return;
    }

    // Check if user has admin role (analytics is admin-only, only after role is loaded)
    const hasAdminRole = isAdmin();
    if (!hasAdminRole) {
      router.push(`/${validLang}/dashboard`);
      return;
    }

    // Load analytics data (only after role is confirmed)
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch posts data only once
        const postsData = await getAllPostsAnalytics();
        setPosts(postsData);
        
        // Calculate summary from already-fetched posts data (no double fetch)
        const summaryData = calculateSummaryFromPosts(postsData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast.error(lang === 'it' ? 'Errore nel caricamento delle analisi' : 'Error loading analytics');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validLang, router, user, authLoading, roleLoading]); // Removed isAdmin to prevent infinite loop

  const filteredPosts = posts.filter(post => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleEn = post.title.en.toLowerCase();
      const titleIt = post.title.it.toLowerCase();
      return titleEn.includes(query) || titleIt.includes(query);
    }
    return true;
  });

  if (authLoading || loading) {
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
              {summary.totalViews.toLocaleString()}
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
              {summary.totalReads.toLocaleString()}
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
              {summary.avgReadRate.toFixed(1)}%
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
              {summary.totalShares.toLocaleString()}
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
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      {lang === 'it' ? 'Segnalibri' : 'Bookmarks'}
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
                        {post.published ? (
                          <div className="flex flex-col items-end">
                            <span>{post.shares.toLocaleString()}</span>
                            <div className="flex gap-1 mt-1 text-xs">
                              <span className="text-blue-500" title="Twitter">T: {post.shareBreakdown.twitter}</span>
                              <span className="text-blue-600" title="Facebook">F: {post.shareBreakdown.facebook}</span>
                              <span className="text-blue-700" title="LinkedIn">L: {post.shareBreakdown.linkedin}</span>
                              <span className="text-gray-500" title="Copy">C: {post.shareBreakdown.copy}</span>
                            </div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-purple-600">
                        {post.published ? post.bookmarks.toLocaleString() : '-'}
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

      {/* Share Breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {lang === 'it' ? 'Dettaglio Condivisioni' : 'Share Breakdown'}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-black text-blue-500">
                {summary.shareBreakdown.twitter}
              </p>
              <p className="text-sm text-gray-600 mt-1">Twitter</p>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <p className="text-2xl font-black text-blue-600">
                {summary.shareBreakdown.facebook}
              </p>
              <p className="text-sm text-gray-600 mt-1">Facebook</p>
            </div>
            <div className="text-center p-4 bg-blue-200 rounded-lg">
              <p className="text-2xl font-black text-blue-700">
                {summary.shareBreakdown.linkedin}
              </p>
              <p className="text-sm text-gray-600 mt-1">LinkedIn</p>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-2xl font-black text-gray-600">
                {summary.shareBreakdown.copy}
              </p>
              <p className="text-sm text-gray-600 mt-1">Link Copy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

