# Production Monitoring Setup Guide

This guide explains how to set up error tracking and monitoring for StackMoneyUp in production.

## Overview

Production monitoring helps you:
- Track errors and exceptions in real-time
- Monitor application performance
- Get alerted when issues occur
- Understand user behavior and issues

## Recommended Solutions

### Option 1: Sentry (Recommended)

**Pros:**
- Comprehensive error tracking
- Performance monitoring
- Source maps support
- Free tier available (5,000 events/month)
- Excellent React/Next.js integration

**Setup Steps:**

1. **Create a Sentry account:**
   - Go to https://sentry.io/signup/
   - Create a new project (select Next.js)
   - Copy your DSN

2. **Install Sentry:**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Initialize Sentry:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
   This will create `sentry.client.config.ts` and `sentry.server.config.ts`

4. **Add environment variables:**
   ```env
   SENTRY_DSN=your-sentry-dsn-here
   SENTRY_AUTH_TOKEN=your-auth-token-here
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
   ```

5. **Update `sentry.client.config.ts`:**
   ```typescript
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0, // Adjust based on traffic
     integrations: [
       new Sentry.BrowserTracing(),
     ],
   });
   ```

6. **Update `sentry.server.config.ts`:**
   ```typescript
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     tracesSampleRate: 1.0,
   });
   ```

7. **Wrap your ErrorBoundary:**
   ```typescript
   // src/components/ErrorBoundary.tsx
   import * as Sentry from '@sentry/nextjs';
   
   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
     Sentry.captureException(error, {
       contexts: {
         react: {
           componentStack: errorInfo.componentStack,
         },
       },
     });
   }
   ```

8. **Add error tracking to API routes:**
   ```typescript
   import * as Sentry from '@sentry/nextjs';
   
   try {
     // Your code
   } catch (error) {
     Sentry.captureException(error);
     throw error;
   }
   ```

### Option 2: Logtail (Better Stack)

**Pros:**
- Simple setup
- Good for log aggregation
- Free tier available
- Integrates with other services

**Setup Steps:**

1. **Create a Logtail account:**
   - Go to https://logtail.com/
   - Create a new source
   - Copy your source token

2. **Install Logtail:**
   ```bash
   npm install @logtail/node @logtail/browser
   ```

3. **Create logger utility:**
   ```typescript
   // src/lib/logger.ts
   import { Logtail } from '@logtail/node';
   import { Browser } from '@logtail/browser';
   
   const logtail = process.env.NEXT_PUBLIC_LOGTALL_TOKEN
     ? (typeof window === 'undefined'
         ? new Logtail(process.env.LOGTAIL_TOKEN!)
         : new Browser(process.env.NEXT_PUBLIC_LOGTALL_TOKEN!))
     : null;
   
   export function logError(message: string, error: Error, context?: any) {
     if (logtail) {
       logtail.error(message, {
         error: error.message,
         stack: error.stack,
         ...context,
       });
     }
     console.error(message, error, context);
   }
   ```

4. **Update environment variables:**
   ```env
   LOGTAIL_TOKEN=your-logtail-token-here
   NEXT_PUBLIC_LOGTALL_TOKEN=your-logtail-token-here
   ```

### Option 3: Vercel Analytics (If using Vercel)

**Pros:**
- Built-in with Vercel
- No additional setup
- Automatic error tracking

**Setup Steps:**

1. **Install Vercel Analytics:**
   ```bash
   npm install @vercel/analytics @vercel/speed-insights
   ```

2. **Add to `src/app/layout.tsx`:**
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   import { SpeedInsights } from '@vercel/speed-insights/next';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
           <SpeedInsights />
         </body>
       </html>
     );
   }
   ```

## Implementation for StackMoneyUp

### Recommended: Sentry Setup

1. **Update `src/components/ErrorBoundary.tsx`:**
   ```typescript
   import * as Sentry from '@sentry/nextjs';
   
   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
     // Log to console in development
     if (process.env.NODE_ENV === 'development') {
       console.error('ErrorBoundary caught an error:', error, errorInfo);
     }
     
     // Send to Sentry in production
     if (process.env.NODE_ENV === 'production') {
       Sentry.captureException(error, {
         contexts: {
           react: {
             componentStack: errorInfo.componentStack,
           },
         },
       });
     }
     
     if (this.props.onError) {
       this.props.onError(error, errorInfo);
     }
   }
   ```

2. **Update `src/lib/logger.ts`:**
   ```typescript
   import * as Sentry from '@sentry/nextjs';
   
   export function logError(
     message: string,
     error: Error | unknown,
     context?: Record<string, any>
   ) {
     // Log to console
     console.error(message, error, context);
     
     // Send to Sentry in production
     if (process.env.NODE_ENV === 'production') {
       Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
         tags: context,
         extra: context,
       });
     }
   }
   ```

3. **Add error tracking to API routes:**
   ```typescript
   // Example: src/app/api/maintenance/auth/route.ts
   import * as Sentry from '@sentry/nextjs';
   
   export async function POST(request: NextRequest) {
     try {
       // Your code
     } catch (error) {
       Sentry.captureException(error);
       // Handle error
     }
   }
   ```

## Environment Variables

Add to `.env.local` (development) and production environment:

```env
# Sentry
SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-auth-token-here
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here

# Or Logtail
LOGTAIL_TOKEN=your-logtail-token-here
NEXT_PUBLIC_LOGTALL_TOKEN=your-logtail-token-here
```

## Testing

1. **Test error tracking:**
   ```typescript
   // In development, manually trigger an error
   throw new Error('Test error');
   ```

2. **Check Sentry dashboard:**
   - Go to https://sentry.io
   - Check "Issues" tab
   - Verify error appears

## Best Practices

1. **Don't log sensitive data:**
   - Never log passwords, tokens, or PII
   - Sanitize user input before logging

2. **Set appropriate sample rates:**
   - Adjust `tracesSampleRate` based on traffic
   - Start with 1.0 for low traffic, reduce for high traffic

3. **Use tags and context:**
   - Add relevant tags (user ID, feature, etc.)
   - Include context for debugging

4. **Set up alerts:**
   - Configure alerts for critical errors
   - Set up email/Slack notifications

5. **Monitor performance:**
   - Track slow API routes
   - Monitor Core Web Vitals
   - Set up performance budgets

## Next Steps

1. Choose a monitoring solution (Sentry recommended)
2. Install and configure
3. Update ErrorBoundary and logger
4. Test error tracking
5. Set up alerts
6. Monitor in production

## Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Logtail Documentation](https://logtail.com/docs/)
- [Vercel Analytics](https://vercel.com/analytics)

