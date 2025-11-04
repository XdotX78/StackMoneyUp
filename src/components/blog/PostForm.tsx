'use client';

import { useState, useEffect, useRef } from 'react';
import BlogEditor from './BlogEditor';
import BlogPostPreview from './BlogPostPreview';
import SEOPreview from './SEOPreview';
import { Tabs, Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { Input, Textarea, Button } from '@/components/ui';
import { generateSlug, formatDate } from '@/lib/utils';
import { getTranslations } from '@/lib/translations';
import type { BlogPost, Language } from '@/types/blog';

interface PostFormProps {
  initialData?: Partial<BlogPost>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  lang?: Language; // Language for translations
}

export interface PostFormData {
  title_en: string;
  title_it: string;
  slug: string;
  excerpt_en: string;
  excerpt_it: string;
  content_en: string; // JSON string
  content_it: string; // JSON string
  category: string;
  tags: string[];
  cover_image?: string;
  published: boolean;
  featured: boolean;
  scheduled_at?: string; // ISO date string for scheduled publishing
}

export default function PostForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  lang = 'en',
}: PostFormProps) {
  const t = getTranslations(lang);
  const [formData, setFormData] = useState<PostFormData>({
    title_en: initialData?.title?.en || '',
    title_it: initialData?.title?.it || '',
    slug: initialData?.slug || '',
    excerpt_en: initialData?.excerpt?.en || '',
    excerpt_it: initialData?.excerpt?.it || '',
    content_en: initialData?.content?.en || '',
    content_it: initialData?.content?.it || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    cover_image: initialData?.cover_image || '',
    published: initialData?.published || false,
    featured: initialData?.featured || false,
    scheduled_at: initialData?.published_at && new Date(initialData.published_at) > new Date()
      ? initialData.published_at
      : undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showPreview, setShowPreview] = useState(false);
  const [showSEOPreview, setShowSEOPreview] = useState(false);
  const [previewLang, setPreviewLang] = useState<'en' | 'it'>('en');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoSavedRef = useRef(false);

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.title_en && !initialData?.slug) {
      const newSlug = generateSlug(formData.title_en);
      // Use setTimeout to avoid setState in effect warning
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, slug: newSlug }));
      }, 0);
    }
  }, [formData.title_en, initialData?.slug]);

  // Auto-save functionality (saves to localStorage)
  useEffect(() => {
    // Skip auto-save if form is empty or just initialized
    const isEmpty = !formData.title_en && !formData.title_it && !formData.content_en && !formData.content_it;
    if (isEmpty && !hasAutoSavedRef.current) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Use setTimeout to avoid setState in effect warning
    setTimeout(() => {
      setAutoSaveStatus('unsaved');
    }, 0);

    // Auto-save after 2 seconds of inactivity
    autoSaveTimeoutRef.current = setTimeout(() => {
      try {
        const autoSaveKey = initialData?.slug 
          ? `post-draft-${initialData.slug}` 
          : `post-draft-new-${Date.now()}`;
        
        localStorage.setItem(autoSaveKey, JSON.stringify({
          ...formData,
          savedAt: new Date().toISOString(),
        }));
        
        setAutoSaveStatus('saved');
        hasAutoSavedRef.current = true;
      } catch {
        // Ignore localStorage errors
        setAutoSaveStatus('unsaved');
      }
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, initialData?.slug]);

  // Load auto-saved draft on mount
  useEffect(() => {
    if (!initialData) {
      try {
        const savedDrafts = Object.keys(localStorage)
          .filter(key => key.startsWith('post-draft-new-'))
          .map(key => {
            const saved = localStorage.getItem(key);
            return saved ? { key, data: JSON.parse(saved) } : null;
          })
          .filter(Boolean) as Array<{ key: string; data: Partial<PostFormData> }>;

        // Get the most recent draft
        if (savedDrafts.length > 0) {
          const latestDraft = savedDrafts.sort((a, b) => 
            new Date(b.data.savedAt || 0).getTime() - new Date(a.data.savedAt || 0).getTime()
          )[0];

          if (latestDraft && latestDraft.data.savedAt) {
            const savedDate = new Date(latestDraft.data.savedAt);
            const hoursSinceSave = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);
            
            if (hoursSinceSave < 24) { // Only restore drafts less than 24 hours old
              if (confirm(lang === 'it' 
                ? `Vuoi ripristinare la bozza salvata ${savedDate.toLocaleString('it-IT')}?`
                : `Restore draft saved ${savedDate.toLocaleString('en-US')}?`
              )) {
                // Use setTimeout to avoid setState in effect warning
                setTimeout(() => {
                  setFormData({
                    title_en: latestDraft.data.title_en || '',
                    title_it: latestDraft.data.title_it || '',
                    slug: latestDraft.data.slug || '',
                    excerpt_en: latestDraft.data.excerpt_en || '',
                    excerpt_it: latestDraft.data.excerpt_it || '',
                    content_en: latestDraft.data.content_en || '',
                    content_it: latestDraft.data.content_it || '',
                    category: latestDraft.data.category || '',
                    tags: latestDraft.data.tags || [],
                    cover_image: latestDraft.data.cover_image || '',
                    published: false,
                    featured: false,
                  });
                  hasAutoSavedRef.current = true;
                }, 0);
              }
            }
          }
        }
      } catch {
        // Silently fail if localStorage access fails (error ignored)
      }
    }
  }, [initialData, lang]);

  // Calculate read time when content changes - Reserved for future use
  //   try {
  //     const parsed = JSON.parse(content);
  //     // Extract text from JSON (simplified - in production, you'd traverse the JSON properly)
  //     const text = JSON.stringify(parsed);
  //     return calculateReadTime(text);
  //   } catch {
  //     return 0;
  //   }
  // };

  const handleInputChange = (field: keyof PostFormData, value: string | string[] | boolean | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleContentChange = (lang: 'en' | 'it', content: string) => {
    if (lang === 'en') {
      handleInputChange('content_en', content);
    } else {
      handleInputChange('content_it', content);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title_en.trim()) {
      newErrors.title_en = 'English title is required';
    }
    if (!formData.title_it.trim()) {
      newErrors.title_it = 'Italian title is required';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.excerpt_en.trim()) {
      newErrors.excerpt_en = 'English excerpt is required';
    }
    if (!formData.excerpt_it.trim()) {
      newErrors.excerpt_it = 'Italian excerpt is required';
    }
    if (!formData.content_en) {
      newErrors.content_en = 'English content is required';
    }
    if (!formData.content_it) {
      newErrors.content_it = 'Italian content is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const tabs = [
    {
      id: 'english',
      label: lang === 'it' ? `${t.postForm.english} (EN)` : `${t.postForm.english} (EN)`,
      content: (
        <div className="space-y-6">
          <Input
            label="Title (English)"
            value={formData.title_en}
            onChange={(e) => handleInputChange('title_en', e.target.value)}
            error={errors.title_en}
            placeholder="Enter the English title"
          />
          <Textarea
            label="Excerpt (English)"
            value={formData.excerpt_en}
            onChange={(e) => handleInputChange('excerpt_en', e.target.value)}
            error={errors.excerpt_en}
            placeholder="A brief summary of the post (used in preview cards)"
            showCharCount
            maxLength={200}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (English)
            </label>
            {errors.content_en && (
              <p className="text-sm text-red-600 mb-2">{errors.content_en}</p>
            )}
            <BlogEditor
              content={formData.content_en}
              placeholder={t.postForm.englishPlaceholder}
              onChange={(content) => handleContentChange('en', content)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'italian',
      label: lang === 'it' ? `${t.postForm.italian} (IT)` : `${t.postForm.italian} (IT)`,
      content: (
        <div className="space-y-6">
          <Input
            label="Title (Italian)"
            value={formData.title_it}
            onChange={(e) => handleInputChange('title_it', e.target.value)}
            error={errors.title_it}
            placeholder="Enter the Italian title"
          />
          <Textarea
            label="Excerpt (Italian)"
            value={formData.excerpt_it}
            onChange={(e) => handleInputChange('excerpt_it', e.target.value)}
            error={errors.excerpt_it}
            placeholder="Un breve riassunto del post"
            showCharCount
            maxLength={200}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (Italian)
            </label>
            {errors.content_it && (
              <p className="text-sm text-red-600 mb-2">{errors.content_it}</p>
            )}
            <BlogEditor
              content={formData.content_it}
              placeholder={t.postForm.italianPlaceholder}
              onChange={(content) => handleContentChange('it', content)}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Common Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t.postForm.slug}
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            error={errors.slug}
            placeholder="URL-friendly identifier"
            helperText={t.postForm.slugHelper}
          />
          <Input
            label={t.postForm.category}
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            error={errors.category}
            placeholder={t.postForm.categoryPlaceholder}
          />
        </div>

        <Input
          label={t.postForm.coverImage}
          value={formData.cover_image || ''}
          onChange={(e) => handleInputChange('cover_image', e.target.value)}
          placeholder="https://images.unsplash.com/..."
          helperText={t.postForm.coverImageHelper}
        />

        {/* Tags - Simple input for now, can be enhanced later */}
        <Input
          label={t.postForm.tags}
          value={formData.tags.join(', ')}
          onChange={(e) => {
            const tags = e.target.value
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
            handleInputChange('tags', tags);
          }}
          placeholder={t.postForm.tagsPlaceholder}
          helperText={t.postForm.tagsHelper}
        />
      </div>

      {/* Dual Editors with Tabs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t.postForm.content}</h2>
          {/* Auto-save status indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {autoSaveStatus === 'saving' && (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>{lang === 'it' ? 'Salvataggio...' : 'Saving...'}</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{lang === 'it' ? 'Bozza salvata' : 'Draft saved'}</span>
              </>
            )}
            {autoSaveStatus === 'unsaved' && (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>{lang === 'it' ? 'Non salvato' : 'Unsaved'}</span>
              </>
            )}
          </div>
        </div>
        <Tabs tabs={tabs} defaultTab="english" />
      </div>

      {/* Status Toggles */}
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => {
                const newPublished = e.target.checked;
                handleInputChange('published', newPublished);
                // Clear scheduled date if publishing now
                if (newPublished) {
                  handleInputChange('scheduled_at', undefined);
                }
              }}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">{t.postForm.published}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">{t.postForm.featured}</span>
          </label>
        </div>

        {/* Schedule Publishing */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.scheduled_at}
              onChange={(e) => {
                if (e.target.checked) {
                  // Set default to tomorrow at 9 AM
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(9, 0, 0, 0);
                  handleInputChange('scheduled_at', tomorrow.toISOString());
                  handleInputChange('published', false);
                } else {
                  handleInputChange('scheduled_at', undefined);
                }
              }}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">
              {lang === 'it' ? 'Pubblica in seguito' : 'Schedule for later'}
            </span>
          </label>
          {formData.scheduled_at && (
            <input
              type="datetime-local"
              value={formData.scheduled_at ? new Date(formData.scheduled_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  handleInputChange('scheduled_at', date.toISOString());
                } else {
                  handleInputChange('scheduled_at', undefined);
                }
              }}
              min={new Date().toISOString().slice(0, 16)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          )}
        </div>
        {formData.scheduled_at && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {lang === 'it'
                ? `Pubblicazione programmata per: ${formatDate(formData.scheduled_at, 'it-IT', { includeTime: true })}`
                : `Scheduled for: ${formatDate(formData.scheduled_at, 'en-US', { includeTime: true })}`
              }
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {t.postForm.preview}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowSEOPreview(true)}
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {lang === 'it' ? 'SEO' : 'SEO'}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t.postForm.cancel}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {initialData ? t.postForm.updatePost : t.postForm.createPost}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} size="xl">
        <ModalHeader>
          {t.postForm.previewTitle}
        </ModalHeader>
        <ModalBody className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Language Tabs for Preview */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  previewLang === 'en'
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.postForm.previewEnglish}
              </button>
              <button
                onClick={() => setPreviewLang('it')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  previewLang === 'it'
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.postForm.previewItalian}
              </button>
            </div>

            {/* Preview Content */}
            <div className="bg-gray-50 rounded-lg p-6">
              <BlogPostPreview
                title={previewLang === 'en' ? formData.title_en : formData.title_it}
                excerpt={previewLang === 'en' ? formData.excerpt_en : formData.excerpt_it}
                content={previewLang === 'en' ? formData.content_en : formData.content_it}
                category={formData.category}
                tags={formData.tags}
                cover_image={formData.cover_image}
                lang={previewLang}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            {t.postForm.closePreview}
          </Button>
        </ModalFooter>
      </Modal>

      {/* SEO Preview Modal */}
      <Modal isOpen={showSEOPreview} onClose={() => setShowSEOPreview(false)} size="xl">
        <ModalHeader>
          {lang === 'it' ? 'Anteprima SEO' : 'SEO Preview'}
        </ModalHeader>
        <ModalBody className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Language Tabs for SEO Preview */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  previewLang === 'en'
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setPreviewLang('it')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  previewLang === 'it'
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Italiano
              </button>
            </div>

            {/* SEO Preview Content */}
            <SEOPreview
              title={previewLang === 'en' ? formData.title_en : formData.title_it}
              excerpt={previewLang === 'en' ? formData.excerpt_en : formData.excerpt_it}
              slug={formData.slug}
              cover_image={formData.cover_image}
              lang={previewLang}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowSEOPreview(false)}>
            {lang === 'it' ? 'Chiudi' : 'Close'}
          </Button>
        </ModalFooter>
      </Modal>
    </form>
  );
}

