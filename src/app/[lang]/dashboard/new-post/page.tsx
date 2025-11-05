'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostForm, PostFormData } from '@/components/blog';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { createPost } from '@/lib/blog';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface NewPostPageProps {
  params: Promise<{ lang: string }>;
}

export default function NewPostPage({ params }: NewPostPageProps) {
  const { lang: paramLang } = use(params);
  const validLang = paramLang === 'it' ? 'it' : 'en';
  const [lang, setLang] = useState<Language>(validLang);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuthContext();
  const { canManagePosts, loading: roleLoading } = useRole();
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    setLang(validLang);

    // Wait for both auth and role to finish loading
    if (authLoading || roleLoading) return;

    if (!user) {
      router.push(`/${validLang}/login`);
      return;
    }

    // Check if user has editor/admin role (only after role is loaded)
    if (!canManagePosts()) {
      router.push(`/${validLang}/dashboard`);
    }
  }, [validLang, router, user, authLoading, roleLoading, canManagePosts]);

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
