'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import type { Language } from '@/types/blog';

interface NewsletterSignupProps {
  lang: Language;
  variant?: 'default' | 'compact';
}

export default function NewsletterSignup({ lang, variant = 'default' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Coming soon - just show success message
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? 'w-full' : 'bg-gray-900 rounded-lg p-6 border border-gray-800'}>
      <div className={isCompact ? 'space-y-3' : 'space-y-4'}>
        <div>
          <h3 className={`font-bold text-white ${isCompact ? 'text-lg' : 'text-xl mb-2'}`}>
            {lang === 'it' ? 'Newsletter' : 'Newsletter'}
          </h3>
          <p className={`text-gray-400 ${isCompact ? 'text-sm' : ''}`}>
            {lang === 'it'
              ? 'Ricevi le ultime strategie finanziarie direttamente nella tua inbox. Coming soon!'
              : 'Get the latest financial strategies delivered to your inbox. Coming soon!'}
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
            <p className="text-emerald-400 text-sm font-medium">
              {lang === 'it'
                ? '✅ Grazie! Ti avviseremo quando la newsletter sarà disponibile.'
                : '✅ Thanks! We\'ll notify you when the newsletter is available.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={isCompact ? 'flex gap-2' : 'space-y-3'}>
            <Input
              type="email"
              placeholder={lang === 'it' ? 'La tua email' : 'Your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={isCompact ? 'flex-1' : 'w-full'}
            />
            <Button
              type="submit"
              variant="primary"
              className={isCompact ? 'whitespace-nowrap' : 'w-full'}
            >
              {lang === 'it' ? 'Notificami' : 'Notify Me'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}


