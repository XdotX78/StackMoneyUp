'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent, Button, Badge, Input, LoadingSkeleton, TableSkeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { isEditor } from '@/lib/auth';
import { getAllPosts, deletePost, updatePost } from '@/lib/blog';
import { getTranslations, isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { formatDate } from '@/lib/utils';
import type { BlogPost, Language } from '@/types/blog';

interface PostsPageProps {
  params: Promise<{ lang: string }>;
}

export default function PostsPage({ params }: PostsPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();
  const { canManagePosts } = useRole();
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

      // Check if user has editor/admin role
      if (!authLoading && user && !canManagePosts()) {
        router.push(`/${validLang}/dashboard`);
      }
    };
    loadLang();
  }, [params, router, user, authLoading, canManagePosts]);

  // Fetch posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      if (!user || authLoading) return;
      
      try {
        setPostsLoading(true);
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load posts');
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, [user, authLoading]);

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

  const handleDelete = async (postId: string) => {
    if (!confirm(t.dashboard.deleteConfirm)) return;

    try {
      await deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
      toast.success(lang === 'it' ? 'Post eliminato!' : 'Post deleted!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete post');
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredAndSortedPosts.length && 
        filteredAndSortedPosts.every(p => selectedPosts.includes(p.id))) {
      // Deselect all filtered posts
      setSelectedPosts(prev => prev.filter(id => !filteredAndSortedPosts.find(p => p.id === id)));
    } else {
      // Select all filtered posts (keep previously selected posts that aren't in current filter)
      const filteredIds = filteredAndSortedPosts.map(p => p.id);
      setSelectedPosts(prev => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    
    const count = selectedPosts.length;
    if (!confirm(
      lang === 'it'
        ? `Sei sicuro di voler eliminare ${count} post?`
        : `Are you sure you want to delete ${count} post${count > 1 ? 's' : ''}?`
    )) return;

    try {
      // Delete all selected posts
      await Promise.all(selectedPosts.map(id => deletePost(id)));
      setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
      setSelectedPosts([]);
      toast.success(
        lang === 'it'
          ? `${count} post eliminati!`
          : `${count} post${count > 1 ? 's' : ''} deleted!`
      );
    } catch (error) {
      console.error('Error deleting posts:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete posts');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedPosts.length === 0) return;
    
    const count = selectedPosts.length;
    try {
      // Update all selected posts to published
      await Promise.all(
        selectedPosts.map(id => 
          updatePost(id, { published: true })
        )
      );
      
      // Refresh posts list
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      setSelectedPosts([]);
      
      toast.success(
        lang === 'it'
          ? `${count} post pubblicati!`
          : `${count} post${count > 1 ? 's' : ''} published!`
      );
    } catch (error) {
      console.error('Error publishing posts:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to publish posts');
    }
  };

  const handleBulkUnpublish = async () => {
    if (selectedPosts.length === 0) return;
    
    const count = selectedPosts.length;
    try {
      // Update all selected posts to unpublished
      await Promise.all(
        selectedPosts.map(id => 
          updatePost(id, { published: false })
        )
      );
      
      // Refresh posts list
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      setSelectedPosts([]);
      
      toast.success(
        lang === 'it'
          ? `${count} post depubblicati!`
          : `${count} post${count > 1 ? 's' : ''} unpublished!`
      );
    } catch (error) {
      console.error('Error unpublishing posts:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to unpublish posts');
    }
  };

  if (authLoading || postsLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <LoadingSkeleton variant="text" width="200px" height="32px" />
            <LoadingSkeleton variant="rectangular" width="120px" height="40px" />
          </div>
          <TableSkeleton rows={5} cols={5} />
        </div>
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

      {/* Bulk Actions Bar */}
      {selectedPosts.length > 0 && (
        <Card className="mb-6 bg-emerald-50 border-emerald-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-900">
                  {validLang === 'it' 
                    ? `${selectedPosts.length} post selezionati`
                    : `${selectedPosts.length} post${selectedPosts.length > 1 ? 's' : ''} selected`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPublish}
                  className="border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                >
                  {validLang === 'it' ? 'Pubblica' : 'Publish'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkUnpublish}
                  className="border-gray-400 text-gray-700 hover:bg-gray-400 hover:text-white"
                >
                  {validLang === 'it' ? 'Depubblica' : 'Unpublish'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
                >
                  {validLang === 'it' ? 'Elimina' : 'Delete'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPosts([])}
                >
                  {validLang === 'it' ? 'Deseleziona' : 'Clear'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12">
                      <input
                        type="checkbox"
                        checked={filteredAndSortedPosts.length > 0 && 
                                filteredAndSortedPosts.every(p => selectedPosts.includes(p.id))}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </th>
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
                    <tr 
                      key={post.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        selectedPosts.includes(post.id) ? 'bg-emerald-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => togglePostSelection(post.id)}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
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
                        ) : post.published_at && new Date(post.published_at) > new Date() ? (
                          <Badge variant="info" size="sm" className="bg-blue-100 text-blue-800">
                            {validLang === 'it' ? 'Programmato' : 'Scheduled'}
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
