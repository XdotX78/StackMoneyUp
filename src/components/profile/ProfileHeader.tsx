'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function ProfileHeader({ user }: { user: SupabaseUser }) {
    const name =
        (user.user_metadata?.name as string) ||
        user.email?.split('@')[0] ||
        'User';

    const avatar =
        (user.user_metadata?.avatar_url as string) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=128`;

    return (
        <div className="flex items-center gap-6 py-6 border-b border-neutral-800">
            {/* Avatar */}
            <img
                src={avatar}
                alt="Profile avatar"
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
    );
}
