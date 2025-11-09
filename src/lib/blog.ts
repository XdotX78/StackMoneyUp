/**
 * Blog post utilities for Supabase
 * Handles CRUD operations for blog posts and tags
 */

import { supabase } from './supabaseClient'
import { getCurrentUser } from './auth'
import type { BlogPost, BlogPostSummary, Tag } from '@/types/blog'
// import { generateSlug } from './utils' // Reserved for future use

/**
 * Database row type for blog_posts table
 */
interface BlogPostRow {
  id: string
  slug: string
  title_en: string
  title_it: string
  title_es: string
  excerpt_en: string
  excerpt_it: string
  excerpt_es: string
  content_en: string
  content_it: string
  content_es: string
  cover_image: string | null
  category: string
  tags: string[]
  published: boolean
  featured: boolean
  read_time: number | null
  created_at: string
  updated_at: string
  published_at: string | null
  scheduled_at: string | null
  author_id: string
}

/**
 * Transform database row to BlogPost type
 */
function transformBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: {
      en: row.title_en,
      it: row.title_it,
      es: row.title_es,
    },
    excerpt: {
      en: row.excerpt_en,
      it: row.excerpt_it,
      es: row.excerpt_es,
    },
    content: {
      en: row.content_en,
      it: row.content_it,
      es: row.content_es,
    },
    cover_image: row.cover_image || undefined,
    category: row.category,
    tags: row.tags || [],
    published: row.published,
    featured: row.featured,
    read_time: row.read_time || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
    published_at: row.published_at || undefined,
    author_id: row.author_id,
  }
}

/**
 * Transform database row to BlogPostSummary type
 */
function transformBlogPostSummary(row: BlogPostRow): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: {
      en: row.title_en,
      it: row.title_it,
      es: row.title_es,
    },
    excerpt: {
      en: row.excerpt_en,
      it: row.excerpt_it,
      es: row.excerpt_es,
    },
    cover_image: row.cover_image || undefined,
    category: row.category,
    tags: row.tags || [],
    read_time: row.read_time || undefined,
    published_at: row.published_at || undefined,
  }
}

/**
 * Ensure tags exist in tags table (create if they don't exist)
 */
async function ensureTagsExist(tagSlugs: string[]): Promise<void> {
  if (tagSlugs.length === 0) return

  // Get existing tags
  const { data: existingTags } = await supabase
    .from('tags')
    .select('slug')
    .in('slug', tagSlugs)

  const existingSlugs = new Set(existingTags?.map(t => t.slug) || [])
  const missingSlugs = tagSlugs.filter(slug => !existingSlugs.has(slug))

  // Create missing tags
  if (missingSlugs.length > 0) {
    const newTags = missingSlugs.map(slug => ({
      slug,
      name_en: slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      name_it: slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
    }))

    const { error } = await supabase
      .from('tags')
      .insert(newTags)

    if (error) {
      console.warn('Failed to create some tags:', error)
      // Don't throw - continue with post creation
    }
  }
}

/**
 * Get all published blog posts (for public blog page)
 */
export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) throw new Error(error.message)
  if (!data) return []

  return data.map(transformBlogPostSummary)
}

/**
 * Search blog posts using PostgreSQL full-text search
 */
export async function searchPosts(
  query: string,
  options?: {
    category?: string;
    tags?: string[];
    limit?: number;
  }
): Promise<BlogPostSummary[]> {
  if (!query || query.trim().length === 0) {
    // If no query, return all published posts (fallback to regular function)
    return getPublishedPosts();
  }

  const searchQuery = query.trim();
  const categoryFilter = options?.category && options.category !== 'all' ? options.category : null;
  const tagsFilter = options?.tags && options.tags.length > 0 ? options.tags : null;
  const limit = options?.limit || 100;

  // Use Supabase RPC to call the search function
  const { data, error } = await supabase.rpc('search_blog_posts', {
    search_query: searchQuery,
    lang_filter: null, // Can be extended later for language-specific search
    category_filter: categoryFilter,
    tags_filter: tagsFilter,
  });

  if (error) {
    // If full-text search fails, fallback to basic filtering
    console.warn('Full-text search failed, falling back to basic search:', error);
    const allPosts = await getPublishedPosts();
    return filterPostsBasic(allPosts, searchQuery, categoryFilter, tagsFilter).slice(0, limit);
  }

  if (!data) return []

  // Transform the search results
  return data.slice(0, limit).map((row: BlogPostRow) => transformBlogPostSummary(row))
}

/**
 * Basic client-side filtering (fallback when full-text search is not available)
 */
function filterPostsBasic(
  posts: BlogPostSummary[],
  query: string,
  category: string | null,
  tags: string[] | null
): BlogPostSummary[] {
  let filtered = [...posts];
  const queryLower = query.toLowerCase();

  // Filter by category
  if (category) {
    filtered = filtered.filter(post => post.category === category);
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    filtered = filtered.filter(post => 
      post.tags.some(tag => tags.includes(tag))
    );
  }

  // Filter by search query
  filtered = filtered.filter(post => {
    const titleEn = post.title.en.toLowerCase();
    const titleIt = post.title.it.toLowerCase();
    const excerptEn = post.excerpt.en.toLowerCase();
    const excerptIt = post.excerpt.it.toLowerCase();
    const categoryLower = post.category.toLowerCase();
    const tagsLower = post.tags.join(' ').toLowerCase();

    return titleEn.includes(queryLower) ||
           titleIt.includes(queryLower) ||
           excerptEn.includes(queryLower) ||
           excerptIt.includes(queryLower) ||
           categoryLower.includes(queryLower) ||
           tagsLower.includes(queryLower);
  });

  return filtered;
}

/**
 * Get all blog posts (for dashboard - includes drafts)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  // Check if user is editor/admin
  const isEditor = user.role === 'admin' || user.role === 'editor'

  let query = supabase
    .from('blog_posts')
    .select('*')

  // Regular users can only see their own posts
  if (!isEditor) {
    query = query.eq('author_id', user.id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  if (!data) return []

  return data.map(transformBlogPost)
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(error.message)
  }

  return data ? transformBlogPost(data) : null
}

/**
 * Get a single blog post by ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  // Check permissions
  const isEditor = user.role === 'admin' || user.role === 'editor'
  if (!isEditor && data.author_id !== user.id) {
    throw new Error('You do not have permission to view this post')
  }

  return data ? transformBlogPost(data) : null
}

/**
 * Create a new blog post
 */
export async function createPost(postData: {
  slug: string
  title_en: string
  title_it: string
  title_es: string
  excerpt_en: string
  excerpt_it: string
  excerpt_es: string
  content_en: string
  content_it: string
  content_es: string
  category: string
  tags: string[]
  cover_image?: string
  published?: boolean
  featured?: boolean
  read_time?: number
  scheduled_at?: string
}): Promise<BlogPost> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  // Ensure tags exist
  await ensureTagsExist(postData.tags)

  // Prepare database row
  const dbRow: Partial<BlogPostRow> = {
    slug: postData.slug,
    title_en: postData.title_en,
    title_it: postData.title_it,
    title_es: postData.title_es,
    excerpt_en: postData.excerpt_en,
    excerpt_it: postData.excerpt_it,
    excerpt_es: postData.excerpt_es,
    content_en: postData.content_en,
    content_it: postData.content_it,
    content_es: postData.content_es,
    category: postData.category,
    tags: postData.tags,
    author_id: user.id,
    published: postData.published || false,
    featured: postData.featured || false,
  }

  if (postData.cover_image) dbRow.cover_image = postData.cover_image
  if (postData.read_time) dbRow.read_time = postData.read_time
  if (postData.scheduled_at) dbRow.scheduled_at = postData.scheduled_at

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(dbRow)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return transformBlogPost(data)
}

/**
 * Update an existing blog post
 */
export async function updatePost(
  id: string,
  updates: Partial<{
    slug: string
    title_en: string
    title_it: string
    title_es: string
    excerpt_en: string
    excerpt_it: string
    excerpt_es: string
    content_en: string
    content_it: string
    content_es: string
    category: string
    tags: string[]
    cover_image: string
    published: boolean
    featured: boolean
    read_time: number
    scheduled_at: string
  }>
): Promise<BlogPost> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  // Get existing post to check permissions
  const existingPost = await getPostById(id)
  if (!existingPost) throw new Error('Post not found')

  const isEditor = user.role === 'admin' || user.role === 'editor'
  if (!isEditor && existingPost.author_id !== user.id) {
    throw new Error('You do not have permission to edit this post')
  }

  // Ensure new tags exist
  if (updates.tags) {
    await ensureTagsExist(updates.tags)
  }

  // Prepare update object
  const dbUpdates: Partial<BlogPostRow> = {}

  if (updates.slug !== undefined) dbUpdates.slug = updates.slug
  if (updates.title_en !== undefined) dbUpdates.title_en = updates.title_en
  if (updates.title_it !== undefined) dbUpdates.title_it = updates.title_it
  if (updates.excerpt_en !== undefined) dbUpdates.excerpt_en = updates.excerpt_en
  if (updates.excerpt_it !== undefined) dbUpdates.excerpt_it = updates.excerpt_it
  if (updates.content_en !== undefined) dbUpdates.content_en = updates.content_en
  if (updates.content_it !== undefined) dbUpdates.content_it = updates.content_it
  if (updates.category !== undefined) dbUpdates.category = updates.category
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags
  if (updates.cover_image !== undefined) dbUpdates.cover_image = updates.cover_image
  if (updates.published !== undefined) dbUpdates.published = updates.published
  if (updates.featured !== undefined) dbUpdates.featured = updates.featured
  if (updates.read_time !== undefined) dbUpdates.read_time = updates.read_time
  if (updates.scheduled_at !== undefined) dbUpdates.scheduled_at = updates.scheduled_at

  const { data, error } = await supabase
    .from('blog_posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return transformBlogPost(data)
}

/**
 * Delete a blog post
 */
export async function deletePost(id: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  // Get existing post to check permissions
  const existingPost = await getPostById(id)
  if (!existingPost) throw new Error('Post not found')

  const isEditor = user.role === 'admin' || user.role === 'editor'
  if (!isEditor && existingPost.author_id !== user.id) {
    throw new Error('You do not have permission to delete this post')
  }

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name_en', { ascending: true })

  if (error) throw new Error(error.message)
  if (!data) return []

  return data.map(row => ({
    id: row.id,
    slug: row.slug,
    name: {
      en: row.name_en,
      it: row.name_it,
    },
    description: row.description_en || row.description_it
      ? {
          en: row.description_en || '',
          it: row.description_it || '',
        }
      : undefined,
    post_count: row.post_count,
    created_at: row.created_at,
  }))
}

/**
 * Update tag (rename or update description)
 */
export async function updateTag(
  id: string,
  updates: Partial<{
    slug: string
    name_en: string
    name_it: string
    description_en: string
    description_it: string
  }>
): Promise<Tag> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  const isEditor = user.role === 'admin' || user.role === 'editor'
  if (!isEditor) {
    throw new Error('You must be an editor or admin to update tags')
  }

  const dbUpdates: Partial<{ slug: string; name_en: string; name_it: string; description_en: string; description_it: string }> = {}
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug
  if (updates.name_en !== undefined) dbUpdates.name_en = updates.name_en
  if (updates.name_it !== undefined) dbUpdates.name_it = updates.name_it
  if (updates.description_en !== undefined) dbUpdates.description_en = updates.description_en
  if (updates.description_it !== undefined) dbUpdates.description_it = updates.description_it

  const { data, error } = await supabase
    .from('tags')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return {
    id: data.id,
    slug: data.slug,
    name: { en: data.name_en, it: data.name_it },
    description: data.description_en || data.description_it
      ? { en: data.description_en || '', it: data.description_it || '' }
      : undefined,
    post_count: data.post_count,
    created_at: data.created_at,
  }
}

/**
 * Delete a tag (and remove it from all posts)
 */
export async function deleteTag(slug: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) throw new Error('You must be logged in')

  const isEditor = user.role === 'admin' || user.role === 'editor'
  if (!isEditor) {
    throw new Error('You must be an editor or admin to delete tags')
  }

  // Remove tag from all posts that use it
  const { data: postsWithTag } = await supabase
    .from('blog_posts')
    .select('id, tags')
    .contains('tags', [slug])

  if (postsWithTag && postsWithTag.length > 0) {
    // Update each post to remove the tag
    for (const post of postsWithTag) {
      const updatedTags = (post.tags || []).filter((t: string) => t !== slug)
      await supabase
        .from('blog_posts')
        .update({ tags: updatedTags })
        .eq('id', post.id)
    }
  }

  // Delete the tag
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('slug', slug)

  if (error) throw new Error(error.message)
}

/**
 * Increment post views (analytics)
 */
export async function incrementPostViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_views', { post_slug: slug })
  
  // If RPC doesn't exist, use direct update
  if (error) {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('slug', slug)
      .single()

    if (post) {
      await supabase
        .from('blog_posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('slug', slug)
    }
  }
}

