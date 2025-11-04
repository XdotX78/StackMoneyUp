/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 */

import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXT_PUBLIC_SITE_URL || 'default-secret-change-in-production';
const CSRF_TOKEN_LENGTH = 32;
// const CSRF_TOKEN_MAX_AGE = 60 * 60 * 1000; // 1 hour - Reserved for future use

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  return token;
}

/**
 * Create a signed CSRF token (token + signature)
 */
export function createCsrfToken(): {
  token: string;
  signed: string;
} {
  const token = generateCsrfToken();
  const signed = signToken(token);
  return { token, signed };
}

/**
 * Sign a token with HMAC
 */
function signToken(token: string): string {
  const hmac = createHmac('sha256', CSRF_SECRET);
  hmac.update(token);
  const signature = hmac.digest('hex');
  return `${token}.${signature}`;
}

/**
 * Verify a signed CSRF token
 */
export function verifyCsrfToken(signedToken: string): boolean {
  try {
    const [token, signature] = signedToken.split('.');
    if (!token || !signature) {
      return false;
    }

    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(token)
      .digest('hex');

    // Timing-safe comparison
    return timingSafeEqual(signature, expectedSignature);
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison (prevents timing attacks)
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Get CSRF token from request (cookie or header)
 */
export function getCsrfTokenFromRequest(request: Request): string | null {
  // Try header first (for API requests)
  const headerToken = request.headers.get('X-CSRF-Token');
  if (headerToken) {
    return headerToken;
  }

  // Try cookie (for form submissions)
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return cookies['csrf-token'] || null;
  }

  return null;
}

/**
 * Validate CSRF token from request
 */
export function validateCsrfToken(request: Request): boolean {
  const token = getCsrfTokenFromRequest(request);
  if (!token) {
    return false;
  }

  return verifyCsrfToken(token);
}

