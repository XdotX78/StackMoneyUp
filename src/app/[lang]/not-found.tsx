import Link from 'next/link';
import { Button } from '@/components/ui';
import { isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface NotFoundProps {
  params?: Promise<{ lang?: string }>;
}

export default async function NotFound({ params }: NotFoundProps) {
  let lang: Language = 'en';
  
  if (params) {
    const resolvedParams = await params;
    if (resolvedParams?.lang) {
      lang = isValidLanguage(resolvedParams.lang) ? (resolvedParams.lang as Language) : getDefaultLanguage();
    }
  }
  
  // Translations reserved for future use
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {lang === 'it' ? 'Pagina Non Trovata' : lang === 'es' ? 'Página No Encontrada' : 'Page Not Found'}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          {lang === 'it'
            ? 'La pagina che stai cercando non esiste o è stata spostata.'
            : lang === 'es'
            ? 'La página que buscas no existe o ha sido movida.'
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href={`/${lang}`}>
            <Button variant="primary" size="lg">
              {lang === 'it' ? 'Vai alla Home' : lang === 'es' ? 'Ir al Inicio' : 'Go Home'}
            </Button>
          </Link>
          <Link href={`/${lang}/blog`}>
            <Button variant="outline" size="lg">
              {lang === 'it' ? 'Sfoglia Blog' : lang === 'es' ? 'Explorar Blog' : 'Browse Blog'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
