'use client';

import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import ProfileSidebar from './ProfileSidebar';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';

interface ProfileLayoutProps {
    lang: string;
}

export default function ProfileLayout({ lang }: ProfileLayoutProps) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push(`/${lang}/login`);
                return;
            }
            setUser(data.user);
            setLoading(false);
        };

        getUser();

        // Listen for auth state changes (logout, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                // User logged out - redirect immediately
                window.location.href = `/${lang}`;
            } else {
                setUser(session.user);
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, lang]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen bg-neutral-950 text-white text-lg">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-neutral-950 text-white">
            {/* Sidebar */}
            <ProfileSidebar lang={lang} />

            {/* Main content */}
            <main className="flex-1 px-6 py-6 lg:px-10">
                <div className="max-w-6xl mx-auto space-y-6">
                    {user && <ProfileHeader user={user} lang={lang} />}
                    {user && <ProfileDetails user={user} lang={lang} setUser={setUser} />}
                </div>
            </main>
        </div>
    );
}
