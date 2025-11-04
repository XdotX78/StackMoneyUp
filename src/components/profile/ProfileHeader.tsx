'use client';

// import { useRouter } from 'next/navigation'; // Reserved for future use
import Image from 'next/image';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { signOut } from '@/lib/auth';

export default function ProfileHeader({ user, lang }: { user: SupabaseUser; lang: string }) {
    // const router = useRouter(); // Reserved for future use
    const name =
        (user.user_metadata?.name as string) ||
        user.email?.split('@')[0] ||
        'User';

    const avatar =
        (user.user_metadata?.avatar_url as string) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=128`;

    return (
        <div className="flex items-center justify-between py-6 border-b border-neutral-800">
            <div className="flex items-center gap-6">
                {/* Avatar */}
                <Image
                    src={avatar}
                    alt="Profile avatar"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border border-neutral-700 shadow-md"
                />

                {/* User Info */}
                <div className="flex flex-col">
                    <div className="text-xl font-semibold text-white">{name}</div>
                    {user.email && (
                        <span className="text-sm text-neutral-400">{user.email}</span>
                    )}
                    <span className="text-xs text-neutral-500 mt-1">
                        ID: {user.id}
                    </span>
                </div>
            </div>

            {/* Logout Button */}
            <button
                onClick={async () => {
                    try {
                        await signOut();
                        // Hard redirect to home page
                        window.location.href = `/${lang}`;
                    } catch (error) {
                        console.error('Error signing out:', error);
                        // Still redirect even if signOut fails
                        window.location.href = `/${lang}`;
                    }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {lang === 'it' ? 'Logout' : 'Logout'}
            </button>
        </div>
    );
}
