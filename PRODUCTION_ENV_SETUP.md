# 🔐 Production Environment Variables Setup

**Last Updated:** January 2025

Complete guide for configuring environment variables in production.

---

## Required Variables

### Supabase Configuration

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Anonymous Key (Public - safe to expose)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (SECRET - never expose!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the values

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for anon key)
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS - keep it secret!
- Never commit service role key to Git

---

### Site Configuration

```env
# Production Site URL (for OAuth redirects, email links, etc.)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**Important:**
- Must match your production domain exactly
- Include `https://` protocol
- No trailing slash
- Used for OAuth callbacks and email links

---

### Maintenance Mode

```env
# Enable/disable maintenance mode
MAINTENANCE_MODE=false

# Password for accessing site during maintenance
MAINTENANCE_PASSWORD=your-secure-password-here
```

**Usage:**
- Set `MAINTENANCE_MODE=true` to enable maintenance page
- Users must enter `MAINTENANCE_PASSWORD` to access site
- Cookie valid for 7 days

---

## Platform-Specific Setup

### Netlify

1. Go to **Site settings** → **Environment variables**
2. Click **Add variable**
3. Add each variable:
   - Key: Variable name
   - Value: Variable value
   - Scope: Production (or All)
4. Click **Save**

**Recommended Scope:**
- Production: All variables
- Deploy previews: All except `MAINTENANCE_MODE` (set to `false`)

---

### Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Click **Add New**
3. Add each variable:
   - Key: Variable name
   - Value: Variable value
   - Environment: Production (or All)
4. Click **Save**

---

### Self-Hosted / VPS

**Option 1: Environment File**

Create `.env.production`:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# etc.
```

**Option 2: System Environment Variables**

```bash
# Linux/Mac
export NEXT_PUBLIC_SUPABASE_URL="..."
export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Windows PowerShell
$env:NEXT_PUBLIC_SUPABASE_URL="..."
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

**Option 3: Docker**

In `docker-compose.yml`:
```yaml
services:
  app:
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      # etc.
```

Or use `.env` file:
```bash
docker-compose --env-file .env.production up
```

---

## Variable Validation

### Development

The app validates required variables at startup:

```typescript
// src/lib/supabaseClient.ts
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables...');
}
```

### Production

Before deploying, verify:

1. **All variables are set:**
   ```bash
   # Check if variables are accessible
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Variables are correct format:**
   - URLs start with `https://`
   - Keys are valid (not empty, correct length)

3. **Test in preview deployment:**
   - Deploy to preview/staging first
   - Test all features
   - Verify no missing variable errors

---

## Security Best Practices

### ✅ DO

- ✅ Use different Supabase projects for staging/production
- ✅ Rotate keys regularly (every 90 days)
- ✅ Use strong passwords for `MAINTENANCE_PASSWORD`
- ✅ Enable 2FA on Supabase account
- ✅ Review access logs regularly
- ✅ Use environment-specific variables

### ❌ DON'T

- ❌ Commit `.env` files to Git
- ❌ Share service role key publicly
- ❌ Use same keys for dev/staging/production
- ❌ Hardcode secrets in code
- ❌ Expose service role key in client-side code
- ❌ Use weak maintenance passwords

---

## Staging vs Production

### Staging Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=staging-service-key
NEXT_PUBLIC_SITE_URL=https://staging.yourdomain.com
MAINTENANCE_MODE=false
```

### Production Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=production-anon-key
SUPABASE_SERVICE_ROLE_KEY=production-service-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
MAINTENANCE_MODE=false
```

**Best Practice:** Use separate Supabase projects for each environment.

---

## Troubleshooting

### Variable Not Found

**Error:** `Missing Supabase environment variables`

**Solutions:**
1. Verify variable is set in deployment platform
2. Check variable name spelling (case-sensitive)
3. Restart deployment after adding variables
4. Verify `NEXT_PUBLIC_` prefix for client-side variables

### Variable Not Updating

**Problem:** Changed variable but changes not reflected.

**Solutions:**
1. Redeploy after changing variables
2. Clear browser cache
3. Restart application server
4. Check if variable is cached

### Wrong Environment

**Problem:** Using development variables in production.

**Solutions:**
1. Verify environment scope in deployment platform
2. Check which environment is active
3. Use separate projects for each environment
4. Review deployment logs

---

## Quick Reference

### Minimum Required Variables

```env
NEXT_PUBLIC_SUPABASE_URL=*
NEXT_PUBLIC_SUPABASE_ANON_KEY=*
SUPABASE_SERVICE_ROLE_KEY=*
NEXT_PUBLIC_SITE_URL=*
```

### Recommended Variables

```env
NEXT_PUBLIC_SUPABASE_URL=*
NEXT_PUBLIC_SUPABASE_ANON_KEY=*
SUPABASE_SERVICE_ROLE_KEY=*
NEXT_PUBLIC_SITE_URL=*
MAINTENANCE_MODE=false
MAINTENANCE_PASSWORD=*
```

---

## Verification Checklist

Before going live:

- [ ] All required variables are set
- [ ] Supabase credentials are from production project
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] `MAINTENANCE_MODE` is set to `false`
- [ ] `MAINTENANCE_PASSWORD` is strong and secure
- [ ] Variables are set in correct environment scope
- [ ] Test deployment completed successfully
- [ ] No missing variable errors in logs

---

## References

- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

