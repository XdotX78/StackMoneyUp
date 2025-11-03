# ⚡ Production Optimization Guide

**Last Updated:** January 2025

Optimization strategies for StackMoneyUp in production.

---

## Next.js Optimizations

### Already Configured

✅ **Image Optimization**
- Remote patterns configured for Supabase images
- Next.js Image component used throughout

### Additional Optimizations

#### 1. Enable Compression

**For Netlify/Vercel:** Automatically handled

**For Self-Hosted (Nginx):**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/javascript application/xml+rss 
           application/json image/svg+xml;
```

#### 2. Static Asset Optimization

Already configured in `netlify.toml`:
```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### 3. Enable SWC Minification

Next.js 13+ uses SWC by default. Verify in `next.config.js`:
```javascript
swcMinify: true, // Already enabled by default
```

---

## Database Optimizations

### Indexes (Already Created)

✅ All necessary indexes are in migration:
- `blog_posts_slug_idx` - Unique slug lookup
- `blog_posts_published_idx` - Published posts filtering
- `blog_posts_category_idx` - Category filtering
- `blog_posts_tags_gin_idx` - Fast tag searches (GIN)
- `blog_posts_author_id_idx` - Author queries
- `tags_slug_idx` - Tag lookup
- `profiles_role_idx` - Role-based queries

### Query Optimization

**Tips:**
1. Use `select()` to fetch only needed columns
2. Use pagination for large result sets
3. Use indexes for filtering (already done)
4. Monitor slow queries in Supabase dashboard

**Example Optimized Query:**
```typescript
// Good: Only fetch needed fields
const { data } = await supabase
  .from('blog_posts')
  .select('id, slug, title_en, excerpt_en, published_at')
  .eq('published', true)
  .limit(10);

// Bad: Fetching all fields
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('published', true);
```

---

## Image Optimization

### Supabase Storage

1. **Optimize Images Before Upload**
   - Compress images (use tools like TinyPNG)
   - Use appropriate formats (WebP preferred)
   - Resize large images before upload

2. **Use Next.js Image Component**
   - Already implemented
   - Automatic optimization
   - Lazy loading

3. **CDN Configuration**
   - Supabase Storage serves via CDN
   - Configure cache headers if needed

---

## Code Optimization

### Bundle Size

**Check Bundle Size:**
```bash
npm run build
# Check .next/analyze output
```

**Reduce Bundle Size:**
1. Use dynamic imports for heavy components
2. Remove unused dependencies
3. Use tree-shaking (already enabled)

**Example Dynamic Import:**
```typescript
// Lazy load heavy components
const BlogEditor = dynamic(() => import('@/components/blog/BlogEditor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});
```

### React Optimizations

1. **Use React.memo for expensive components**
2. **Use useMemo/useCallback appropriately**
3. **Avoid unnecessary re-renders**

---

## Performance Monitoring

### Core Web Vitals

Monitor these metrics:
- **LCP (Largest Contentful Paint)** - Should be < 2.5s
- **FID (First Input Delay)** - Should be < 100ms
- **CLS (Cumulative Layout Shift)** - Should be < 0.1

**Tools:**
- Google PageSpeed Insights
- Chrome DevTools Lighthouse
- Vercel Analytics (if using Vercel)

### Database Performance

**Monitor in Supabase:**
1. Go to **Database** → **Performance**
2. Check query times
3. Identify slow queries
4. Review connection pool usage

---

## Caching Strategies

### Static Pages

**Blog Listing:**
- Consider ISR (Incremental Static Regeneration)
- Revalidate every 60 seconds:
  ```typescript
  export const revalidate = 60;
  ```

**Individual Posts:**
- Use ISR for published posts
- Revalidate on-demand when updated

### API Routes

Cache responses where appropriate:
```typescript
export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour
```

---

## Security Optimizations

### Headers

Add security headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

---

## Monitoring & Analytics

### Error Tracking

**Recommended: Sentry**

1. Install:
   ```bash
   npm install @sentry/nextjs
   ```

2. Configure:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. Monitor errors in Sentry dashboard

### Analytics

**Google Analytics:**
- Add GA4 tracking code
- Monitor user behavior
- Track conversions

**Plausible Analytics (Privacy-friendly):**
- Add Plausible script
- No cookies required
- GDPR compliant

---

## Checklist

### Before Production

- [ ] Bundle size optimized
- [ ] Images optimized and compressed
- [ ] Database indexes created
- [ ] Security headers configured
- [ ] Error tracking set up
- [ ] Analytics configured
- [ ] Performance tested
- [ ] Core Web Vitals acceptable

### Ongoing Optimization

- [ ] Monitor performance weekly
- [ ] Review slow queries monthly
- [ ] Update dependencies regularly
- [ ] Optimize images as needed
- [ ] Review and remove unused code
- [ ] Monitor bundle size

---

## Quick Wins

1. **Enable Gzip/Brotli** - Most hosting platforms do this automatically
2. **Use CDN** - Static assets served from CDN
3. **Optimize Images** - Compress before upload
4. **Enable Caching** - Configure cache headers
5. **Monitor Performance** - Set up analytics and error tracking

---

## References

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Supabase Performance](https://supabase.com/docs/guides/platform/performance)

