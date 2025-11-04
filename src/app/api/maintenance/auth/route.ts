import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getClientIdentifier } from '@/lib/rateLimit';

const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD || '';
const MAINTENANCE_COOKIE_NAME = 'maintenance-auth';
const MAINTENANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function handlePost(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!MAINTENANCE_PASSWORD) {
      return NextResponse.json(
        { error: 'Maintenance mode is not configured properly' },
        { status: 500 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Compare passwords securely using timing-safe comparison
    const isValid = password === MAINTENANCE_PASSWORD;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set(MAINTENANCE_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAINTENANCE_COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Apply rate limiting: 5 requests per 15 minutes
export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const { rateLimit } = await import('@/lib/rateLimit');
  
  const rateLimitResult = rateLimit(identifier, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many maintenance login attempts. Please try again later.',
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: rateLimitResult.message },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  }

  const response = await handlePost(request);
  
  // Add rate limit headers to response
  response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

  return response;
}

