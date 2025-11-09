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
        {t.footer.privacy} {validLang === 'it' ? 'Policy' : validLang === 'es' ? 'Policy' : 'Policy'}
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '1. Introduzione' : validLang === 'es' ? '1. Introducción' : '1. Introduction'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'StackMoneyUp ("noi", "nostro", "nostra") rispetta la tua privacy. Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali quando visiti il nostro sito web.'
              : validLang === 'es'
              ? 'StackMoneyUp ("nosotros", "nuestro", "nuestra") respeta tu privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tu información personal cuando visitas nuestro sitio web.'
              : 'StackMoneyUp ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '2. Informazioni che Raccogliamo' : validLang === 'es' ? '2. Información que Recopilamos' : '2. Information We Collect'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Raccogliamo informazioni che fornisci volontariamente quando ti iscrivi, commenti o contatti. Questo può includere nome, email e contenuti che invii.'
              : validLang === 'es'
              ? 'Recopilamos información que proporcionas voluntariamente cuando te registras, comentas o contactas. Esto puede incluir nombre, correo electrónico y contenido que envíes.'
              : 'We collect information you voluntarily provide when you register, comment, or contact us. This may include name, email, and content you submit.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '3. Come Utilizziamo le Tue Informazioni' : validLang === 'es' ? '3. Cómo Utilizamos tu Información' : '3. How We Use Your Information'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Utilizziamo le tue informazioni per fornire, mantenere e migliorare i nostri servizi. Non vendiamo o condividiamo i tuoi dati personali con terze parti per scopi di marketing.'
              : validLang === 'es'
              ? 'Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios. No vendemos ni compartimos tus datos personales con terceros con fines de marketing.'
              : 'We use your information to provide, maintain, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '4. Cookie Policy' : validLang === 'es' ? '4. Política de Cookies' : '4. Cookie Policy'}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {validLang === 'it'
              ? 'Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti il nostro sito.'
              : validLang === 'es'
              ? 'Utilizamos cookies para mejorar tu experiencia en nuestro sitio. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio.'
              : 'We use cookies to enhance your experience on our site. Cookies are small text files that are stored on your device when you visit our website.'
            }
          </p>
          
          <h3 className="text-2xl font-bold mb-3 mt-6">
            {validLang === 'it' ? 'Tipi di Cookie Utilizzati:' : validLang === 'es' ? 'Tipos de Cookies que Utilizamos:' : 'Types of Cookies We Use:'}
          </h3>
          
          <div className="space-y-4 ml-4">
            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">
                {validLang === 'it' ? 'Cookie Essenziali (Sempre Attivi)' : validLang === 'es' ? 'Cookies Esenciales (Siempre Activas)' : 'Essential Cookies (Always Active)'}
              </h4>
              <p className="text-gray-700 mb-2">
                {validLang === 'it'
                  ? 'Necessari per il funzionamento del sito:'
                  : validLang === 'es'
                  ? 'Necesarias para el funcionamiento del sitio:'
                  : 'Required for the website to function:'
                }
              </p>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                <li>
                  <strong>sb-*-auth-token:</strong> {validLang === 'it' 
                    ? 'Cookie di autenticazione Supabase (sessione utente)' 
                    : validLang === 'es'
                    ? 'Cookie de autenticación Supabase (sesión de usuario)'
                    : 'Supabase authentication cookie (user session)'}
                </li>
                <li>
                  <strong>maintenance-auth:</strong> {validLang === 'it' 
                    ? 'Accesso in modalità manutenzione (7 giorni)' 
                    : validLang === 'es'
                    ? 'Acceso en modo mantenimiento (7 días)'
                    : 'Maintenance mode access (7 days)'}
                </li>
                <li>
                  <strong>cookie-consent:</strong> {validLang === 'it' 
                    ? 'Memorizza le tue preferenze sui cookie (1 anno)' 
                    : validLang === 'es'
                    ? 'Almacena tus preferencias de cookies (1 año)'
                    : 'Stores your cookie preferences (1 year)'}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">
                {validLang === 'it' ? 'Cookie Analitici (Opzionali)' : validLang === 'es' ? 'Cookies Analíticas (Opcionales)' : 'Analytics Cookies (Optional)'}
              </h4>
              <p className="text-gray-700">
                {validLang === 'it'
                  ? 'Ci aiutano a capire come i visitatori utilizzano il nostro sito raccogliendo informazioni in modo anonimo. Questi cookie possono essere disabilitati dalle tue preferenze.'
                  : validLang === 'es'
                  ? 'Nos ayudan a entender cómo los visitantes utilizan nuestro sitio recopilando información de forma anónima. Estas cookies pueden desactivarse desde tus preferencias.'
                  : 'Help us understand how visitors use our site by collecting information anonymously. These cookies can be disabled through your preferences.'
                }
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">
                {validLang === 'it' ? 'Cookie Marketing (Opzionali)' : validLang === 'es' ? 'Cookies de Marketing (Opcionales)' : 'Marketing Cookies (Optional)'}
              </h4>
              <p className="text-gray-700">
                {validLang === 'it'
                  ? 'Attualmente non utilizziamo cookie di marketing. Se dovessimo implementarli in futuro, richiederemo il tuo consenso esplicito.'
                  : validLang === 'es'
                  ? 'Actualmente no utilizamos cookies de marketing. Si las implementamos en el futuro, solicitaremos tu consentimiento explícito.'
                  : 'We do not currently use marketing cookies. If we implement them in the future, we will request your explicit consent.'
                }
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-3 mt-6">
            {validLang === 'it' ? 'Gestione dei Cookie' : validLang === 'es' ? 'Gestión de Cookies' : 'Managing Cookies'}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Puoi gestire le tue preferenze sui cookie in qualsiasi momento tramite il banner dei cookie che appare alla tua prima visita. Puoi anche modificare le impostazioni del tuo browser per bloccare i cookie, ma questo potrebbe limitare alcune funzionalità del sito.'
              : validLang === 'es'
              ? 'Puedes gestionar tus preferencias de cookies en cualquier momento a través del banner de cookies que aparece en tu primera visita. También puedes modificar la configuración de tu navegador para bloquear las cookies, pero esto puede limitar algunas funcionalidades del sitio.'
              : 'You can manage your cookie preferences at any time through the cookie banner that appears on your first visit. You can also change your browser settings to block cookies, but this may limit some website functionality.'
            }
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '5. I Tuoi Diritti (GDPR/CCPA)' : validLang === 'es' ? '5. Tus Derechos (GDPR/CCPA)' : '5. Your Rights (GDPR/CCPA)'}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            {validLang === 'it'
              ? 'Hai il diritto di:'
              : validLang === 'es'
              ? 'Tienes derecho a:'
              : 'You have the right to:'
            }
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>{validLang === 'it' ? 'Accedere ai tuoi dati personali' : validLang === 'es' ? 'Acceder a tus datos personales' : 'Access your personal data'}</li>
            <li>{validLang === 'it' ? 'Correggere dati inesatti' : validLang === 'es' ? 'Corregir datos inexactos' : 'Correct inaccurate data'}</li>
            <li>{validLang === 'it' ? 'Richiedere la cancellazione dei tuoi dati' : validLang === 'es' ? 'Solicitar la eliminación de tus datos' : 'Request deletion of your data'}</li>
            <li>{validLang === 'it' ? 'Opporti al trattamento dei tuoi dati' : validLang === 'es' ? 'Oponerte al procesamiento de tus datos' : 'Object to processing of your data'}</li>
            <li>{validLang === 'it' ? 'Portare i tuoi dati ad altro servizio' : validLang === 'es' ? 'Portar tus datos a otro servicio' : 'Port your data to another service'}</li>
            <li>{validLang === 'it' ? 'Revocare il consenso in qualsiasi momento' : validLang === 'es' ? 'Revocar el consentimiento en cualquier momento' : 'Withdraw consent at any time'}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">
            {validLang === 'it' ? '6. Contatti' : validLang === 'es' ? '6. Contacto' : '6. Contact Us'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {validLang === 'it'
              ? 'Per domande su questa Privacy Policy o per esercitare i tuoi diritti, puoi contattarci tramite la pagina Contatti.'
              : validLang === 'es'
              ? 'Para preguntas sobre esta Política de Privacidad o para ejercer tus derechos, puedes contactarnos a través de la página de Contacto.'
              : 'For questions about this Privacy Policy or to exercise your rights, you can contact us through the Contact page.'
            }
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>
            {validLang === 'it'
              ? 'Ultimo aggiornamento: Gennaio 2025'
              : validLang === 'es'
              ? 'Última actualización: Enero 2025'
              : 'Last updated: January 2025'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
