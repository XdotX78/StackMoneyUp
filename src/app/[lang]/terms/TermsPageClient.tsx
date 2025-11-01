import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface TermsPageClientProps {
  params: Promise<{ lang: string }>;
}

export default async function TermsPageClient({ params }: TermsPageClientProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl lg:text-6xl font-black mb-8">
        {t.footer.terms} {validLang === 'it' ? 'di Servizio' : 'of Service'}
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '1. Accettazione dei Termini' : '1. Acceptance of Terms'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Utilizzando StackMoneyUp, accetti di rispettare questi Termini di Servizio. Se non sei d\'accordo, per favore non utilizzare il nostro servizio.'
              : 'By using StackMoneyUp, you agree to comply with these Terms of Service. If you do not agree, please do not use our service.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '2. Uso del Contenuto' : '2. Use of Content'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Il contenuto su StackMoneyUp è fornito a scopo informativo. Non costituisce consulenza finanziaria professionale. Consulta sempre un consulente finanziario qualificato prima di prendere decisioni finanziarie importanti.'
              : 'Content on StackMoneyUp is provided for informational purposes. It does not constitute professional financial advice. Always consult a qualified financial advisor before making significant financial decisions.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '3. Limitazione di Responsabilità' : '3. Limitation of Liability'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'StackMoneyUp non è responsabile per eventuali perdite finanziarie derivanti dall\'uso delle informazioni presenti sul sito. Utilizzi il contenuto a tuo rischio.'
              : 'StackMoneyUp is not liable for any financial losses resulting from the use of information on this site. You use the content at your own risk.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '4. Modifiche ai Termini' : '4. Changes to Terms'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche entreranno in vigore immediatamente dopo la pubblicazione.'
              : 'We reserve the right to modify these terms at any time. Changes will take effect immediately upon posting.'
            }
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>
            {validLang === 'it'
              ? 'Ultimo aggiornamento: Dicembre 2024'
              : 'Last updated: December 2024'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

