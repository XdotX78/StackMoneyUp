'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { updateProfile, uploadAvatar } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/ui';

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
    setUser,
}: {
    user: SupabaseUser;
    lang: string;
    setUser: (user: SupabaseUser | null) => void;
}) {
    const locale = lang === 'it' ? 'it' : 'en';
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: (user.user_metadata?.name as string) || '',
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateProfile({ name: formData.name });
            // Refresh user data
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
            setIsEditing(false);
            toast.success(locale === 'it' ? 'Profilo aggiornato!' : 'Profile updated!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : (locale === 'it' ? 'Errore nell\'aggiornamento' : 'Update failed'));
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error(locale === 'it' ? 'Seleziona un file immagine' : 'Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error(locale === 'it' ? 'Immagine troppo grande (max 2MB)' : 'Image too large (max 2MB)');
            return;
        }

        setUploading(true);
        try {
            const avatarUrl = await uploadAvatar(file, user.id);
            await updateProfile({ avatar_url: avatarUrl });
            // Refresh user data
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUser(data.user);
            }
            toast.success(locale === 'it' ? 'Avatar aggiornato!' : 'Avatar updated!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : (locale === 'it' ? 'Errore nel caricamento' : 'Upload failed'));
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-[#151515] p-6 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-200 font-semibold text-lg">
                        {locale === 'it' ? 'Informazioni Personali' : 'Personal Info'}
                    </div>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                        >
                            {locale === 'it' ? 'Modifica' : 'Edit'}
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <Input
                            label={locale === 'it' ? 'Nome Completo' : 'Full Name'}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={locale === 'it' ? 'Il tuo nome' : 'Your name'}
                            className="bg-[#1a1a1a] border-gray-700 text-white"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                {locale === 'it' ? 'Avatar' : 'Avatar'}
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src={
                                            (user.user_metadata?.avatar_url as string) ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || user.email || 'User')}&background=0D9488&color=fff&size=128`
                                        }
                                        alt="Avatar"
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-full border border-gray-700"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                        className="hidden"
                                        id="avatar-upload"
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading
                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            }`}
                                    >
                                        {uploading
                                            ? (locale === 'it' ? 'Caricamento...' : 'Uploading...')
                                            : (locale === 'it' ? 'Carica Avatar' : 'Upload Avatar')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading
                                    ? (locale === 'it' ? 'Salvataggio...' : 'Saving...')
                                    : (locale === 'it' ? 'Salva' : 'Save')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: (user.user_metadata?.name as string) || '' });
                                }}
                                disabled={loading}
                            >
                                {locale === 'it' ? 'Annulla' : 'Cancel'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <InfoRow label={locale === 'it' ? 'Nome' : 'Full Name'} value={user.user_metadata?.name || null} />
                        <InfoRow label="Email" value={user.email || null} />
                        <InfoRow
                            label={locale === 'it' ? 'Email Verificata' : 'Email Verified'}
                            value={user.email_confirmed_at ? (locale === 'it' ? 'Sì' : 'Yes') : (locale === 'it' ? 'No' : 'No')}
                        />
                        <InfoRow label="User ID" value={user.id} />
                    </>
                )}
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
