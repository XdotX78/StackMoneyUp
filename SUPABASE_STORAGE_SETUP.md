# Supabase Storage Setup for Blog Images

## Create the `blog-images` Storage Bucket

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Create a bucket with the following settings:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ **Enable** (checked) - This allows public read access to images
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or leave empty to allow all)
6. Click **Create bucket**

### Option 2: Using SQL (Alternative)

If you prefer using SQL, run this in the Supabase SQL Editor:

```sql
-- Create the blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,  -- Public bucket for read access
  5242880,  -- 5 MB limit (in bytes)
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;
```

## Row Level Security (RLS) Policies

Even though the bucket is public, you should set up RLS policies for security:

### Allow Authenticated Users to Upload Images

```sql
-- Allow authenticated users to insert (upload) images
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');
```

### Allow Public Read Access

```sql
-- Allow public read access to blog images
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
```

### Allow Users to Delete Their Own Images (Optional)

```sql
-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete own blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' 
  AND split_part(name, '/', 1) = auth.uid()::text
);
```

### Allow Users to Update Their Own Images (Optional)

```sql
-- Allow users to update their own uploaded images
CREATE POLICY "Users can update own blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' 
  AND split_part(name, '/', 1) = auth.uid()::text
);
```

## Quick Setup Script

Run this complete SQL script to set up everything at once:

```sql
-- Create the blog-images storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (optional, for clean setup)
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own blog images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own blog images" ON storage.objects;

-- Create policies
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Users can delete own blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' 
  AND split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "Users can update own blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' 
  AND split_part(name, '/', 1) = auth.uid()::text
);
```

## File Structure

Images will be stored in the following structure within the `blog-images` bucket:
```
{user-id}/
  └── {timestamp}-{random-id}.{ext}
```

Example path within the bucket:
```
12345678-1234-1234-1234-123456789abc/
  └── 1704067200000-abc123.png
```

The full URL will be:
```
https://[your-project].supabase.co/storage/v1/object/public/blog-images/[user-id]/[filename]
```

## Notes

- **File size limit**: 5 MB per image (configurable in bucket settings)
- **Supported formats**: JPEG, PNG, GIF, WebP, SVG
- **Storage organization**: Images are organized by user ID for easy management
- **Public access**: Images are publicly accessible via URL (read-only)
- **Upload access**: Only authenticated users can upload images
- **Naming**: Files are named with timestamp + random ID to prevent conflicts

## Testing

After setting up the bucket:

1. Log in to your application
2. Go to the blog editor (create/edit post)
3. Click "Upload Image" in the toolbar
4. Select an image file
5. The image should upload and appear in the editor

If you encounter errors:
- Verify the bucket exists and is public
- Check that RLS policies are correctly set
- Ensure the user is authenticated
- Check browser console for specific error messages

