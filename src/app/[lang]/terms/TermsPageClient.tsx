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
        {t.footer.terms} {validLang === 'it' ? 'di Servizio' : validLang === 'es' ? 'de Servicio' : 'of Service'}
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '1. Accettazione dei Termini' : validLang === 'es' ? '1. Aceptación de los Términos' : '1. Acceptance of Terms'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Utilizzando StackMoneyUp, accetti di rispettare questi Termini di Servizio. Se non sei d\'accordo, per favore non utilizzare il nostro servizio.'
              : validLang === 'es'
              ? 'Al utilizar StackMoneyUp, aceptas cumplir con estos Términos de Servicio. Si no estás de acuerdo, por favor no utilices nuestro servicio.'
              : 'By using StackMoneyUp, you agree to comply with these Terms of Service. If you do not agree, please do not use our service.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '2. Uso del Contenuto' : validLang === 'es' ? '2. Uso del Contenido' : '2. Use of Content'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Il contenuto su StackMoneyUp è fornito a scopo informativo. Non costituisce consulenza finanziaria professionale. Consulta sempre un consulente finanziario qualificato prima di prendere decisioni finanziarie importanti.'
              : validLang === 'es'
              ? 'El contenido en StackMoneyUp se proporciona con fines informativos. No constituye asesoramiento financiero profesional. Siempre consulta a un asesor financiero calificado antes de tomar decisiones financieras importantes.'
              : 'Content on StackMoneyUp is provided for informational purposes. It does not constitute professional financial advice. Always consult a qualified financial advisor before making significant financial decisions.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '3. Limitazione di Responsabilità' : validLang === 'es' ? '3. Limitación de Responsabilidad' : '3. Limitation of Liability'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'StackMoneyUp non è responsabile per eventuali perdite finanziarie derivanti dall\'uso delle informazioni presenti sul sito. Utilizzi il contenuto a tuo rischio.'
              : validLang === 'es'
              ? 'StackMoneyUp no es responsable de las pérdidas financieras derivadas del uso de la información en este sitio. Utilizas el contenido bajo tu propio riesgo.'
              : 'StackMoneyUp is not liable for any financial losses resulting from the use of information on this site. You use the content at your own risk.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '4. Modifiche ai Termini' : validLang === 'es' ? '4. Cambios en los Términos' : '4. Changes to Terms'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche entreranno in vigore immediatamente dopo la pubblicazione.'
              : validLang === 'es'
              ? 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación.'
              : 'We reserve the right to modify these terms at any time. Changes will take effect immediately upon posting.'
            }
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>
            {validLang === 'it'
              ? 'Ultimo aggiornamento: Dicembre 2024'
              : validLang === 'es'
              ? 'Última actualización: Diciembre 2024'
              : 'Last updated: December 2024'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
