'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { getAllUsersAction, updateUserRoleAction, getUserStatsAction, type UserProfile } from '@/app/actions/users';
import { getTranslations, isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language } from '@/types/blog';
import type { UserRole } from '@/lib/auth';
import toast from 'react-hot-toast';

interface UsersPageProps {
  params: Promise<{ lang: string }>;
}

export default function UsersPage({ params }: UsersPageProps) {
  const resolvedParams = use(params);
  const paramLang = resolvedParams.lang;
  const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
  const t = getTranslations(validLang);

  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const { isAdmin, loading: roleLoading } = useRole();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, editors: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Auth and role check
  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (!user) {
      router.push(`/${validLang}/login`);
      return;
    }

    if (!isAdmin()) {
      router.push(`/${validLang}/dashboard`);
      toast.error(validLang === 'it' ? 'Accesso negato' : 'Access denied');
      return;
    }
  }, [validLang, router, user, authLoading, roleLoading, isAdmin]);

  // Load users data
  useEffect(() => {
    if (authLoading || roleLoading || !user || !isAdmin()) return;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const [usersData, statsData] = await Promise.all([
          getAllUsersAction(),
          getUserStatsAction(),
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error(validLang === 'it' ? 'Errore nel caricamento utenti' : 'Error loading users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [validLang, user, authLoading, roleLoading]); // Removed isAdmin - it's a function and causes infinite loop

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingUserId(userId);
      await updateUserRoleAction(userId, newRole);
      
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      // Update stats
      const [statsData] = await Promise.all([getUserStatsAction()]);
      setStats(statsData);

      toast.success(
        validLang === 'it' ? 'Ruolo aggiornato con successo' : 'Role updated successfully'
      );
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(validLang === 'it' ? 'Errore nell\'aggiornamento' : 'Error updating role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return validLang === 'it' ? 'Mai' : 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString(validLang === 'it' ? 'it-IT' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (authLoading || roleLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {validLang === 'it' ? 'Gestione Utenti' : 'User Management'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {validLang === 'it'
              ? 'Visualizza e gestisci i ruoli degli utenti registrati'
              : 'View and manage registered user roles'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {validLang === 'it' ? 'Totale Utenti' : 'Total Users'}
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {validLang === 'it' ? 'Amministratori' : 'Admins'}
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-600">{stats.admins}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {validLang === 'it' ? 'Editori' : 'Editors'}
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.editors}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {validLang === 'it' ? 'Utenti Base' : 'Regular Users'}
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.users}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Utente' : 'User'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Email' : 'Email'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Ruolo' : 'Role'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Registrato' : 'Registered'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Ultimo Accesso' : 'Last Sign In'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Stato' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {validLang === 'it' ? 'Azioni' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((userProfile) => (
                  <tr key={userProfile.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {userProfile.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={userProfile.avatar_url}
                              alt={userProfile.name || 'User'}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {(userProfile.name || userProfile.email).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userProfile.name || validLang === 'it' ? 'Senza nome' : 'No name'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{userProfile.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          userProfile.role
                        )}`}
                      >
                        {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(userProfile.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(userProfile.last_sign_in_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userProfile.email_confirmed ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {validLang === 'it' ? 'Verificato' : 'Verified'}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          {validLang === 'it' ? 'In Attesa' : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={userProfile.role}
                        onChange={(e) => handleRoleChange(userProfile.id, e.target.value as UserRole)}
                        disabled={updatingUserId === userProfile.id || userProfile.id === user?.id}
                        className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">{validLang === 'it' ? 'Utente' : 'User'}</option>
                        <option value="editor">{validLang === 'it' ? 'Editore' : 'Editor'}</option>
                        <option value="admin">{validLang === 'it' ? 'Admin' : 'Admin'}</option>
                      </select>
                      {userProfile.id === user?.id && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {validLang === 'it' ? '(Tu)' : '(You)'}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {validLang === 'it' ? 'Nessun utente trovato' : 'No users found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

