/**
 * Comment utilities for Supabase
 * Handles CRUD operations for blog post comments
 */

import { supabase } from './supabaseClient'
import { getCurrentUser } from './auth'
import type { Comment, CommentFormData } from '@/types/blog'

/**
 * Profile data from Supabase join
 */
interface ProfileData {
  full_name: string | null
  id: string
}

/**
 * Database row type for comments table with profile join
 */
interface CommentRow {
  id: string
  post_id: string
  parent_id: string | null
  author_id: string
  author_name?: string
  author_full_name?: string
  author_avatar?: string | null
  content: string
  approved: boolean
  edited: boolean
  created_at: string
  updated_at: string
  reply_count?: number
  profiles?: ProfileData | null
}

/**
 * Transform database row to Comment type
 */
function transformComment(row: CommentRow): Comment {
  return {
    id: row.id,
    post_id: row.post_id,
    parent_id: row.parent_id || null,
    author_id: row.author_id,
    author_name: row.author_name || row.author_full_name || 'Anonymous',
    author_avatar: row.author_avatar || null,
    content: row.content,
    approved: row.approved,
    edited: row.edited,
    created_at: row.created_at,
    updated_at: row.updated_at,
    reply_count: row.reply_count || 0,
  }
}

/**
 * Get all approved comments for a post (with nested replies)
 */
export async function getPostComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:profiles!comments_author_id_fkey (
        full_name,
        id
      )
    `)
    .eq('post_id', postId)
    .eq('approved', true)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return []

  // Transform comments - get user email from profiles or use placeholder
  // Note: We can't access auth.users directly, so we use profile data
  const comments = data.map((row: CommentRow) => {
    const profile = row.profiles
    // For now, use profile name or generate from ID
    // In production, you might want to store display name in profiles
    const authorName = profile?.full_name || `User ${row.author_id.substring(0, 8)}`
    return transformComment({
      ...row,
      author_name: authorName,
      author_avatar: null, // Can be added to profiles table later
    })
  })

  // Build nested structure
  const commentMap = new Map<string, Comment>()
  const rootComments: Comment[] = []

  // First pass: create map and identify root comments
  comments.forEach(comment => {
    comment.replies = []
    commentMap.set(comment.id, comment)
    
    if (!comment.parent_id) {
      rootComments.push(comment)
    }
  })

  // Second pass: build tree structure
  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(comment)
        parent.reply_count = (parent.reply_count || 0) + 1
      }
    }
  })

  // Sort root comments by created_at (newest first)
  rootComments.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  // Sort replies by created_at (oldest first - chronological)
  rootComments.forEach(comment => {
    if (comment.replies) {
      comment.replies.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }
  })

  return rootComments
}

/**
 * Get all comments for a post (including unapproved - for moderation)
 */
export async function getAllPostComments(postId: string): Promise<Comment[]> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  // Check if user is admin/editor
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw new Error('Permission denied')
  }

  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:profiles!comments_author_id_fkey (
        full_name,
        id
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  if (!data) return []

  return data.map((row: CommentRow) => {
    const profile = row.profiles
    const authorName = profile?.full_name || `User ${row.author_id.substring(0, 8)}`
    return transformComment({
      ...row,
      author_name: authorName,
      author_avatar: null,
    })
  })
}

/**
 * Create a new comment
 */
export async function createComment(
  postId: string,
  commentData: CommentFormData
): Promise<Comment> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      parent_id: commentData.parent_id || null,
      author_id: user.id,
      content: commentData.content.trim(),
      approved: true, // Auto-approve for now (can be changed to false for moderation)
    })
    .select(`
      *,
      profiles:profiles!comments_author_id_fkey (
        full_name,
        id
      )
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const profile = data.profiles as ProfileData | null | undefined
  const authorName = profile?.full_name || user.name || `User ${user.id.substring(0, 8)}`

  return transformComment({
    ...data,
    author_name: authorName,
    author_avatar: user.avatar_url || null,
  })
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<Comment> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  // First, verify the comment exists and user owns it
  const { data: existingComment, error: fetchError } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  if (fetchError || !existingComment) {
    throw new Error('Comment not found')
  }

  if (existingComment.author_id !== user.id) {
    throw new Error('Permission denied')
  }

  const { data, error } = await supabase
    .from('comments')
    .update({
      content: content.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .select(`
      *,
      profiles:profiles!comments_author_id_fkey (
        full_name,
        id
      )
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const profile = data.profiles as ProfileData | null | undefined
  const authorName = profile?.full_name || user.name || `User ${user.id.substring(0, 8)}`

  return transformComment({
    ...data,
    author_name: authorName,
    author_avatar: user.avatar_url || null,
  })
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }

  // Check if user owns the comment or is admin/editor
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single()

  if (fetchError || !comment) {
    throw new Error('Comment not found')
  }

  // Allow deletion if user owns it or is admin/editor
  if (comment.author_id !== user.id && user.role !== 'admin' && user.role !== 'editor') {
    throw new Error('Permission denied')
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Moderate comment (approve/reject)
 */
export async function moderateComment(
  commentId: string,
  approved: boolean
): Promise<Comment> {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
    throw new Error('Permission denied')
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ approved })
    .eq('id', commentId)
    .select(`
      *,
      profiles:profiles!comments_author_id_fkey (
        full_name,
        id
      )
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const profile = data.profiles as ProfileData | null | undefined
  const authorName = profile?.full_name || `User ${data.author_id.substring(0, 8)}`

  return transformComment({
    ...data,
    author_name: authorName,
    author_avatar: null,
  })
}

/**
 * Get comment count for a post
 */
export async function getCommentCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId)
    .eq('approved', true)

  if (error) {
    throw new Error(error.message)
  }

  return count || 0
}

