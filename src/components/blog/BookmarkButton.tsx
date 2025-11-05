'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';
import toast from 'react-hot-toast';
import type { Language } from '@/types/blog';

interface BookmarkButtonProps {
  postId: string;
  lang: Language;
  variant?: 'default' | 'icon-only';
}

export default function BookmarkButton({ postId, lang, variant = 'default' }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkBookmarkStatus();
    } else {
      setLoading(false);
    }
  }, [user, postId]);

  const checkBookmarkStatus = async () => {
    try {
      const status = await isBookmarked(postId);
      setBookmarked(status);
    } catch (error) {
      console.error('Error checking bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!user) {
      router.push(`/${lang}/login`);
      toast.error(lang === 'it' ? 'Accedi per salvare i post' : 'Sign in to bookmark posts');
      return;
    }

    try {
      setLoading(true);
      const newStatus = await toggleBookmark(postId);
      setBookmarked(newStatus);
      toast.success(
        newStatus
          ? (lang === 'it' ? 'Post salvato!' : 'Post bookmarked!')
          : (lang === 'it' ? 'Segnalibro rimosso' : 'Bookmark removed')
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error(lang === 'it' ? 'Errore nel salvare il post' : 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`p-2 rounded-lg transition-colors ${
          bookmarked
            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-label={bookmarked ? (lang === 'it' ? 'Rimuovi segnalibro' : 'Remove bookmark') : (lang === 'it' ? 'Salva post' : 'Bookmark post')}
      >
        <svg
          className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`}
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold text-sm ${
        bookmarked
          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
          : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      <svg
        className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`}
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {loading
        ? (lang === 'it' ? 'Caricamento...' : 'Loading...')
        : bookmarked
        ? (lang === 'it' ? 'Salvato' : 'Saved')
        : (lang === 'it' ? 'Salva' : 'Bookmark')}
    </button>
  );
}


