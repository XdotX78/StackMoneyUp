'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent, Button, Input, Badge, LoadingSkeleton, TableSkeleton } from '@/components/ui';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { getAllTags, deleteTag, updateTag } from '@/lib/blog';
import { isValidLanguage, getDefaultLanguage } from '@/lib/translations';
import type { Language, Tag } from '@/types/blog';

interface TagsPageProps {
  params: Promise<{ lang: string }>;
}

export default function TagsPage({ params }: TagsPageProps) {
  const { lang: paramLang } = use(params);
  const validLang = isValidLanguage(paramLang) ? (paramLang as Language) : getDefaultLanguage();
  const [lang, setLang] = useState<Language>(validLang);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();
  const { canManagePosts, loading: roleLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    setLang(validLang);

    // Wait for both auth and role to finish loading
    if (authLoading || roleLoading) return;

    if (!user) {
      router.push(`/${validLang}/login`);
      return;
    }

    // Check if user has editor/admin role (only after role is loaded)
    if (!canManagePosts()) {
      router.push(`/${validLang}/dashboard`);
    }
  }, [validLang, router, user, authLoading, roleLoading, canManagePosts]);

  useEffect(() => {
    if (user && !authLoading) {
      loadTags();
    }
  }, [user, authLoading]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const fetchedTags = await getAllTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    
    const query = searchQuery.toLowerCase();
    return tags.filter(tag => 
      tag.name[lang]?.toLowerCase().includes(query) || 
      tag.name.en?.toLowerCase().includes(query) ||
      tag.slug.toLowerCase().includes(query)
    );
  }, [tags, searchQuery, lang]);

  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => b.post_count - a.post_count);
  }, [filteredTags]);

  const handleDeleteTag = async (tagSlug: string) => {
    const tag = tags.find(t => t.slug === tagSlug);
    if (!tag) return;

    const tagName = tag.name[lang] || tag.name.en || tagSlug;
    if (!confirm(
      lang === 'it'
        ? `Sei sicuro di voler eliminare il tag "${tagName}"? Verrà rimosso da tutti i post.`
        : `Are you sure you want to delete the tag "${tagName}"? It will be removed from all posts.`
    )) {
      return;
    }

    try {
      await deleteTag(tagSlug);
      toast.success(
        lang === 'it'
          ? 'Tag eliminato!'
          : 'Tag deleted!'
      );
      loadTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete tag');
    }
  };

  const handleRenameTag = async (tagId: string, oldSlug: string, newSlug: string, newNameEn: string, newNameIt: string) => {
    if (!newSlug.trim() || newSlug === oldSlug) return;

    // Check if slug already exists
    if (tags.find(t => t.slug === newSlug && t.id !== tagId)) {
      toast.error(
        lang === 'it'
          ? 'Un tag con questo slug esiste già'
          : 'A tag with this slug already exists'
      );
      return;
    }

    try {
      await updateTag(tagId, {
        slug: newSlug,
        name_en: newNameEn,
        name_it: newNameIt,
      });
      toast.success(
        lang === 'it'
          ? 'Tag rinominato!'
          : 'Tag renamed!'
      );
      loadTags();
    } catch (error) {
      console.error('Error updating tag:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update tag');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="space-y-6">
          <LoadingSkeleton variant="text" width="200px" height="32px" />
          <TableSkeleton rows={5} cols={3} />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalTags = tags.length;
  const totalUsage = tags.reduce((sum, tag) => sum + tag.post_count, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">
            {lang === 'it' ? 'Gestione Tag' : 'Tag Management'}
          </h1>
          <p className="text-gray-600">
            {lang === 'it'
              ? 'Gestisci e organizza i tag utilizzati nei tuoi post'
              : 'Manage and organize tags used in your posts'
            }
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Totale Tag' : 'Total Tags'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">{totalTags}</p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Tag unici' : 'Unique tags'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Utilizzi Totali' : 'Total Usage'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">{totalUsage}</p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Utilizzi nei post' : 'Tag usages in posts'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-700">
              {lang === 'it' ? 'Media per Tag' : 'Avg per Tag'}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-emerald-600">
              {totalTags > 0 ? (totalUsage / totalTags).toFixed(1) : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'it' ? 'Post per tag' : 'Posts per tag'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'it' ? 'Cerca tag...' : 'Search tags...'}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Tags List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {lang === 'it' ? 'Tutti i Tag' : 'All Tags'}
            </h2>
            <span className="text-sm text-gray-500">
              {sortedTags.length} {sortedTags.length === 1
                ? (lang === 'it' ? 'tag' : 'tag')
                : (lang === 'it' ? 'tag' : 'tags')
              }
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {sortedTags.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <svg 
                className="w-24 h-24 mx-auto mb-4 text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="mb-4 text-lg">
                {searchQuery
                  ? (lang === 'it' ? 'Nessun tag trovato' : 'No tags found')
                  : (lang === 'it' ? 'Nessun tag ancora creato' : 'No tags created yet')
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  lang={lang}
                  onDelete={handleDeleteTag}
                  onRename={handleRenameTag}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface TagRowProps {
  tag: Tag;
  lang: Language;
  onDelete: (slug: string) => void;
  onRename: (tagId: string, oldSlug: string, newSlug: string, newNameEn: string, newNameIt: string) => void;
}

function TagRow({ tag, lang, onDelete, onRename }: TagRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValueEn, setEditValueEn] = useState(tag.name.en);
  const [editValueIt, setEditValueIt] = useState(tag.name.it);
  const [editSlug, setEditSlug] = useState(tag.slug);

  const handleSave = () => {
    const newSlug = editSlug.trim().toLowerCase().replace(/\s+/g, '-');
    if (newSlug && (newSlug !== tag.slug || editValueEn.trim() !== tag.name.en || editValueIt.trim() !== tag.name.it)) {
      onRename(tag.id, tag.slug, newSlug, editValueEn.trim(), editValueIt.trim());
    }
    setIsEditing(false);
    setEditValueEn(tag.name.en);
    setEditValueIt(tag.name.it);
    setEditSlug(tag.slug);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValueEn(tag.name.en);
    setEditValueIt(tag.name.it);
    setEditSlug(tag.slug);
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Slug (e.g., investing)"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Name (EN)"
                value={editValueEn}
                onChange={(e) => setEditValueEn(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Name (IT)"
                value={editValueIt}
                onChange={(e) => setEditValueIt(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                {lang === 'it' ? 'Salva' : 'Save'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                {lang === 'it' ? 'Annulla' : 'Cancel'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Badge variant="default" size="lg" className="text-base px-3 py-1">
              {tag.name[lang] || tag.name.en}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">{tag.post_count}</span>
              <span>
                {tag.post_count === 1
                  ? (lang === 'it' ? 'post' : 'post')
                  : (lang === 'it' ? 'post' : 'posts')
                }
              </span>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {lang === 'it' ? 'Rinomina' : 'Rename'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(tag.slug)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {lang === 'it' ? 'Elimina' : 'Delete'}
          </Button>
        </div>
      )}
    </div>
  );
}

