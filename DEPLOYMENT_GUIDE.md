# 🚀 Deployment Guide

**Last Updated:** January 2025

Complete guide for deploying StackMoneyUp to production.

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Supabase project set up
- ✅ Database schema migrated
- ✅ OAuth providers configured (Google)
- ✅ Storage buckets created (`avatars`, `blog-images`)
- ✅ Environment variables documented
- ✅ Domain name ready (optional)

---

## Deployment Platforms

### Option 1: Netlify (Recommended)

**Pros:**
- Easy Next.js deployment
- Automatic HTTPS
- Edge functions support
- Built-in CI/CD

**Setup Steps:**

1. **Connect Repository**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**
   - Netlify will auto-detect Next.js
   - Build command: `npm run build`
   - Publish directory: `.next`
   - (Already configured in `netlify.toml`)

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.example`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-production-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     NEXT_PUBLIC_SITE_URL=https://yourdomain.com
     MAINTENANCE_MODE=false
     MAINTENANCE_PASSWORD=your-secure-password
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

5. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add your custom domain
   - Follow DNS configuration instructions

---

### Option 2: Vercel

**Pros:**
- Made by Next.js creators
- Excellent Next.js optimization
- Zero-config deployment
- Global CDN

**Setup Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

---

### Option 3: Self-Hosted (VPS/Docker)

**Prerequisites:**
- VPS with Node.js 18+ installed
- Docker (optional)
- Nginx or similar reverse proxy

**Setup Steps:**

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Use Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "stackmoneyup" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set Up SSL (Let's Encrypt)**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Environment Variables

### Required Variables

Create `.env.production` or set in your deployment platform:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Maintenance Mode
MAINTENANCE_MODE=false
MAINTENANCE_PASSWORD=your-secure-password
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Security Notes

- ✅ **Never commit** `.env` files to Git
- ✅ **Use secure passwords** for `MAINTENANCE_PASSWORD`
- ✅ **Rotate keys** regularly
- ✅ **Use different keys** for staging/production
- ✅ **Enable 2FA** on Supabase account

---

## Pre-Deployment Checklist

### Database

- [ ] Run migration `001_initial_schema.sql`
- [ ] Verify RLS policies are enabled
- [ ] Test database connections
- [ ] Back up database

### Supabase Configuration

- [ ] OAuth redirect URLs configured:
  - `https://yourdomain.com/en/auth/callback`
  - `https://yourdomain.com/it/auth/callback`
- [ ] Email templates configured
- [ ] Storage buckets created (`avatars`, `blog-images`)
- [ ] Storage policies configured

### Application

- [ ] Environment variables set
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] Build completes successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser

### Testing

- [ ] Test login/signup flow
- [ ] Test OAuth (Google)
- [ ] Test password reset
- [ ] Test blog post creation
- [ ] Test image uploads
- [ ] Test RLS policies (unauthenticated access)

---

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] No console errors
- [ ] Images load correctly
- [ ] Forms work correctly

### 2. Test Authentication

- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Sign in with Google
- [ ] Password reset works
- [ ] Email verification works

### 3. Test Features

- [ ] Create blog post
- [ ] Edit blog post
- [ ] Delete blog post
- [ ] Upload images
- [ ] Manage tags
- [ ] View analytics

### 4. Monitor

- [ ] Check error logs
- [ ] Monitor Supabase logs
- [ ] Set up error tracking (Sentry)
- [ ] Monitor performance

---

## Production Optimizations

### Next.js Configuration

The `next.config.js` is already optimized for:
- Image optimization
- Remote patterns for Supabase images

### Additional Optimizations

1. **Enable Image Optimization**
   - Already configured in `next.config.js`
   - Uses Next.js Image component

2. **Enable Compression**
   - Most hosting platforms handle this automatically
   - For self-hosted: configure Nginx gzip

3. **CDN Configuration**
   - Static assets served from CDN
   - Configure cache headers in `netlify.toml`

4. **Database Connection Pooling**
   - Supabase handles this automatically
   - Monitor connection usage in Supabase dashboard

---

## Troubleshooting

### Build Fails

**Problem:** `npm run build` fails.

**Solutions:**
1. Check for TypeScript errors
2. Verify all environment variables are set
3. Check Next.js version compatibility
4. Clear `.next` folder and rebuild

### Environment Variables Not Working

**Problem:** Variables not accessible in production.

**Solutions:**
1. Ensure variables are set in deployment platform
2. Restart deployment after adding variables
3. Check variable names (case-sensitive)
4. Verify `NEXT_PUBLIC_` prefix for client-side variables

### OAuth Not Working

**Problem:** Google OAuth redirect fails.

**Solutions:**
1. Verify redirect URLs in Supabase:
   - `https://yourdomain.com/en/auth/callback`
   - `https://yourdomain.com/it/auth/callback`
2. Verify redirect URLs in Google Cloud Console
3. Check `NEXT_PUBLIC_SITE_URL` matches production domain

### Database Connection Issues

**Problem:** Can't connect to Supabase.

**Solutions:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Verify Supabase project is active
4. Check Supabase dashboard for service status

### Images Not Loading

**Problem:** Images from Supabase Storage don't load.

**Solutions:**
1. Verify storage buckets are public or have correct RLS policies
2. Check image URLs are correct
3. Verify `next.config.js` has correct remote patterns
4. Check CORS settings in Supabase

---

## Monitoring & Maintenance

### Error Tracking

**Recommended:** Set up Sentry or similar:

1. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

2. Configure in `sentry.client.config.ts` and `sentry.server.config.ts`

3. Monitor errors in Sentry dashboard

### Performance Monitoring

- Use Next.js Analytics (Vercel)
- Monitor Supabase dashboard for query performance
- Use Google PageSpeed Insights
- Monitor Core Web Vitals

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Backup database regularly
- [ ] Monitor Supabase usage/quota
- [ ] Review security updates

---

## Rollback Procedure

If something goes wrong:

### Netlify

1. Go to Deploys
2. Find previous successful deploy
3. Click "Publish deploy"

### Vercel

1. Go to Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

### Self-Hosted

1. Revert to previous Git commit
2. Rebuild: `npm run build`
3. Restart: `pm2 restart stackmoneyup`

---

## Security Checklist

- [ ] All environment variables are set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is secret
- [ ] HTTPS is enabled
- [ ] RLS policies are enabled
- [ ] OAuth redirect URLs are whitelisted
- [ ] Email verification is enabled
- [ ] Maintenance password is strong
- [ ] 2FA enabled on Supabase account

---

## References

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-to-prod)

