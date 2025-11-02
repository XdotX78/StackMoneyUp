# Supabase Setup Guide

## Storage Bucket Setup for Avatars

To enable avatar uploads, you need to create a storage bucket in Supabase:

### Steps:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Create a bucket named: `avatars`
5. Make it **Public** (or set up proper RLS policies)
6. Set up policies (if using RLS):
   - **Insert Policy**: Allow authenticated users to upload
   - **Select Policy**: Allow public read access
   - **Update Policy**: Allow users to update their own avatars
   - **Delete Policy**: Allow users to delete their own avatars

### RLS Policy Examples (if needed):

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow public read access
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### Alternative: Public Bucket

If you want to keep it simple, you can make the bucket public:
1. In Storage settings, toggle **Public bucket**
2. This allows anyone to read, but uploads still require authentication

---

## Google OAuth Setup

To enable Google sign-in:

1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Add redirect URLs:
   - `http://localhost:3000/**` (development)
   - `https://yourdomain.com/**` (production)

---

## Email Configuration

To send confirmation emails:

1. Go to **Authentication** → **Settings**
2. Configure email templates if needed
3. Verify your SMTP settings (or use Supabase's default)

---

## Notes

- The `avatars` bucket must be created before avatar uploads will work
- Avatar uploads are limited to 2MB
- Passwords must be at least 6 characters
- All features require proper Supabase configuration

