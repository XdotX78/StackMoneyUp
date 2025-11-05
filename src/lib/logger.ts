/**
 * Error logging utility with optional Sentry integration
 * Logs to console in development, sends to Sentry in production (if configured)
 */

// type LogLevel = 'error' | 'warn' | 'info' | 'debug'; // Reserved for future use

interface LogContext {
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';

// Lazy-load Sentry only if DSN is configured
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sentry: any = null;

async function getSentry() {
  // ⚠️ SENTRY TEMPORARILY DISABLED
  // Webpack tries to resolve this module at compile time even in try-catch
  // This causes "Module not found" warnings on every compilation
  // 
  // TODO: Uncomment when Sentry is installed:
  // npm install @sentry/nextjs
  // Then configure following PRODUCTION_MONITORING_SETUP.md
  
  /* 
  if (!sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      // Dynamic import to avoid build errors if Sentry is not installed
      // @ts-expect-error - Sentry is optional dependency
      sentry = await import('@sentry/nextjs');
    } catch {
      // Sentry not installed - this is optional
      console.warn('Sentry not installed. Install with: npm install @sentry/nextjs');
    }
  }
  */
  
  return sentry;
}

/**
 * Log an error message
 */
export async function logError(message: string, error?: Error | unknown, context?: LogContext): Promise<void> {
  // Always log to console in development
  if (isDevelopment) {
    console.error(`[Error] ${message}`, error || '', context || '');
  }

  // Send to Sentry in production if configured
  if (!isDevelopment && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = await getSentry();
    if (Sentry) {
      const errorObj = error instanceof Error ? error : new Error(String(error || message));
      Sentry.captureException(errorObj, {
        tags: context as Record<string, string>,
        extra: context,
        contexts: {
          message: { message },
        },
      });
    }
  }
}

/**
 * Log an error message (synchronous version for use in React components)
 */
export function logErrorSync(message: string, error?: Error | unknown, context?: LogContext): void {
  if (isDevelopment) {
    console.error(`[Error] ${message}`, error || '', context || '');
  }

  // In production, queue for async sending
  if (!isDevelopment && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Use setTimeout to avoid blocking
    setTimeout(() => {
      logError(message, error, context).catch(() => {
        // Silently fail if Sentry is not available
      });
    }, 0);
  }
}

/**
 * Log a warning message
 */
export function logWarning(message: string, context?: LogContext): void {
  if (!isDevelopment) return;
  console.warn(`[Warning] ${message}`, context || '');
}

/**
 * Log an info message
 */
export function logInfo(message: string, context?: LogContext): void {
  if (!isDevelopment) return;
  console.log(`[Info] ${message}`, context || '');
}

/**
 * Log a debug message
 */
export function logDebug(message: string, context?: LogContext): void {
  if (!isDevelopment) return;
  console.debug(`[Debug] ${message}`, context || '');
}

/**
 * Generic logger function
 */
export const logger = {
  error: logErrorSync, // Use sync version for easy use in components
  errorAsync: logError, // Use async version for API routes
  warn: logWarning,
  info: logInfo,
  debug: logDebug,
};

