# 🚀 Complete Supabase & Authentication Setup Guide

**Last Updated:** January 2025  
**Project:** StackMoneyUp - Personal Finance Blog Platform

This comprehensive guide covers all aspects of setting up Supabase, Storage, Email Verification, and OAuth authentication.

---

## Table of Contents

1. [Initial Supabase Project Setup](#1-initial-supabase-project-setup)
2. [Storage Buckets Configuration](#2-storage-buckets-configuration)
3. [Email Verification Setup](#3-email-verification-setup)
4. [OAuth (Google) Configuration](#4-oauth-google-configuration)
5. [Testing & Troubleshooting](#5-testing--troubleshooting)

---

## 1. Initial Supabase Project Setup

### Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **New Project**
3. Fill in project details:
   - **Name:** StackMoneyUp (or your preferred name)
   - **Database Password:** Generate a strong password
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free (or Pro for production)
4. Wait for project initialization (~2 minutes)

### Get Project Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key:** `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

3. Add to your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Run Database Migrations

Navigate to **SQL Editor** in Supabase Dashboard and run these scripts in order:

1. **Initial Schema** (`migrations/001_initial_schema.sql`)
2. **Seed Data** (`migrations/002_seed_data.sql`)
3. **Comments Schema** (`migrations/003_comments_schema.sql`)
4. **Full-Text Search** (`migrations/004_fulltext_search.sql`)

---

## 2. Storage Buckets Configuration

### 2.1. Avatars Bucket

**Purpose:** User profile avatars

#### Via Dashboard (Recommended)

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Create bucket:
   - **Name:** `avatars`
   - **Public bucket:** ✅ Enable
   - **File size limit:** 2 MB
   - **Allowed MIME types:** `image/*`

#### Via SQL (Alternative)

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,  -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
```

#### RLS Policies for Avatars

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
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

### 2.2. Blog Images Bucket

**Purpose:** Blog post cover images and content images

#### Via Dashboard

1. Go to **Storage**
2. Click **New bucket**
3. Create bucket:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ Enable
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/*`

#### Via SQL

```sql
-- Create blog-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;
```

#### RLS Policies for Blog Images

```sql
-- Allow authenticated users to upload blog images
CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow public read access
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' 
  AND split_part(name, '/', 1) = auth.uid()::text
);

-- Allow users to update their own images
CREATE POLICY "Users can update own blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' 
  AND split_part(name, '/', 1) = auth.uid()::text
);
```

#### File Organization

Images are stored with this structure:
```
{user-id}/{timestamp}-{random-id}.{ext}

Example:
blog-images/
  └── 12345678-1234-1234-1234-123456789abc/
      └── 1704067200000-abc123.png
```

Full URL format:
```
https://[project-ref].supabase.co/storage/v1/object/public/blog-images/[user-id]/[filename]
```

---

## 3. Email Verification Setup

### 3.1. Enable Email Confirmation

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, ensure:
   - ✅ **Enable email confirmations** is checked
   - ✅ **Secure email change** is enabled

### 3.2. Configure Email Templates

Navigate to **Authentication** → **Email Templates**

#### Template Variables

Supabase provides these variables:
- `{{ .ConfirmationURL }}` - Confirmation link
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL
- `{{ .Token }}` - Confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .RedirectTo }}` - Redirect URL after confirmation
- `{{ .Year }}` - Current year

---

#### Confirm Signup Template

**Subject:**
```
Confirm your StackMoneyUp account
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">StackMoneyUp</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827; margin-top: 0;">Confirm your email address</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Thanks for signing up for StackMoneyUp! To complete your registration, please confirm your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Confirm Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #6b7280; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
      {{ .ConfirmationURL }}
    </p>
    
    <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      If you didn't create an account with StackMoneyUp, you can safely ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>© {{ .Year }} StackMoneyUp. All rights reserved.</p>
  </div>
</body>
</html>
```

**Plain Text Body:**
```
Confirm your StackMoneyUp account

Thanks for signing up for StackMoneyUp! To complete your registration, please confirm your email address by visiting this link:

{{ .ConfirmationURL }}

If you didn't create an account with StackMoneyUp, you can safely ignore this email.

© {{ .Year }} StackMoneyUp. All rights reserved.
```

---

#### Reset Password Template

**Subject:**
```
Reset your StackMoneyUp password
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">StackMoneyUp</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827; margin-top: 0;">Reset your password</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      You requested to reset your password for your StackMoneyUp account. Click the button below to set a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #6b7280; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
      {{ .ConfirmationURL }}
    </p>
    
    <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>© {{ .Year }} StackMoneyUp. All rights reserved.</p>
  </div>
</body>
</html>
```

---

### 3.3. SMTP Configuration

#### Using Supabase Default SMTP (Development)
- Free tier: 3 emails/hour per user
- Good for testing
- No configuration needed

#### Custom SMTP (Production - Recommended)

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your provider:
   - **Host:** Your SMTP server
   - **Port:** 587 (TLS) or 465 (SSL)
   - **Username:** SMTP username
   - **Password:** SMTP password
   - **Sender email:** noreply@yourdomain.com
   - **Sender name:** StackMoneyUp

**Recommended SMTP Providers:**
- [SendGrid](https://sendgrid.com)
- [Mailgun](https://www.mailgun.com)
- [AWS SES](https://aws.amazon.com/ses/)
- [Postmark](https://postmarkapp.com)
- [Resend](https://resend.com)

---

## 4. OAuth (Google) Configuration

### 4.1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name:** StackMoneyUp
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - **Authorized redirect URIs:**
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     ```
7. Copy **Client ID** and **Client Secret**

### 4.2. Supabase OAuth Configuration

1. Go to **Authentication** → **Providers**
2. Find and enable **Google**
3. Enter credentials:
   - **Client ID:** (from Google)
   - **Client Secret:** (from Google)
4. Configure redirect URLs:
   
   **Site URL:**
   ```
   http://localhost:3000  (development)
   https://yourdomain.com  (production)
   ```
   
   **Redirect URLs (add all):**
   ```
   http://localhost:3000/**
   http://localhost:3000/en/auth/callback
   http://localhost:3000/it/auth/callback
   https://yourdomain.com/**
   https://yourdomain.com/en/auth/callback
   https://yourdomain.com/it/auth/callback
   ```

### 4.3. OAuth Flow

```
┌─────────────┐
│ Login Page  │  User clicks "Sign in with Google"
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Google OAuth    │  User authorizes application
│ Consent Screen  │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│ /auth/callback       │  Exchange code for session
│ (exchange code)      │  Create/update user profile
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│ Dashboard    │  User redirected
└──────────────┘
```

The callback route (`src/app/[lang]/auth/callback/route.ts`) handles:
1. Code exchange for session
2. Profile creation (via trigger or fallback)
3. Language-aware redirect to dashboard

---

## 5. Testing & Troubleshooting

### 5.1. Test Storage Buckets

**Test Avatar Upload:**
1. Log in to the application
2. Go to Profile page
3. Click "Upload Avatar"
4. Select an image (< 2MB)
5. Verify image appears

**Test Blog Image Upload:**
1. Log in as editor/admin
2. Go to Create Post
3. Click image upload in editor
4. Select an image (< 5MB)
5. Verify image inserts in editor

### 5.2. Test Email Verification

**Test Signup Email:**
1. Sign up with a new email
2. Check inbox (and spam folder)
3. Click confirmation link
4. Verify redirect to dashboard
5. Check `email_confirmed_at` in database

**Test Password Reset:**
1. Go to "Forgot Password"
2. Enter email address
3. Check inbox for reset email
4. Click reset link
5. Enter new password
6. Verify login works

### 5.3. Test OAuth

**Test Google Sign-In:**
1. Navigate to `/en/login`
2. Click "Sign in with Google"
3. Complete Google authorization
4. Verify redirect to dashboard
5. Check profile created in database

---

### Common Issues

#### Storage: "Unable to upload"
**Solutions:**
- Verify bucket exists and is public
- Check RLS policies are created
- Ensure user is authenticated
- Check file size limits
- Verify MIME type is allowed

#### Email: "Emails not sending"
**Solutions:**
- Check spam/junk folder
- Verify SMTP settings
- Check Supabase logs for errors
- Verify email confirmation is enabled
- Check rate limits (free tier)

#### OAuth: "redirect_uri_mismatch"
**Solutions:**
- Add correct redirect URI in Google Console:
  `https://[project-ref].supabase.co/auth/v1/callback`
- Add domain wildcard in Supabase:
  `https://yourdomain.com/**`
- Check for typos in URLs
- Ensure protocol matches (http vs https)

#### OAuth: "Profile not created"
**Solutions:**
- Verify `handle_new_user()` trigger exists
- Check Supabase logs
- Callback route has fallback profile creation
- Verify profiles table RLS allows inserts

---

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all secrets
3. **Enable RLS** on all tables
4. **HTTPS only** in production
5. **Rotate OAuth credentials** regularly
6. **Monitor email deliverability** rates
7. **Set up SPF/DKIM** records for custom SMTP
8. **Keep file size limits** reasonable
9. **Validate file types** on both client and server
10. **Regular security audits** of RLS policies

---

## Quick Reference

**Storage Buckets:**
- `avatars` - User profile pictures (2MB max)
- `blog-images` - Blog post images (5MB max)

**Email Templates:**
- Confirm Signup
- Reset Password
- Magic Link (if enabled)
- Change Email

**OAuth Providers:**
- Google (configured)
- Others: Can be added following similar pattern

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [Email Best Practices](https://supabase.com/docs/guides/auth/auth-email-best-practices)

---

**Setup Complete!** 🎉

Your Supabase project is now fully configured with Storage, Email Verification, and OAuth authentication.

Next steps:
1. Run database migrations
2. Test all features
3. Configure production environment
4. Set up monitoring

Refer to `DATABASE_GUIDE.md` for database schema details and `DEPLOYMENT_GUIDE.md` for production deployment.



