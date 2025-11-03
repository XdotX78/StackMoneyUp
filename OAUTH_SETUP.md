# 🔐 OAuth Setup Guide

**Last Updated:** January 2025

This guide explains how to configure OAuth (Google) authentication for StackMoneyUp.

---

## Prerequisites

1. Supabase project set up
2. Google Cloud Console account
3. Google OAuth credentials (Client ID and Client Secret)

---

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
   Replace `your-project-ref` with your Supabase project reference.

7. Copy the **Client ID** and **Client Secret**

---

## Step 2: Configure OAuth in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to expand
4. Enable the Google provider
5. Enter your **Client ID** and **Client Secret** from Google Cloud Console
6. **Important:** Configure redirect URLs:

   **Site URL:**
   ```
   https://yourdomain.com
   ```
   (or `http://localhost:3000` for development)

   **Redirect URLs (add all environments):**
   ```
   http://localhost:3000/**
   https://yourdomain.com/**
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

   The callback URL format should be:
   ```
   https://yourdomain.com/{lang}/auth/callback
   ```
   Where `{lang}` is `en` or `it`.

   Examples:
   - `http://localhost:3000/en/auth/callback`
   - `http://localhost:3000/it/auth/callback`
   - `https://yourdomain.com/en/auth/callback`
   - `https://yourdomain.com/it/auth/callback`

---

## Step 3: How It Works

### Authentication Flow

1. User clicks "Sign in with Google" on login page
2. User is redirected to Google OAuth consent screen
3. User authorizes the application
4. Google redirects to: `/{lang}/auth/callback?code={auth_code}&lang={lang}`
5. The callback route (`src/app/[lang]/auth/callback/route.ts`) exchanges the code for a session
6. User profile is created/updated in `profiles` table (via trigger)
7. User is redirected to dashboard

### Code Flow

```
┌─────────────┐
│ Login Page  │
│ (Google)    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Google OAuth    │
│ Consent Screen  │
└──────┬──────────┘
       │
       ▼
┌──────────────────────┐
│ /auth/callback       │
│ (exchange code)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│ Dashboard    │
└──────────────┘
```

---

## Step 4: Testing

### Development

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/en/login`
3. Click "Sign in with Google"
4. Complete OAuth flow
5. Verify you're redirected to `/en/dashboard`

### Production

1. Ensure all redirect URLs are configured in:
   - Google Cloud Console
   - Supabase Dashboard
2. Test the flow on your production domain
3. Check that users are created in the `profiles` table with role `'user'`

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URL in your request doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Check that you've added the correct redirect URI in Google Cloud Console:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
2. Ensure Supabase redirect URLs include your domain:
   ```
   https://yourdomain.com/**
   ```

### Error: "Invalid OAuth credentials"

**Problem:** Client ID or Client Secret is incorrect.

**Solution:**
1. Verify credentials in Supabase Dashboard
2. Ensure no extra spaces or characters
3. Regenerate credentials in Google Cloud Console if needed

### User not redirected to dashboard

**Problem:** Callback route not working correctly.

**Solution:**
1. Check `src/app/[lang]/auth/callback/route.ts` exists
2. Verify the route is accessible
3. Check browser console for errors
4. Verify language parameter is being passed correctly

### Profile not created after OAuth

**Problem:** Database trigger not firing.

**Solution:**
1. Verify `handle_new_user()` trigger exists in database
2. Check Supabase logs for errors
3. The callback route includes a fallback profile creation if trigger fails

---

## Security Notes

1. **Never commit OAuth credentials** to version control
2. **Use environment variables** for sensitive data
3. **HTTPS required** in production
4. **Validate redirect URLs** to prevent open redirects
5. **Regularly rotate** OAuth credentials

---

## Additional Providers

To add more OAuth providers (GitHub, Facebook, etc.):

1. Configure provider in Supabase Dashboard
2. Add provider-specific function in `src/lib/auth.ts`:
   ```typescript
   export async function signInWithGitHub(lang: string = 'en') {
     const redirectUrl = `${window.location.origin}/${lang}/auth/callback?lang=${lang}`
     const { error } = await supabase.auth.signInWithOAuth({
       provider: 'github',
       options: { redirectTo: redirectUrl },
     })
     if (error) throw new Error(error.message)
   }
   ```
3. Add button in login page
4. Configure redirect URLs in provider's dashboard

---

## Environment Variables

No additional environment variables needed for OAuth. The setup uses:
- `NEXT_PUBLIC_SUPABASE_URL` (already configured)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already configured)

OAuth credentials are stored in Supabase Dashboard, not in your code.

---

## References

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

