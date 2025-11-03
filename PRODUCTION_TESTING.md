# 🧪 Production Testing Guide (Maintenance Mode)

**Last Updated:** January 2025

Since the site is deployed with **maintenance mode enabled**, all testing needs to be done with the maintenance password.

---

## 🔐 Accessing Production Site

### Step 1: Navigate to Production URL

Go to your production URL (e.g., `https://yourdomain.com` or `https://your-site.netlify.app`)

### Step 2: Enter Maintenance Password

You'll be redirected to the maintenance page. Enter the `MAINTENANCE_PASSWORD` that's set in your production environment variables.

### Step 3: Access Granted

Once authenticated:
- A cookie is set (valid for 7 days)
- You can access the full site
- Cookie persists across page refreshes

---

## 🧪 Testing Checklist (Production)

### Pre-Testing Setup

- [ ] Have maintenance password ready
- [ ] Access production site
- [ ] Verify maintenance page loads
- [ ] Enter password and verify access

### Critical Path Testing

#### 1. Authentication Flow

**Note:** Test with maintenance password already entered (cookie set)

- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Google OAuth (if configured)
- [ ] Password reset flow
- [ ] Logout
- [ ] Session persistence (refresh page)

#### 2. Blog Functionality

- [ ] View blog listing (`/en/blog` or `/it/blog`)
- [ ] View individual post
- [ ] Create post (as admin/editor)
- [ ] Edit post
- [ ] Delete post
- [ ] Publish/unpublish
- [ ] Search and filter

#### 3. Comments System

- [ ] View comments on published post
- [ ] Post comment (authenticated)
- [ ] Reply to comment
- [ ] Edit own comment
- [ ] Delete own comment

#### 4. Multi-Language

- [ ] Switch EN/IT
- [ ] Verify content changes
- [ ] Verify URLs update
- [ ] Test maintenance page in both languages

---

## 🐛 Production-Specific Issues to Check

### 1. Environment Variables

- [ ] Verify all environment variables are set correctly
- [ ] Check Supabase URLs point to production
- [ ] Verify OAuth redirect URLs match production domain

### 2. Performance

- [ ] Check page load times
- [ ] Verify images load correctly
- [ ] Check Network tab for slow requests
- [ ] Run Lighthouse audit

### 3. Security

- [ ] Verify HTTPS is working
- [ ] Check security headers
- [ ] Test RLS policies (unauthenticated access blocked)
- [ ] Verify maintenance mode cookie is secure

### 4. Maintenance Mode Behavior

- [ ] Verify maintenance page shows correctly
- [ ] Test password authentication
- [ ] Verify cookie is set correctly
- [ ] Test cookie expiration (7 days)
- [ ] Verify access after password entry

---

## 🔍 Production Debugging

### Check Maintenance Mode Status

```javascript
// In browser console (after accessing site)
document.cookie
// Should show: maintenance-auth=authenticated
```

### Verify Environment Variables

Check your deployment platform (Netlify/Vercel):
- `MAINTENANCE_MODE=true`
- `MAINTENANCE_PASSWORD=your-password`
- `NEXT_PUBLIC_SUPABASE_URL=production-url`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=production-key`

### Browser Console Checks

1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify cookies are set correctly

---

## 🚀 Disabling Maintenance Mode

When ready to make the site public:

1. **Go to your deployment platform** (Netlify/Vercel)
2. **Update environment variable:**
   - Set `MAINTENANCE_MODE=false`
3. **Redeploy** (or wait for automatic deployment)
4. **Verify** site is accessible without password

---

## 📝 Testing Notes

### What to Test With Maintenance Mode

✅ **Should work:**
- All site functionality (after entering password)
- Authentication flows
- Blog operations
- Comments
- Multi-language switching

❌ **Won't work:**
- Public access (users need password)
- SEO crawling (site blocked)
- Social sharing (limited access)

### Testing Strategy

1. **Test core functionality** first
2. **Document any production-specific issues**
3. **Compare with local development** results
4. **Fix critical bugs** before disabling maintenance mode

---

## ⚠️ Important Notes

1. **Maintenance password is required** for all testing
2. **Cookie expires after 7 days** - may need to re-enter password
3. **Test from different browsers** to verify cookie behavior
4. **Clear cookies** if you need to test maintenance page again
5. **Don't disable maintenance mode** until all critical tests pass

---

## 🎯 Recommended Testing Order

1. **Access & Authentication**
   - Verify maintenance password works
   - Test login/signup flows
   - Test OAuth (if configured)

2. **Blog Operations**
   - View published posts
   - Create/edit/delete posts (as admin)
   - Test scheduled publishing

3. **Comments**
   - Post comments
   - Test replies
   - Test moderation

4. **Performance**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify image optimization

5. **Security**
   - Test RLS policies
   - Verify protected routes
   - Check security headers

---

## 📊 Production Testing Checklist

Use this checklist when testing on production:

- [ ] Maintenance password works
- [ ] Site loads after authentication
- [ ] All pages accessible
- [ ] Authentication works
- [ ] Blog CRUD operations work
- [ ] Comments system works
- [ ] Multi-language works
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security policies working
- [ ] Ready to disable maintenance mode

---

**Next Step:** After all tests pass, disable maintenance mode to make the site public!

