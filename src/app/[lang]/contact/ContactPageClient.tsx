'use client';

import { useState, useEffect } from 'react';
import { isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import { Button } from '@/components/ui';
import { isValidEmail } from '@/lib/utils';
import type { Language } from '@/types/blog';

interface ContactPageClientProps {
  params: Promise<{ lang: string }>;
}

export default function ContactPageClient({ params }: ContactPageClientProps) {
  const [lang, setLang] = useState<Language>('en');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    params.then(({ lang: paramLang }) => {
      const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
      setLang(validLang);
    });
  }, [params]);

  // Translations available for future use

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = lang === 'it' ? 'Il nome è obbligatorio' : lang === 'es' ? 'El nombre es obligatorio' : 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = lang === 'it' ? 'L\'email è obbligatoria' : lang === 'es' ? 'El correo es obligatorio' : 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = lang === 'it' ? 'Email non valida' : lang === 'es' ? 'Correo electrónico inválido' : 'Invalid email address';
    }

    if (!message.trim()) {
      newErrors.message = lang === 'it' ? 'Il messaggio è obbligatorio' : lang === 'es' ? 'El mensaje es obligatorio' : 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = lang === 'it' ? 'Il messaggio deve contenere almeno 10 caratteri' : lang === 'es' ? 'El mensaje debe tener al menos 10 caracteres' : 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // TODO: Replace with actual API call to Supabase or email service
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // TODO: Send to Supabase or email service
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setErrors({
        submit: lang === 'it' 
          ? 'Errore nell\'invio del messaggio. Per favore riprova.'
          : lang === 'es'
          ? 'Error al enviar el mensaje. Por favor intenta de nuevo.'
          : 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl lg:text-6xl font-black mb-4">
          {lang === 'it' ? 'Contatti' : lang === 'es' ? 'Contacto' : 'Contact'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {lang === 'it'
            ? 'Hai domande o suggerimenti? Saremmo felici di sentirti.'
            : lang === 'es'
            ? '¿Tienes preguntas o sugerencias? Nos encantaría saber de ti.'
            : 'Have questions or suggestions? We\'d love to hear from you.'
          }
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>
            {lang === 'it' 
              ? 'Messaggio inviato con successo! Ti risponderemo presto.'
              : lang === 'es'
              ? '¡Mensaje enviado con éxito! Te responderemos pronto.'
              : 'Message sent successfully! We\'ll get back to you soon.'
            }
          </span>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {lang === 'it' ? 'Nome' : lang === 'es' ? 'Nombre' : 'Name'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
            placeholder={lang === 'it' ? 'Il tuo nome' : lang === 'es' ? 'Tu nombre' : 'Your name'}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {lang === 'it' ? 'Email' : lang === 'es' ? 'Correo Electrónico' : 'Email'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
            placeholder={lang === 'it' ? 'tua@email.com' : lang === 'es' ? 'tu@email.com' : 'your@email.com'}
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {lang === 'it' ? 'Messaggio' : lang === 'es' ? 'Mensaje' : 'Message'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 resize-none ${
              errors.message
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
            }`}
            placeholder={lang === 'it' ? 'Scrivi il tuo messaggio qui...' : lang === 'es' ? 'Escribe tu mensaje aquí...' : 'Write your message here...'}
            disabled={loading}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading 
            ? (lang === 'it' ? 'Invio in corso...' : lang === 'es' ? 'Enviando...' : 'Sending...')
            : (lang === 'it' ? 'Invia Messaggio' : lang === 'es' ? 'Enviar Mensaje' : 'Send Message')
          }
        </Button>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            {lang === 'it' 
              ? 'Ti risponderemo entro 24-48 ore.'
              : lang === 'es'
              ? 'Te responderemos dentro de 24-48 horas.'
              : 'We\'ll get back to you within 24-48 hours.'
            }
          </p>
        </div>
      </form>
    </div>
  );
}
