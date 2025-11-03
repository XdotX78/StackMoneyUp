# 📊 Analytics Setup Guide

**Last Updated:** January 2025

Guide for integrating Google Analytics or Plausible Analytics into StackMoneyUp.

---

## Option 1: Google Analytics (GA4)

### Setup Steps

1. **Create Google Analytics Account**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Install Google Analytics**

   Create `src/components/analytics/GoogleAnalytics.tsx`:
   ```typescript
   'use client';
   
   import Script from 'next/script';

   export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
     if (!measurementId) return null;

     return (
       <>
         <Script
           strategy="afterInteractive"
           src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
         />
         <Script id="google-analytics" strategy="afterInteractive">
           {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${measurementId}', {
               page_path: window.location.pathname,
             });
           `}
         </Script>
       </>
     );
   }
   ```

3. **Add to Root Layout**

   Update `src/app/layout.tsx`:
   ```typescript
   import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
         </body>
       </html>
     );
   }
   ```

4. **Set Environment Variable**

   Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

5. **Track Page Views**

   Create `src/lib/analytics.ts`:
   ```typescript
   export const pageview = (url: string) => {
     if (typeof window !== 'undefined' && window.gtag) {
       window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
         page_path: url,
       });
     }
   };

   export const event = ({ action, category, label, value }: {
     action: string;
     category: string;
     label?: string;
     value?: number;
   }) => {
     if (typeof window !== 'undefined' && window.gtag) {
       window.gtag('event', action, {
         event_category: category,
         event_label: label,
         value: value,
       });
     }
   };
   ```

6. **Track Custom Events**

   Example: Track blog post views
   ```typescript
   import { event } from '@/lib/analytics';

   event({
     action: 'view_post',
     category: 'blog',
     label: postSlug,
   });
   ```

---

## Option 2: Plausible Analytics (Privacy-Friendly)

### Setup Steps

1. **Create Plausible Account**
   - Go to [Plausible Analytics](https://plausible.io/)
   - Sign up and create a site
   - Get your domain name

2. **Install Plausible**

   Create `src/components/analytics/PlausibleAnalytics.tsx`:
   ```typescript
   'use client';
   
   import Script from 'next/script';

   export default function PlausibleAnalytics({ domain }: { domain: string }) {
     if (!domain) return null;

     return (
       <Script
         strategy="afterInteractive"
         data-domain={domain}
         src="https://plausible.io/js/script.js"
       />
     );
   }
   ```

3. **Add to Root Layout**

   Update `src/app/layout.tsx`:
   ```typescript
   import PlausibleAnalytics from '@/components/analytics/PlausibleAnalytics';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <PlausibleAnalytics domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} />
         </body>
       </html>
     );
   }
   ```

4. **Set Environment Variable**

   Add to `.env.local`:
   ```env
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
   ```

5. **Track Custom Events (Optional)**

   Plausible supports custom events:
   ```typescript
   if (typeof window !== 'undefined' && window.plausible) {
     window.plausible('Post View', { props: { slug: postSlug } });
   }
   ```

---

## Option 3: Both (Recommended for Development)

You can use both for comparison:

```typescript
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PlausibleAnalytics from '@/components/analytics/PlausibleAnalytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <PlausibleAnalytics domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} />
        )}
      </body>
    </html>
    );
}
```

---

## Comparison

### Google Analytics

**Pros:**
- ✅ Free (up to 10M events/month)
- ✅ Comprehensive features
- ✅ Industry standard
- ✅ Free for most websites

**Cons:**
- ❌ Requires cookie consent (GDPR)
- ❌ More complex setup
- ❌ Privacy concerns

### Plausible Analytics

**Pros:**
- ✅ Privacy-friendly (no cookies)
- ✅ GDPR compliant
- ✅ Simple setup
- ✅ Lightweight
- ✅ Open source

**Cons:**
- ❌ Paid ($9/month for 10k pageviews)
- ❌ Fewer features than GA
- ❌ Smaller ecosystem

---

## Recommended Setup

For StackMoneyUp:

1. **Development:** Use Plausible (free trial)
2. **Production:** Use Google Analytics (free tier sufficient)
3. **Privacy-focused:** Use Plausible only

---

## Events to Track

### Recommended Events

1. **Blog Post Views**
   ```typescript
   event({ action: 'view_post', category: 'blog', label: slug });
   ```

2. **User Signups**
   ```typescript
   event({ action: 'signup', category: 'auth' });
   ```

3. **Post Creation**
   ```typescript
   event({ action: 'create_post', category: 'dashboard' });
   ```

4. **Search Queries**
   ```typescript
   event({ action: 'search', category: 'blog', label: query });
   ```

5. **Tag Clicks**
   ```typescript
   event({ action: 'click_tag', category: 'blog', label: tagSlug });
   ```

---

## Privacy & Compliance

### GDPR Compliance

**If using Google Analytics:**
- ✅ Add cookie consent banner
- ✅ Disable tracking until consent
- ✅ Provide privacy policy

**If using Plausible:**
- ✅ No cookie consent needed
- ✅ Already GDPR compliant
- ✅ Still provide privacy policy

### Cookie Consent (GA4)

Install a cookie consent library:
```bash
npm install react-cookie-consent
```

---

## Environment Variables

Add to `.env.local`:

```env
# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Plausible Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

---

## Testing

### Test Google Analytics

1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Open your site
3. Check GA4 Real-Time reports
4. Verify events are tracked

### Test Plausible

1. Go to Plausable dashboard
2. Check Real-Time view
3. Verify pageviews appear
4. Test custom events

---

## Troubleshooting

### Events Not Tracking

**Problem:** Events not appearing in analytics.

**Solutions:**
1. Verify script is loaded (check Network tab)
2. Check environment variable is set
3. Verify measurement ID/domain is correct
4. Check browser console for errors
5. Wait 24-48 hours for GA4 data (real-time may be delayed)

### Script Not Loading

**Problem:** Analytics script not loading.

**Solutions:**
1. Check `NEXT_PUBLIC_` prefix for client-side variables
2. Verify variable is set correctly
3. Check browser console for errors
4. Ensure Script component is in layout

---

## References

- [Google Analytics Setup](https://support.google.com/analytics/answer/9304153)
- [Plausible Analytics Docs](https://plausible.io/docs)
- [Next.js Script Component](https://nextjs.org/docs/pages/api-reference/next-script)

