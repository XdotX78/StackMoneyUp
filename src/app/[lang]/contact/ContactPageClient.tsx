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
      newErrors.name = lang === 'it' ? 'Il nome è obbligatorio' : 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = lang === 'it' ? 'L\'email è obbligatoria' : 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = lang === 'it' ? 'Email non valida' : 'Invalid email address';
    }

    if (!message.trim()) {
      newErrors.message = lang === 'it' ? 'Il messaggio è obbligatorio' : 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = lang === 'it' ? 'Il messaggio deve contenere almeno 10 caratteri' : 'Message must be at least 10 characters';
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
          {lang === 'it' ? 'Contatti' : 'Contact'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {lang === 'it'
            ? 'Hai domande o suggerimenti? Saremmo felici di sentirti.'
            : 'Have questions or suggestions? We\'d love to hear from you.'
          }
        </p>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 text-green-700 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
              {lang === 'it' 
                ? 'Messaggio inviato con successo! Ti risponderemo presto.'
                : 'Message sent successfully! We\'ll get back to you soon.'
              }
            </span>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-lg">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {lang === 'it' ? 'Nome' : 'Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.name 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
              placeholder={lang === 'it' ? 'Il tuo nome' : 'Your name'}
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {lang === 'it' ? 'Email' : 'Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
              placeholder={lang === 'it' ? 'tua@email.com' : 'your@email.com'}
              disabled={loading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {lang === 'it' ? 'Messaggio' : 'Message'}
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
              }}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.message 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
              placeholder={lang === 'it' ? 'Scrivi il tuo messaggio qui...' : 'Write your message here...'}
              disabled={loading}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            disabled={loading}
          >
            {loading 
              ? (lang === 'it' ? 'Invio in corso...' : 'Sending...')
              : (lang === 'it' ? 'Invia Messaggio' : 'Send Message')
            }
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            {lang === 'it' 
              ? 'Ti risponderemo entro 24-48 ore.'
              : 'We\'ll get back to you within 24-48 hours.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

