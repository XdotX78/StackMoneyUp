'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent, Button, Input, LoadingSkeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { listBlogImages, deleteBlogImage, uploadBlogImage } from '@/lib/storage';
import { formatDate } from '@/lib/utils';
import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface MediaPageProps {
  params: Promise<{ lang: string }>;
}

interface ImageItem {
  url: string;
  path: string;
  name: string;
  created_at: string;
}

export default function MediaPage({ params }: MediaPageProps) {
  const [lang, setLang] = useState<Language>('en');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { canManagePosts } = useRole();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadLang = async () => {
      const { lang: paramLang } = await params;
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
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

  useEffect(() => {
    if (user) {
      loadImages();
    }
  }, [user]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const imageList = await listBlogImages();
      setImages(imageList);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(lang === 'it' ? 'Seleziona un file immagine' : 'Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(lang === 'it' ? 'La dimensione dell\'immagine deve essere inferiore a 5MB' : 'Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadBlogImage(file);
      toast.success(lang === 'it' ? 'Immagine caricata con successo!' : 'Image uploaded successfully!');
      await loadImages(); // Reload images list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (imagePath: string, imageName: string) => {
    if (!confirm(
      lang === 'it'
        ? `Sei sicuro di voler eliminare "${imageName}"?`
        : `Are you sure you want to delete "${imageName}"?`
    )) {
      return;
    }

    setDeletingId(imagePath);
    try {
      await deleteBlogImage(imagePath);
      toast.success(lang === 'it' ? 'Immagine eliminata!' : 'Image deleted!');
      await loadImages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success(lang === 'it' ? 'URL copiato!' : 'URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast.error(lang === 'it' ? 'Impossibile copiare l\'URL' : 'Failed to copy URL');
    }
  };

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-6">
          <LoadingSkeleton variant="text" width="200px" height="32px" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="rectangular" height="200px" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const t = getTranslations(lang);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">
            {lang === 'it' ? 'Libreria Media' : 'Media Library'}
          </h1>
          <p className="text-gray-600">
            {lang === 'it' 
              ? 'Gestisci e visualizza tutte le tue immagini caricate'
              : 'Manage and view all your uploaded images'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading 
              ? (lang === 'it' ? 'Caricamento...' : 'Uploading...')
              : (lang === 'it' ? '+ Carica Immagine' : '+ Upload Image')
            }
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'it' ? 'Cerca immagini...' : 'Search images...'}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Images Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {lang === 'it' ? 'Tutte le Immagini' : 'All Images'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredImages.length} {filteredImages.length === 1 
                ? (lang === 'it' ? 'immagine' : 'image')
                : (lang === 'it' ? 'immagini' : 'images')
              }
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filteredImages.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <svg 
                className="w-24 h-24 mx-auto mb-4 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mb-4 text-lg">
                {searchQuery
                  ? (lang === 'it' ? 'Nessuna immagine trovata' : 'No images found')
                  : (lang === 'it' ? 'Nessuna immagine caricata' : 'No images uploaded yet')
                }
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {lang === 'it' ? 'Carica la Prima Immagine' : 'Upload Your First Image'}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.path}
                  className="group relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(image.url)}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        {copiedUrl === image.url ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(image.path, image.name)}
                        disabled={deletingId === image.path}
                        className="bg-white text-red-600 hover:bg-red-50"
                      >
                        {deletingId === image.path ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate mb-1" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(image.created_at, lang === 'it' ? 'it-IT' : 'en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

