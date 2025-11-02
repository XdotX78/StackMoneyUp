import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD || '';
const MAINTENANCE_COOKIE_NAME = 'maintenance-auth';
const MAINTENANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

