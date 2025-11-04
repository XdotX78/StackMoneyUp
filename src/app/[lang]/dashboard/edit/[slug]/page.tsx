'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostForm, PostFormData } from '@/components/blog';
import { LoadingSkeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { getPostBySlug, updatePost } from '@/lib/blog';
import { isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language, BlogPost } from '@/types/blog';

interface EditPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { canManagePosts } = useRole();
  const router = useRouter();
  // const t = getTranslations(lang); // Reserved for future use

  useEffect(() => {
    const loadData = async () => {
      const { lang: paramLang, slug } = await params;
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);

      if (!authLoading && !user) {
        router.push(`/${validLang}/login`);
        return;
      }

      // Check if user has editor/admin role
      if (!authLoading && user && !canManagePosts()) {
        router.push(`/${validLang}/dashboard`);
        return;
      }

      // Fetch post from Supabase
      if (user && !authLoading) {
        try {
          setPostLoading(true);
          const fetchedPost = await getPostBySlug(slug);
          if (!fetchedPost) {
            toast.error(validLang === 'it' ? 'Post non trovato' : 'Post not found');
            router.push(`/${validLang}/dashboard/posts`);
            return;
          }
          setPost(fetchedPost);
        } catch (error) {
          console.error('Error loading post:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to load post');
          router.push(`/${validLang}/dashboard/posts`);
        } finally {
          setPostLoading(false);
        }
      }
    };
    loadData();
  }, [params, router, user, authLoading, canManagePosts]);

  const handleSubmit = async (data: PostFormData) => {
    if (!post) return;
    
    setLoading(true);
    
    try {
      // Prepare scheduled_at if provided
      const scheduledAt = data.scheduled_at 
        ? new Date(data.scheduled_at).toISOString()
        : undefined;

      // Update post in Supabase
      await updatePost(post.id, {
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
      
      toast.success(lang === 'it' ? 'Post aggiornato con successo!' : 'Post updated successfully!');
      
      // Redirect to dashboard after successful update
      setTimeout(() => {
        router.push(`/${lang}/dashboard/posts`);
      }, 500);
    } catch (error) {
      console.error('Error updating post:', error);
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
    router.push(`/${lang}/dashboard/posts`);
  };

  if (authLoading || postLoading || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <LoadingSkeleton variant="text" width="300px" height="40px" />
          <LoadingSkeleton variant="rectangular" height="400px" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">
          {lang === 'it' ? 'Modifica Post' : 'Edit Post'}
        </h1>
        <p className="text-gray-600">
          {lang === 'it' 
            ? 'Modifica il contenuto del tuo post del blog'
            : 'Update your blog post content'
          }
        </p>
      </div>

      <PostForm
        lang={lang}
        initialData={post}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
}

