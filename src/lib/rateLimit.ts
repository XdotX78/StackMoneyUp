/**
 * Rate limiting utility for API routes
 * Uses in-memory store (for production, consider Redis)
 */

import type { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (cleans up expired entries periodically)
const store: RateLimitStore = {};
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, CLEANUP_INTERVAL);

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  message?: string;
}

/**
 * Rate limit middleware for Next.js API routes
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowMs || 15 * 60 * 1000; // Default: 15 minutes
  const max = options.max || 100; // Default: 100 requests
  const resetTime = now + windowMs;

  // Get or create entry for this identifier
  const entry = store[identifier];

  if (!entry || entry.resetTime < now) {
    // New entry or expired, create new window
    store[identifier] = {
      count: 1,
      resetTime,
    };

    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset: Math.floor(resetTime / 1000),
    };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: Math.floor(entry.resetTime / 1000),
      message: options.message || 'Too many requests, please try again later.',
    };
  }

  return {
    success: true,
    limit: max,
    remaining: max - entry.count,
    reset: Math.floor(entry.resetTime / 1000),
  };
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(request: Request | NextRequest): string {
  // Handle both Request and NextRequest types
  const headers = 'headers' in request ? request.headers : new Headers();
  
  // Try to get IP from headers (for production behind proxy)
  const forwarded = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  // In production, you might want to use user ID if authenticated
  // For now, we use IP address
  return `ip:${ip}`;
}

/**
 * Rate limit handler for Next.js API routes
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  options: RateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  }
) {
  return async (request: Request): Promise<Response> => {
    const identifier = getClientIdentifier(request);
    const result = rateLimit(identifier, options);

    // Add rate limit headers
    const headers = new Headers({
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: result.message || 'Too many requests',
        }),
        {
          status: 429,
          headers: {
            ...Object.fromEntries(headers),
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Call the handler
    const response = await handler(request);

    // Add rate limit headers to response
    result.limit.toString();
    result.remaining.toString();
    result.reset.toString();
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  };
}

