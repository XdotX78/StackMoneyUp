'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';

function formatDate(d?: string | null, locale: 'it' | 'en' = 'en') {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleString(locale === 'it' ? 'it-IT' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="flex justify-between py-2 border-b border-gray-800">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-300 text-sm text-right break-all">{value || '-'}</span>
        </div>
    );
}

export default function ProfileDetails({
    user,
    lang,
}: {
    user: SupabaseUser;
    lang: string;
}) {
    const locale = lang === 'it' ? 'it' : 'en';

    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-[#151515] p-6 rounded-lg border border-gray-800">
                <div className="text-gray-200 font-semibold text-lg mb-4">
                    {locale === 'it' ? 'Informazioni Personali' : 'Personal Info'}
                </div>
                <InfoRow label={locale === 'it' ? 'Nome' : 'Full Name'} value={user.user_metadata?.name || null} />
                <InfoRow label="Email" value={user.email || null} />
                <InfoRow
                    label={locale === 'it' ? 'Email Verificata' : 'Email Verified'}
                    value={user.email_confirmed_at ? (locale === 'it' ? 'Sì' : 'Yes') : (locale === 'it' ? 'No' : 'No')}
                />
                <InfoRow label="User ID" value={user.id} />
            </div>

            {/* Account Details */}
            <div className="bg-[#151515] p-6 rounded-lg border border-gray-800">
                <div className="text-gray-200 font-semibold text-lg mb-4">
                    {locale === 'it' ? 'Dettagli Account' : 'Account Details'}
                </div>
                <InfoRow
                    label={locale === 'it' ? 'Creato il' : 'Created At'}
                    value={formatDate(user.created_at, locale)}
                />
                <InfoRow
                    label={locale === 'it' ? 'Ultimo Accesso' : 'Last Sign In'}
                    value={formatDate(user.last_sign_in_at, locale)}
                />
                <InfoRow
                    label="Provider"
                    value={(user.app_metadata?.provider as string) || 'email'}
                />
            </div>
        </div>
    );
}
