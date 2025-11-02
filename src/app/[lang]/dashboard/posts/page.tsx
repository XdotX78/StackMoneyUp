'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent, Button, Badge, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { getTranslations, isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { formatDate } from '@/lib/utils';
import type { Language } from '@/types/blog';

interface PostsPageProps {
  params: Promise<{ lang: string }>;
}

// Mock posts data (replace with Supabase)
const mockPosts = [
  {
    id: '1',
    slug: 'compound-effect-investing',
    title: {
      en: 'The Compound Effect of Consistent Investing',
      it: "L'Effetto Composto degli Investimenti Costanti",
    },
    category: 'Investing',
    published: true,
    featured: false,
    published_at: '2024-12-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z',
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
    featured: false,
    published_at: null,
    updated_at: '2024-12-10T10:00:00Z',
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
    featured: true,
    published_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-20T10:00:00Z',
  },
];

export default function PostsPage({ params }: PostsPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadLang = async () => {
      const { lang: paramLang } = await params;
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);

      if (!loading && !user) {
        router.push(`/${validLang}/login`);
      }
    };
    loadLang();
  }, [params, router, user, loading]);

  const t = getTranslations(lang);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const titleEn = post.title.en.toLowerCase();
        const titleIt = post.title.it.toLowerCase();
        const category = post.category.toLowerCase();
        return titleEn.includes(query) || titleIt.includes(query) || category.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => 
        statusFilter === 'published' ? post.published : !post.published
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title[lang] || a.title.en).localeCompare(b.title[lang] || b.title.en);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          const dateA = a.published_at || a.updated_at;
          const dateB = b.published_at || b.updated_at;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
    });

    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy, lang]);

  const handleDelete = (postId: string) => {
    if (confirm(t.dashboard.deleteConfirm)) {
      // TODO: Delete from Supabase
      setPosts(posts.filter(p => p.id !== postId));
      toast.success(lang === 'it' ? 'Post eliminato!' : 'Post deleted!');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t.dashboard.loading}</div>
      </div>
    );
  }

  const validLang = lang;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">
            {validLang === 'it' ? 'Gestisci Post' : 'Manage Posts'}
          </h1>
          <p className="text-gray-600">
            {validLang === 'it' ? 'Visualizza, modifica ed elimina i tuoi post' : 'View, edit, and delete your posts'}
          </p>
        </div>
        <Link href={`/${lang}/dashboard/new-post`}>
          <Button variant="primary" size="lg">
            {t.dashboard.newPost}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {validLang === 'it' ? 'Cerca' : 'Search'}
              </label>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={validLang === 'it' ? 'Cerca per titolo o categoria...' : 'Search by title or category...'}
                className="w-full"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {validLang === 'it' ? 'Stato' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'drafts')}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">{validLang === 'it' ? 'Tutti' : 'All'}</option>
                <option value="published">{t.dashboard.published}</option>
                <option value="drafts">{t.dashboard.drafts}</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {validLang === 'it' ? 'Ordina per' : 'Sort by'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="date">{validLang === 'it' ? 'Data' : 'Date'}</option>
                <option value="title">{validLang === 'it' ? 'Titolo' : 'Title'}</option>
                <option value="category">{validLang === 'it' ? 'Categoria' : 'Category'}</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {validLang === 'it' ? 'Tutti i Post' : 'All Posts'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 
                ? (validLang === 'it' ? 'post' : 'post')
                : (validLang === 'it' ? 'post' : 'posts')
              }
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? (validLang === 'it' ? 'Nessun post trovato con questi filtri.' : 'No posts found with these filters.')
                  : t.dashboard.noPostsYet
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href={`/${lang}/dashboard/new-post`}>
                  <Button variant="primary">{t.dashboard.createFirstPost}</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {validLang === 'it' ? 'Titolo' : 'Title'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {validLang === 'it' ? 'Categoria' : 'Category'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {validLang === 'it' ? 'Stato' : 'Status'}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      {validLang === 'it' ? 'Data' : 'Date'}
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      {validLang === 'it' ? 'Azioni' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link 
                          href={`/${lang}/blog/${post.slug}`}
                          className="font-semibold text-gray-900 hover:text-emerald-600"
                        >
                          {post.title[lang] || post.title.en}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success" size="sm">
                          {getCategoryTranslation(post.category, lang)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {post.published ? (
                          <Badge variant="success" size="sm">
                            {t.dashboard.published}
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            {t.dashboard.drafts}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {post.published_at 
                          ? formatDate(post.published_at, lang === 'it' ? 'it-IT' : 'en-US')
                          : formatDate(post.updated_at, lang === 'it' ? 'it-IT' : 'en-US')
                        }
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/${lang}/dashboard/edit/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              {validLang === 'it' ? 'Modifica' : 'Edit'}
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            {validLang === 'it' ? 'Elimina' : 'Delete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
