'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PostForm, PostFormData } from '@/components/blog';
import { isAuthenticated } from '@/lib/auth';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface NewPostPageProps {
  params: Promise<{ lang: string }>;
}

export default function NewPostPage({ params }: NewPostPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = getTranslations(lang);

  useEffect(() => {
    params.then(({ lang }) => {
      const validLang = lang === 'it' ? 'it' : 'en';
      setLang(validLang);

      // Check authentication
      if (!isAuthenticated()) {
        router.push(`/${validLang}/login`);
        return;
      }
    });
  }, [params, router]);

  const handleSubmit = async (data: PostFormData) => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual Supabase save
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(lang === 'it' ? 'Post salvato con successo!' : 'Post saved successfully!');
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        router.push(`/${lang}/dashboard`);
      }, 500);
    } catch (error) {
      toast.error(lang === 'it' ? 'Errore nel salvare il post. Riprova.' : 'Failed to save post. Please try again.');
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

