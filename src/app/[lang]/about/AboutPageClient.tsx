import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface AboutPageClientProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPageClient({ params }: AboutPageClientProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl lg:text-6xl font-black mb-4">
          {t.about.title}
        </h1>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none space-y-8">
        <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="mb-6">
            {t.about.text1}
          </p>
          <p>
            {t.about.text2}
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? 'La Nostra Missione' : validLang === 'es' ? 'Nuestra Misión' : 'Our Mission'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {validLang === 'it' 
              ? 'Fornire informazioni oneste e pratiche sulla finanza personale, senza promesse irrealistiche o contenuti sponsorizzati. Crediamo nella trasparenza e nell\'educazione finanziaria reale.'
              : validLang === 'es'
              ? 'Proporcionar información honesta y práctica sobre finanzas personales, sin promesas irrealistas o contenido patrocinado. Creemos en la transparencia y la educación financiera real.'
              : 'To provide honest, practical personal finance information without unrealistic promises or sponsored content. We believe in transparency and real financial education.'
            }
          </p>
        </div>

        {/* Values Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? 'I Nostri Valori' : validLang === 'es' ? 'Nuestros Valores' : 'Our Values'}
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{validLang === 'it' ? 'Trasparenza totale' : validLang === 'es' ? 'Transparencia total' : 'Complete transparency'}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{validLang === 'it' ? 'Nessun link di affiliazione' : validLang === 'es' ? 'Sin enlaces de afiliados' : 'No affiliate links'}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{validLang === 'it' ? 'Consigli pratici e reali' : validLang === 'es' ? 'Consejos prácticos y reales' : 'Practical, real advice'}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{validLang === 'it' ? 'Educazione finanziaria accessibile' : validLang === 'es' ? 'Educación financiera accesible' : 'Accessible financial education'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

