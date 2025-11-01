import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';

interface PrivacyPageClientProps {
  params: Promise<{ lang: string }>;
}

export default async function PrivacyPageClient({ params }: PrivacyPageClientProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? (lang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl lg:text-6xl font-black mb-8">
        {t.footer.privacy} {validLang === 'it' ? 'Policy' : 'Policy'}
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '1. Introduzione' : '1. Introduction'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'StackMoneyUp ("noi", "nostro", "nostra") rispetta la tua privacy. Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali quando visiti il nostro sito web.'
              : 'StackMoneyUp ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '2. Informazioni che Raccogliamo' : '2. Information We Collect'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Raccogliamo informazioni che fornisci volontariamente quando ti iscrivi, commenti o contatti. Questo può includere nome, email e contenuti che invii.'
              : 'We collect information you voluntarily provide when you register, comment, or contact us. This may include name, email, and content you submit.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '3. Come Utilizziamo le Tue Informazioni' : '3. How We Use Your Information'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Utilizziamo le tue informazioni per fornire, mantenere e migliorare i nostri servizi. Non vendiamo o condividiamo i tuoi dati personali con terze parti per scopi di marketing.'
              : 'We use your information to provide, maintain, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '4. Contatti' : '4. Contact Us'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Per domande su questa Privacy Policy, puoi contattarci tramite la pagina Contatti.'
              : 'For questions about this Privacy Policy, you can contact us through the Contact page.'
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

