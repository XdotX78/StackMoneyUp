'use client';

import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui';
import type { Language } from '@/types/blog';

interface SEOPreviewProps {
  title: string;
  excerpt: string;
  slug: string;
  cover_image?: string;
  lang: Language;
  siteUrl?: string;
}

export default function SEOPreview({
  title,
  excerpt,
  slug,
  cover_image,
  lang,
  siteUrl = 'https://stackmoneyup.com',
}: SEOPreviewProps) {
  const fullUrl = `${siteUrl}/${lang}/blog/${slug}`;
  
  // SEO recommendations
  const titleLength = title.length;
  const excerptLength = excerpt.length;
  const titleOptimal = titleLength >= 30 && titleLength <= 60;
  const excerptOptimal = excerptLength >= 120 && excerptLength <= 160;

  return (
    <div className="space-y-6">
      {/* SEO Metrics */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {lang === 'it' ? 'Metriche SEO' : 'SEO Metrics'}
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {lang === 'it' ? 'Titolo' : 'Title'}
              </span>
              <span className={`text-sm font-medium ${
                titleOptimal ? 'text-green-600' : 'text-orange-600'
              }`}>
                {titleLength} / 30-60 {lang === 'it' ? 'caratteri' : 'characters'}
              </span>
            </div>
            {!titleOptimal && (
              <p className="text-xs text-orange-600 mt-1">
                {titleLength < 30
                  ? (lang === 'it' ? 'Il titolo è troppo corto' : 'Title is too short')
                  : (lang === 'it' ? 'Il titolo è troppo lungo' : 'Title is too long')
                }
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {lang === 'it' ? 'Descrizione' : 'Description'}
              </span>
              <span className={`text-sm font-medium ${
                excerptOptimal ? 'text-green-600' : 'text-orange-600'
              }`}>
                {excerptLength} / 120-160 {lang === 'it' ? 'caratteri' : 'characters'}
              </span>
            </div>
            {!excerptOptimal && (
              <p className="text-xs text-orange-600 mt-1">
                {excerptLength < 120
                  ? (lang === 'it' ? 'La descrizione è troppo corta' : 'Description is too short')
                  : (lang === 'it' ? 'La descrizione è troppo lunga' : 'Description is too long')
                }
              </p>
            )}
          </div>

          {/* URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                URL
              </span>
            </div>
            <p className="text-sm text-gray-600 break-all">{fullUrl}</p>
          </div>
        </CardContent>
      </Card>

      {/* Google Search Preview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {lang === 'it' ? 'Anteprima Ricerca Google' : 'Google Search Preview'}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">{siteUrl}</span>
            </div>
            <h3 className="text-xl text-blue-600 hover:underline mb-1 line-clamp-1">
              {title || (lang === 'it' ? '[Titolo del post]' : '[Post title]')}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {excerpt || (lang === 'it' ? '[Descrizione del post]' : '[Post description]')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Facebook/OpenGraph Preview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {lang === 'it' ? 'Anteprima Facebook / OpenGraph' : 'Facebook / OpenGraph Preview'}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md">
            {cover_image ? (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={cover_image}
                  alt={title || 'Post cover'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  {lang === 'it' ? 'Immagine di copertina' : 'Cover image'}
                </span>
              </div>
            )}
            <div className="p-3">
              <div className="text-xs text-gray-500 uppercase mb-1">{siteUrl}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {title || (lang === 'it' ? '[Titolo del post]' : '[Post title]')}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {excerpt || (lang === 'it' ? '[Descrizione del post]' : '[Post description]')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Card Preview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {lang === 'it' ? 'Anteprima Twitter Card' : 'Twitter Card Preview'}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-md">
            {cover_image ? (
              <div className="relative w-full h-56 bg-gray-100">
                <Image
                  src={cover_image}
                  alt={title || 'Post cover'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">
                  {lang === 'it' ? 'Immagine di copertina' : 'Cover image'}
                </span>
              </div>
            )}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">StackMoneyUp</div>
                  <div className="text-xs text-gray-500">@stackmoneyup</div>
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {title || (lang === 'it' ? '[Titolo del post]' : '[Post title]')}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {excerpt || (lang === 'it' ? '[Descrizione del post]' : '[Post description]')}
              </p>
              <div className="text-xs text-gray-500">{siteUrl}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

