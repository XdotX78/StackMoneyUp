'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui';

interface AuthButtonProps {
  lang: string;
}

export default function AuthButton({ lang }: AuthButtonProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAuthenticated());
  }, []);

  // Don't render on server
  if (!mounted) {
    return (
      <Link
        href={`/${lang}/login`}
        className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all text-sm"
      >
        Login
      </Link>
    );
  }

  if (authenticated) {
    return (
      <Link
        href={`/${lang}/dashboard`}
        className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all text-sm"
        style={{ color: '#ffffff' }}
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}/login`}
      className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all text-sm"
    >
      Login
    </Link>
  );
}

