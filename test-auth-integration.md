# Auth Integration Testing Guide

## ✅ Quick Verification Steps

### 1. **Check Import Errors**
- [ ] No TypeScript errors in IDE
- [ ] Build completes without errors: `npm run build`

### 2. **Runtime Checks**

Open browser console and check:

```javascript
// Test if AuthContext is available (run in browser console)
// This should NOT throw an error if you're on a page with AuthProvider
console.log('Testing auth context...');
```

### 3. **Manual Test Flow**

#### Step 1: Homepage (Not Logged In)
1. Visit `http://localhost:3000/en`
2. ✅ Header shows "Login" button
3. ✅ Mobile menu shows "Login"
4. ✅ No console errors

#### Step 2: Login
1. Click "Login" → redirects to `/en/login`
2. Enter credentials or use Google
3. ✅ Successfully logs in
4. ✅ Redirects to dashboard
5. ✅ Header shows "Dashboard" button
6. ✅ Mobile menu shows "Dashboard"

#### Step 3: Dashboard Pages (Logged In)
Test each page:
- `/en/dashboard` → ✅ Shows user info
- `/en/dashboard/posts` → ✅ Shows posts list
- `/en/dashboard/new-post` → ✅ Shows form
- `/en/dashboard/profile` → ✅ Shows profile

#### Step 4: Logout
1. Click logout on dashboard
2. ✅ Redirects to login
3. ✅ Header updates to "Login"
4. ✅ Try accessing `/en/dashboard` → ✅ Redirects to login

#### Step 5: Error Handling
1. Check browser console when errors occur
2. ✅ In development: errors logged with context
3. ✅ In production: no console spam

### 4. **Common Issues to Watch For**

#### Issue: "useAuthContext must be used within an AuthProvider"
**Fix:** Make sure `AuthProviderWrapper` is in `src/app/[lang]/layout.tsx`

#### Issue: Auth state not updating
**Fix:** Check that components use `useAuth()` or `useAuthContext()`, not manual `isAuthenticated()` calls

#### Issue: Infinite redirect loop
**Fix:** Check that auth checks wait for `loading` state before redirecting

#### Issue: "Cannot read property 'user' of undefined"
**Fix:** Ensure component is wrapped in `AuthProviderWrapper`

### 5. **Build Test**
```bash
npm run build
```
✅ Should complete without errors
✅ No TypeScript errors
✅ No missing imports

