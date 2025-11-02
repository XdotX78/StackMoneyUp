'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostForm, PostFormData } from '@/components/blog';
import { useAuth } from '@/hooks/useAuth';
import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language, BlogPost } from '@/types/blog';

interface EditPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Mock post data (replace with Supabase fetch)
const mockPost: Partial<BlogPost> = {
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
  content: {
    en: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'When it comes to building wealth, consistency trumps timing every single time.' }]
        }
      ]
    }),
    it: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Quando si tratta di costruire ricchezza, la costanza batte sempre il tempismo.' }]
        }
      ]
    }),
  },
  category: 'Investing', // This can be changed when editing
  tags: ['investing', 'compound-interest', 'long-term'],
  cover_image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
  published: true,
  featured: false,
};

export default function EditPostPage({ params }: EditPostPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Partial<BlogPost> | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    const loadData = async () => {
      const { lang: paramLang, slug } = await params;
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);

      if (!authLoading && !user) {
        router.push(`/${validLang}/login`);
        return;
      }

      // TODO: Fetch post from Supabase by slug
      // For now, use mock data
      setPost(mockPost);
    };
    loadData();
  }, [params, router, user, authLoading]);

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);
    
    try {
      // TODO: Update post in Supabase
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(lang === 'it' ? 'Post aggiornato con successo!' : 'Post updated successfully!');
      
      // Redirect to dashboard after successful update
      setTimeout(() => {
        router.push(`/${lang}/dashboard/posts`);
      }, 500);
    } catch (error) {
      toast.error(lang === 'it' ? 'Errore nel salvare il post. Riprova.' : 'Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${lang}/dashboard/posts`);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">{t.dashboard.loading}</div>
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

