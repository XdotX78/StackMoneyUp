# 🧪 Testing Guide - Auth Integration & Error Logging

## ✅ What We Changed

1. **Integrated Auth Patterns**
   - `useAuth` hook is now used across dashboard pages
   - `AuthContext` provides global auth state
   - `AuthProviderWrapper` wraps the app

2. **Created Error Logger**
   - `src/lib/logger.ts` - logs in dev, silent in production
   - Replaced `console.error` with `logError()`

---

## 🚀 Quick Test (5 minutes)

### **Step 1: Start Server**
```bash
npm run dev
```

### **Step 2: Test Authentication Flow**

1. **Homepage** (`http://localhost:3000/en`)
   - ✅ No console errors
   - ✅ Header shows "Login" button
   - ✅ Mobile menu works

2. **Login** 
   - Click "Login" → Should redirect to login page
   - Enter credentials → Should redirect to dashboard
   - ✅ Header updates to "Dashboard"

3. **Dashboard Pages** (while logged in)
   - `/en/dashboard` → ✅ Shows user info
   - `/en/dashboard/posts` → ✅ Loads without errors
   - `/en/dashboard/new-post` → ✅ Loads without errors
   - `/en/dashboard/profile` → ✅ Shows profile

4. **Logout**
   - Click logout → ✅ Redirects to login
   - Try accessing `/en/dashboard` → ✅ Redirects to login

### **Step 3: Check Console**

Open Browser DevTools (F12) → Console tab:

✅ **Should see:**
- No React errors
- No "useAuthContext must be used within an AuthProvider"
- No "Cannot read property 'user' of undefined"

✅ **When errors occur:**
- In development: You'll see `[Error]` logs with context
- In production: Silent (no console spam)

---

## 🔍 Detailed Verification

### **Check 1: TypeScript Compilation**
```bash
npx tsc --noEmit
```
Expected: Only pre-existing errors (unrelated to auth)

### **Check 2: Browser Console**
1. Open DevTools → Console
2. Look for:
   - ❌ NO: `useAuthContext must be used within an AuthProvider`
   - ❌ NO: `Cannot read property 'user' of undefined`
   - ✅ YES: Clean console (or intentional dev logs)

### **Check 3: Network Tab**
1. Open DevTools → Network
2. Login/logout
3. Check:
   - ✅ Supabase auth calls succeed (200 status)
   - ❌ NO: 401/403 errors on protected routes when logged in

### **Check 4: Component State**
- Login → Header button changes from "Login" to "Dashboard"
- Logout → Header button changes from "Dashboard" to "Login"
- State updates happen immediately (no refresh needed)

---

## 🐛 Common Issues & Fixes

### **Issue: "useAuthContext must be used within an AuthProvider"**
**Cause:** Component trying to use context outside provider  
**Fix:** Make sure component is inside `src/app/[lang]/layout.tsx` (which has `AuthProviderWrapper`)

### **Issue: Auth state not updating**
**Cause:** Component using old `isAuthenticated()` instead of `useAuth()`  
**Fix:** Check imports - should use `useAuth` from `@/hooks/useAuth`

### **Issue: Infinite redirect loop**
**Cause:** Not checking `loading` state before redirect  
**Fix:** Check `if (!loading && !user)` before redirecting

---

## ✅ Success Criteria

You're good if:
- ✅ All pages load without errors
- ✅ Login/logout works smoothly
- ✅ Protected routes redirect when not logged in
- ✅ Header updates immediately on login/logout
- ✅ No console errors related to auth
- ✅ Error logs appear in dev (when errors occur)

---

## 📝 Manual Test Checklist

- [ ] Homepage loads (not logged in)
- [ ] Login button visible in header
- [ ] Login flow works (email/password)
- [ ] Login flow works (Google OAuth)
- [ ] Redirects to dashboard after login
- [ ] Header shows "Dashboard" when logged in
- [ ] Dashboard page loads
- [ ] Posts page loads
- [ ] New post page loads
- [ ] Profile page loads
- [ ] Logout works
- [ ] Redirects to login after logout
- [ ] Protected routes redirect when not logged in
- [ ] Mobile menu shows correct auth state
- [ ] No console errors
- [ ] Error logging works (check dev console on error)

---

## 🎯 Next Steps

If all tests pass, you're ready to:
1. ✅ Move to production
2. ✅ Continue with other fixes (duplicate CSS, empty files, etc.)
3. ✅ Add more features

