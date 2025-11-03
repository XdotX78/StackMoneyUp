/**
 * Supabase Storage utilities for blog images
 */

import { supabase } from './supabaseClient'
import { getCurrentUser } from './auth'

/**
 * Upload blog image to Supabase Storage
 * @param file - The image file to upload
 * @returns Public URL of the uploaded image
 */
export async function uploadBlogImage(file: File): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 5MB for blog images)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB')
  }

  // Get current user to organize images by user
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('You must be logged in to upload images')
  }

  // Create unique filename
  const fileExt = file.name.split('.').pop()
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 9)
  const fileName = `${timestamp}-${randomId}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false // Don't overwrite existing files
    })

  if (error) {
    // If file already exists, try with a new name
    if (error.message.includes('already exists')) {
      const newFileName = `${timestamp}-${randomId}-${Date.now()}.${fileExt}`
      const newFilePath = `${user.id}/${newFileName}`
      
      const { data: retryData, error: retryError } = await supabase.storage
        .from('blog-images')
        .upload(newFilePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (retryError) throw new Error(retryError.message)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(newFilePath)

      return publicUrl
    }
    
    throw new Error(error.message)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * List all blog images uploaded by the current user
 * @returns Array of image objects with URL and metadata
 */
export async function listBlogImages(): Promise<Array<{ url: string; path: string; name: string; created_at: string }>> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('You must be logged in to view images')
  }

  // List all files in the user's folder
  const { data, error } = await supabase.storage
    .from('blog-images')
    .list(user.id, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    // If folder doesn't exist, return empty array
    if (error.message.includes('not found')) {
      return []
    }
    throw new Error(error.message)
  }

  if (!data || data.length === 0) {
    return []
  }

  // Get public URLs for all images
  const images = data.map(file => {
    const filePath = `${user.id}/${file.name}`
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath,
      name: file.name,
      created_at: file.created_at
    }
  })

  return images
}

/**
 * Delete a blog image from Supabase Storage
 * @param imagePath - The path to the image (e.g., "user-id/filename.jpg")
 */
export async function deleteBlogImage(imagePath: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('You must be logged in to delete images')
  }

  // Verify the image belongs to the current user
  if (!imagePath.startsWith(user.id + '/')) {
    throw new Error('You can only delete your own images')
  }

  const { error } = await supabase.storage
    .from('blog-images')
    .remove([imagePath])

  if (error) throw new Error(error.message)
}

