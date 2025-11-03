'use client';

import Link from 'next/link';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';

interface AuthButtonProps {
  lang: string;
}

export default function AuthButton({ lang }: AuthButtonProps) {
  const { user, loading } = useAuthContext();
  const { canManagePosts } = useRole();

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
    // Regular users see "Profile", editors/admins see "Dashboard"
    const isEditorOrAdmin = canManagePosts();
    return (
      <Link
        href={isEditorOrAdmin ? `/${lang}/dashboard` : `/${lang}/dashboard/profile`}
        className="bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all text-sm"
        style={{ color: '#ffffff' }}
      >
        {isEditorOrAdmin ? 'Dashboard' : 'Profile'}
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

