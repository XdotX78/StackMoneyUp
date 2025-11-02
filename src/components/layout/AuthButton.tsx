'use client';

import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';

interface AuthButtonProps {
  lang: string;
}

export default function AuthButton({ lang }: AuthButtonProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <Link
        href={`/${lang}/login`}
        className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all text-sm"
      >
        Login
      </Link>
    );
  }

  if (user) {
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

