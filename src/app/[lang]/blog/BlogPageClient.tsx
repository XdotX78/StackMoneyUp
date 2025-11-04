'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, Badge, BlogGridSkeleton } from '@/components/ui';
import { BlogGrid } from '@/components/blog';
import { getTranslations, isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import { getPublishedPosts, searchPosts } from '@/lib/blog';
import type { BlogPostSummary, Language } from '@/types/blog';

interface BlogPageClientProps {
  params: Promise<{ lang: string }>;
}

export default function BlogPageClient({ params }: BlogPageClientProps) {
  const [lang, setLang] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const t = getTranslations(lang);

  useEffect(() => {
    params.then(({ lang: paramLang }) => {
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);
    });
  }, [params]);

  // Fetch posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        // Use full-text search if there's a search query, otherwise get all posts
        if (searchQuery.trim()) {
          const searchResults = await searchPosts(searchQuery.trim(), {
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
          });
          setPosts(searchResults);
        } else {
          const fetchedPosts = await getPublishedPosts();
          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      loadPosts();
    }, searchQuery.trim() ? 300 : 0); // 300ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedTags]);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category));
    return Array.from(cats).sort();
  }, [posts]);

  // Extract unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts (now handled server-side for search, client-side for category/tags only)
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // If search is active, filtering is already done server-side
    // Only apply client-side filters if no search query
    if (!searchQuery.trim()) {
      // Filter by category (client-side when no search)
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(post => post.category === selectedCategory);
      }

      // Filter by selected tags (client-side when no search)
      if (selectedTags.length > 0) {
        filtered = filtered.filter(post => 
          post.tags.some(tag => selectedTags.includes(tag))
        );
      }
    }
    // When search is active, category and tags are already filtered server-side

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTags]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedTags.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl lg:text-6xl font-black mb-4">
          {t.blogPage.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t.blogPage.subtitle}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={t.blogPage.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">
            {t.blogPage.categoryLabel}
          </span>
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            {t.blogPage.all}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryTranslation(category, lang)}
            </Button>
          ))}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {lang === 'it' ? 'Tag:' : 'Tags:'}
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">
                {t.blogPage.activeFilters}
              </span>
              {searchQuery && (
                <Badge variant="info" size="sm">
                  {t.blogPage.searchPlaceholder}: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="success" size="sm">
                  {getCategoryTranslation(selectedCategory, lang)}
                </Badge>
              )}
              {selectedTags.map(tag => (
                <Badge key={tag} variant="info" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              {t.blogPage.clearFilters}
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {filteredPosts.length === 1
            ? t.blogPage.foundArticle.replace('{count}', '1')
            : t.blogPage.foundArticles.replace('{count}', filteredPosts.length.toString())
          }
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <BlogGridSkeleton count={6} />
      ) : (
        <BlogGrid posts={filteredPosts} lang={lang} />
      )}
    </div>
  );
}

