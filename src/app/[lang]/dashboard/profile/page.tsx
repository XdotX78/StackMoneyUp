// src/app/[lang]/dashboard/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ProfileLayout from '@/components/profile/ProfileLayout';
import type { Language } from '@/types/blog';

interface ProfilePageProps {
    params: Promise<{ lang: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
    const [lang, setLang] = useState<Language>('en');

    useEffect(() => {
        params.then(({ lang: paramLang }) => {
            const validLang = paramLang === 'it' ? 'it' : 'en';
            setLang(validLang);
        });
    }, [params]);

    return <ProfileLayout lang={lang} />;
}
