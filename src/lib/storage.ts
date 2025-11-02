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

