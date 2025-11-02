'use client';

import { useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
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
    }, [router, lang]);

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="flex min-h-screen bg-black text-white">
            <ProfileSidebar lang={lang} />
            <main className="flex-1 p-6">
                {user && <ProfileHeader user={user} />}
                {user && <ProfileDetails user={user} lang={lang} />}
            </main>
        </div>
    );
}
