/**
 * Simple error logging utility
 * Logs to console in development, can be extended for production error tracking
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log an error message
 */
export function logError(message: string, error?: Error | unknown, context?: LogContext): void {
  if (!isDevelopment) {
    // In production, you could send to error tracking service (Sentry, Logtail, etc.)
    // For now, we silently handle it
    return;
  }

  console.error(`[Error] ${message}`, error || '', context || '');
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
  error: logError,
  warn: logWarning,
  info: logInfo,
  debug: logDebug,
};

