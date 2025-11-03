import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * OAuth callback handler
 * Handles redirects from OAuth providers (Google, etc.)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const lang = requestUrl.searchParams.get('lang') || 'en';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/${lang}/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  // Exchange code for session
  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(
        new URL(
          `/${lang}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`,
          requestUrl.origin
        )
      );
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Ensure profile exists (should be created by trigger, but check just in case)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        // Create profile if it doesn't exist (shouldn't happen with trigger, but safety check)
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role: 'user',
            full_name: user.user_metadata?.name || user.user_metadata?.full_name || '',
          });
      }

      // Redirect to dashboard on success
      return NextResponse.redirect(new URL(`/${lang}/dashboard`, requestUrl.origin));
    }
  }

  // Fallback redirect to login
  return NextResponse.redirect(new URL(`/${lang}/login`, requestUrl.origin));
}

