'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostForm, PostFormData } from '@/components/blog';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { createPost } from '@/lib/blog';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface NewPostPageProps {
  params: Promise<{ lang: string }>;
}

export default function NewPostPage({ params }: NewPostPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { canManagePosts } = useRole();
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    const loadLang = async () => {
      const { lang } = await params;
      const validLang = lang === 'it' ? 'it' : 'en';
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

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);
    
    try {
      // Prepare scheduled_at if provided
      const scheduledAt = data.scheduled_at 
        ? new Date(data.scheduled_at).toISOString()
        : undefined;

      // Create post in Supabase
      await createPost({
        slug: data.slug,
        title_en: data.title_en,
        title_it: data.title_it,
        excerpt_en: data.excerpt_en,
        excerpt_it: data.excerpt_it,
        content_en: data.content_en,
        content_it: data.content_it,
        category: data.category,
        tags: data.tags,
        cover_image: data.cover_image,
        published: data.published,
        featured: data.featured,
        scheduled_at: scheduledAt,
      });
      
      toast.success(lang === 'it' ? 'Post salvato con successo!' : 'Post saved successfully!');
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push(`/${lang}/dashboard/posts`);
      }, 500);
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : (lang === 'it' ? 'Errore nel salvare il post. Riprova.' : 'Failed to save post. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${lang}/dashboard`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">{t.newPost.title}</h1>
        <p className="text-gray-600">
          {t.newPost.subtitle}
        </p>
      </div>

      <PostForm
        lang={lang}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
}

