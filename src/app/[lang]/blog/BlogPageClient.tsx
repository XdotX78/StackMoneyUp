'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, Badge } from '@/components/ui';
import { BlogGrid } from '@/components/blog';
import { getTranslations, isValidLanguage, getDefaultLanguage, getCategoryTranslation } from '@/lib/translations';
import type { BlogPostSummary, Language } from '@/types/blog';

interface BlogPageClientProps {
  params: Promise<{ lang: string }>;
}

// Mock blog posts data (replace with Supabase when ready)
const mockPosts: BlogPostSummary[] = [
  {
    id: '1',
    slug: 'compound-effect-investing',
    title: {
      en: 'The Compound Effect of Consistent Investing',
      it: "L'Effetto Composto degli Investimenti Costanti",
    },
    excerpt: {
      en: 'Why investing $100 monthly beats trying to time the market with $10,000 once.',
      it: 'Perché investire 100€ mensili batte il tentativo di cronometrare il mercato.',
    },
    cover_image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    category: 'Investing',
    tags: ['investing', 'compound-interest', 'long-term'],
    read_time: 5,
    published_at: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    slug: '50-30-20-rule',
    title: {
      en: 'The 50/30/20 Rule Isn\'t Perfect',
      it: 'La Regola 50/30/20 Non È Perfetta',
    },
    excerpt: {
      en: 'Why the popular budgeting rule fails for most people and what to do instead.',
      it: 'Perché la popolare regola di budget fallisce per la maggior parte delle persone.',
    },
    cover_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    category: 'Budgeting & Spending',
    tags: ['budgeting', 'personal-finance', 'tips'],
    read_time: 7,
    published_at: '2024-12-10T10:00:00Z',
  },
  {
    id: '3',
    slug: 'stop-chasing-quick-wins',
    title: {
      en: 'Stop Chasing Quick Wins',
      it: 'Smetti di Cercare Vincite Rapide',
    },
    excerpt: {
      en: 'The psychology behind get-rich-quick schemes and why they fail.',
      it: 'La psicologia dietro gli schemi di arricchimento rapido e perché falliscono.',
    },
    cover_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    category: 'Money Mindset',
    tags: ['mindset', 'psychology', 'investing'],
    read_time: 6,
    published_at: '2024-11-20T10:00:00Z',
  },
  {
    id: '4',
    slug: 'debt-snowball-vs-avalanche',
    title: {
      en: 'Debt Snowball vs. Debt Avalanche',
      it: 'Debito a Palla di Neve vs. Valanga di Debito',
    },
    excerpt: {
      en: 'The psychological vs. mathematical approach to debt payoff.',
      it: "L'approccio psicologico vs. matematico per estinguere i debiti.",
    },
    cover_image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    category: 'Debt & Loans',
    tags: ['debt', 'personal-finance', 'strategies'],
    read_time: 8,
    published_at: '2024-11-15T10:00:00Z',
  },
  {
    id: '5',
    slug: 'why-6-months-not-enough',
    title: {
      en: 'Why 6 Months Isn\'t Enough',
      it: 'Perché 6 Mesi Non Bastano',
    },
    excerpt: {
      en: 'The case for building a larger emergency fund in uncertain times.',
      it: 'Il caso per costruire un fondo di emergenza più grande in tempi incerti.',
    },
    cover_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    category: 'Saving & Emergency Fund',
    tags: ['emergency-fund', 'savings', 'financial-security'],
    read_time: 6,
    published_at: '2024-10-25T10:00:00Z',
  },
  {
    id: '6',
    slug: 'side-hustles-that-scale',
    title: {
      en: 'Side Hustles That Actually Scale',
      it: 'Side Hustle che Scalano Davvero',
    },
    excerpt: {
      en: 'Beyond Uber and DoorDash. Real side businesses that can grow.',
      it: 'Oltre Uber e DoorDash. Veri business secondari che possono crescere.',
    },
    cover_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    category: 'Income & Earning More',
    tags: ['side-hustle', 'income', 'entrepreneurship'],
    read_time: 9,
    published_at: '2024-10-15T10:00:00Z',
  },
];

export default function BlogPageClient({ params }: BlogPageClientProps) {
  const [lang, setLang] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = getTranslations(lang);

  useEffect(() => {
    params.then(({ lang: paramLang }) => {
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);
    });
  }, [params]);

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set(mockPosts.map(post => post.category));
    return Array.from(cats).sort();
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let filtered = [...mockPosts];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        const title = post.title[lang] || post.title.en;
        const excerpt = post.excerpt[lang] || post.excerpt.en;
        const category = post.category.toLowerCase();
        const tags = post.tags.join(' ').toLowerCase();

        return title.toLowerCase().includes(query) ||
               excerpt.toLowerCase().includes(query) ||
               tags.includes(query) ||
               category.includes(query);
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, lang]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all';

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
      <BlogGrid posts={filteredPosts} lang={lang} />
    </div>
  );
}

