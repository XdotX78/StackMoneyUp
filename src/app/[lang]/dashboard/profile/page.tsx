// ✅ percorso: src/app/[lang]/dashboard/profile/page.tsx

import ProfileLayout from '@/components/profile/ProfileLayout';

interface ProfilePageProps {
  params: Promise<{ lang: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { lang } = await params;
  const validLang = lang === 'it' ? 'it' : 'en';

  return <ProfileLayout lang={validLang} />;
}
