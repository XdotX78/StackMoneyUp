'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import BlogEditor from './BlogEditor';
import { Tabs } from '@/components/ui';
import { Input, Textarea, Button } from '@/components/ui';
import { generateSlug, calculateReadTime } from '@/lib/utils';
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoSavedRef = useRef(false);

  // Auto-generate slug from English title
  useEffect(() => {
    if (formData.title_en && !initialData?.slug) {
      const newSlug = generateSlug(formData.title_en);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
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

    setAutoSaveStatus('unsaved');

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
      } catch (error) {
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
          .filter(Boolean) as Array<{ key: string; data: any }>;

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
              }
            }
          }
        }
      } catch (error) {
        // Silently fail if localStorage access fails
      }
    }
  }, [initialData, lang]);

  // Calculate read time when content changes
  const calculateReadTimeForContent = (content: string): number => {
    try {
      const parsed = JSON.parse(content);
      // Extract text from JSON (simplified - in production, you'd traverse the JSON properly)
      const text = JSON.stringify(parsed);
      return calculateReadTime(text);
    } catch {
      return 0;
    }
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
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
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => handleInputChange('published', e.target.checked)}
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

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
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
    </form>
  );
}

