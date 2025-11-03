# 🧪 Manual Testing Checklist - StackMoneyUp

**Last Updated:** January 2025  
**Purpose:** Comprehensive manual testing guide before production deployment  
**Estimated Time:** 4-6 hours for complete testing

---

## 📋 How to Use This Checklist

1. **Test Environment:**
   - Use development/staging environment
   - Have test accounts ready (admin, editor, regular user)
   - Use browser DevTools (F12) open to monitor console errors

2. **Testing Approach:**
   - Test each section systematically
   - Check both English and Italian versions
   - Test on desktop and mobile browsers
   - Document any bugs found

3. **Mark Results:**
   - ✅ Pass - Works as expected
   - ❌ Fail - Bug found, document issue
   - ⚠️ Partial - Works but has minor issues
   - ➖ Not Tested - Skip if not applicable

---

## 🔐 1. AUTHENTICATION & AUTHORIZATION

### 1.1 Sign Up (Email/Password)

- [ ] **Test:** Navigate to `/en/login` or `/it/login`
- [ ] **Test:** Click "Sign up" toggle
- [ ] **Test:** Fill in valid email and password
- [ ] **Test:** Confirm password matches
- [ ] **Test:** Submit form
- [ ] **Expected:** Success message shown
- [ ] **Expected:** Email verification sent (check Supabase)
- [ ] **Expected:** Redirect to dashboard or email verification page
- [ ] **Test:** Try duplicate email
- [ ] **Expected:** Error message shown
- [ ] **Test:** Try weak password (< 6 chars)
- [ ] **Expected:** Validation error shown
- [ ] **Test:** Try mismatched passwords
- [ ] **Expected:** Error message shown

**Console Check:** No errors in browser console

---

### 1.2 Sign In (Email/Password)

- [ ] **Test:** Navigate to login page
- [ ] **Test:** Enter valid credentials
- [ ] **Test:** Submit form
- [ ] **Expected:** Successfully logged in
- [ ] **Expected:** Redirected to dashboard
- [ ] **Expected:** Header shows "Dashboard" link
- [ ] **Test:** Try invalid email
- [ ] **Expected:** Error message shown
- [ ] **Test:** Try wrong password
- [ ] **Expected:** Error message shown
- [ ] **Test:** Try empty fields
- [ ] **Expected:** Validation errors shown

**Console Check:** No errors

---

### 1.3 Google OAuth

- [ ] **Test:** Click "Sign in with Google"
- [ ] **Expected:** Redirected to Google OAuth
- [ ] **Test:** Select Google account
- [ ] **Expected:** Redirected back to site
- [ ] **Expected:** Successfully logged in
- [ ] **Expected:** Redirected to dashboard
- [ ] **Test:** Check profile created in Supabase
- [ ] **Expected:** Profile exists with correct role
- [ ] **Test:** Test with existing user
- [ ] **Expected:** Logs in existing user (no duplicate profile)

**Console Check:** No errors

**Multi-language Test:**
- [ ] **Test:** OAuth from `/en/login`
- [ ] **Expected:** Redirects to `/en/dashboard`
- [ ] **Test:** OAuth from `/it/login`
- [ ] **Expected:** Redirects to `/it/dashboard`

---

### 1.4 Password Reset

- [ ] **Test:** Click "Forgot password?" link
- [ ] **Expected:** Navigate to forgot-password page
- [ ] **Test:** Enter registered email
- [ ] **Test:** Submit form
- [ ] **Expected:** Success message shown
- [ ] **Expected:** Email sent (check Supabase)
- [ ] **Test:** Click reset link in email
- [ ] **Expected:** Navigate to reset-password page
- [ ] **Test:** Enter new password
- [ ] **Test:** Submit form
- [ ] **Expected:** Password updated
- [ ] **Expected:** Redirected to login
- [ ] **Test:** Try logging in with new password
- [ ] **Expected:** Successfully logged in
- [ ] **Test:** Try invalid reset token
- [ ] **Expected:** Error message shown

**Console Check:** No errors

---

### 1.5 Session Management

- [ ] **Test:** Log in successfully
- [ ] **Test:** Refresh page (F5)
- [ ] **Expected:** Still logged in (session persists)
- [ ] **Test:** Close browser tab
- [ ] **Test:** Reopen site
- [ ] **Expected:** Still logged in (if session valid)
- [ ] **Test:** Log out
- [ ] **Expected:** Redirected to login
- [ ] **Test:** Try accessing `/dashboard` after logout
- [ ] **Expected:** Redirected to login
- [ ] **Test:** Try accessing `/dashboard` in incognito
- [ ] **Expected:** Redirected to login

**Console Check:** No errors

---

### 1.6 Protected Routes

**As Unauthenticated User:**
- [ ] **Test:** Try accessing `/en/dashboard`
- [ ] **Expected:** Redirected to login
- [ ] **Test:** Try accessing `/en/dashboard/posts`
- [ ] **Expected:** Redirected to login
- [ ] **Test:** Try accessing `/en/dashboard/new-post`
- [ ] **Expected:** Redirected to login
- [ ] **Test:** Try accessing `/en/dashboard/profile`
- [ ] **Expected:** Redirected to login

**As Regular User:**
- [ ] **Test:** Log in as regular user
- [ ] **Test:** Try accessing `/en/dashboard/posts`
- [ ] **Expected:** Access denied or redirected (role = 'user')
- [ ] **Test:** Try accessing `/en/dashboard/new-post`
- [ ] **Expected:** Access denied (only editors/admins can create)

**As Editor:**
- [ ] **Test:** Log in as editor
- [ ] **Test:** Access `/en/dashboard/posts`
- [ ] **Expected:** Can view posts
- [ ] **Test:** Try accessing user management (if exists)
- [ ] **Expected:** Access denied (admin only)

**As Admin:**
- [ ] **Test:** Log in as admin
- [ ] **Test:** Access all dashboard pages
- [ ] **Expected:** Full access to everything

---

## 📝 2. BLOG POST MANAGEMENT

### 2.1 Create Post

**As Editor/Admin:**
- [ ] **Test:** Navigate to `/en/dashboard/new-post`
- [ ] **Test:** Fill in title (EN)
- [ ] **Test:** Fill in title (IT)
- [ ] **Test:** Fill in excerpt (EN)
- [ ] **Test:** Fill in excerpt (IT)
- [ ] **Test:** Fill in content (EN) using rich text editor
- [ ] **Test:** Fill in content (IT)
- [ ] **Test:** Select category
- [ ] **Test:** Add tags
- [ ] **Test:** Upload cover image
- [ ] **Expected:** Image uploads successfully
- [ ] **Test:** Preview post (EN)
- [ ] **Expected:** Preview shows correctly
- [ ] **Test:** Preview post (IT)
- [ ] **Expected:** Preview shows correctly
- [ ] **Test:** Save as draft
- [ ] **Expected:** Post saved, not published
- [ ] **Test:** Publish post
- [ ] **Expected:** Post published
- [ ] **Expected:** Redirected to posts list
- [ ] **Test:** Check post appears in blog listing
- [ ] **Expected:** Post visible on `/en/blog` and `/it/blog`

**Validation Tests:**
- [ ] **Test:** Try submitting without title
- [ ] **Expected:** Validation error shown
- [ ] **Test:** Try invalid slug
- [ ] **Expected:** Validation error shown
- [ ] **Test:** Try duplicate slug
- [ ] **Expected:** Error message shown

**Console Check:** No errors

---

### 2.2 Edit Post

- [ ] **Test:** Navigate to `/en/dashboard/posts`
- [ ] **Test:** Click "Edit" on a post
- [ ] **Expected:** Navigate to edit page
- [ ] **Expected:** Form pre-filled with post data
- [ ] **Test:** Modify title
- [ ] **Test:** Modify content
- [ ] **Test:** Change tags
- [ ] **Test:** Save changes
- [ ] **Expected:** Post updated
- [ ] **Expected:** Redirected to posts list
- [ ] **Test:** Check post on blog page
- [ ] **Expected:** Changes reflected

**As Regular User:**
- [ ] **Test:** Try editing someone else's post
- [ ] **Expected:** Access denied or post not found

**Console Check:** No errors

---

### 2.3 Delete Post

- [ ] **Test:** Navigate to posts list
- [ ] **Test:** Click "Delete" on a post
- [ ] **Expected:** Confirmation dialog shown
- [ ] **Test:** Confirm deletion
- [ ] **Expected:** Post deleted
- [ ] **Expected:** Post removed from list
- [ ] **Test:** Check blog page
- [ ] **Expected:** Post no longer visible
- [ ] **Test:** Try accessing post URL directly
- [ ] **Expected:** 404 Not Found

**Bulk Delete:**
- [ ] **Test:** Select multiple posts (checkboxes)
- [ ] **Test:** Click "Delete Selected"
- [ ] **Expected:** Confirmation dialog shown
- [ ] **Test:** Confirm deletion
- [ ] **Expected:** All selected posts deleted

**Console Check:** No errors

---

### 2.4 Publish/Unpublish

- [ ] **Test:** Publish a draft post
- [ ] **Expected:** Post becomes visible on blog
- [ ] **Test:** Unpublish a published post
- [ ] **Expected:** Post hidden from blog
- [ ] **Test:** Try accessing unpublished post URL
- [ ] **Expected:** 404 Not Found (or access denied)

**Bulk Publish:**
- [ ] **Test:** Select multiple draft posts
- [ ] **Test:** Click "Publish Selected"
- [ ] **Expected:** All selected posts published

**Bulk Unpublish:**
- [ ] **Test:** Select multiple published posts
- [ ] **Test:** Click "Unpublish Selected"
- [ ] **Expected:** All selected posts unpublished

---

### 2.5 Scheduled Publishing

- [ ] **Test:** Create post with future `scheduled_at` date
- [ ] **Test:** Save as draft
- [ ] **Expected:** Post not published yet
- [ ] **Test:** Wait until scheduled time (or manually adjust date)
- [ ] **Test:** Check if post auto-publishes
- [ ] **Expected:** Post becomes published at scheduled time

---

## 📖 3. BLOG VIEWING (PUBLIC)

### 3.1 Blog Listing Page

**As Unauthenticated User:**
- [ ] **Test:** Navigate to `/en/blog`
- [ ] **Expected:** See published posts
- [ ] **Expected:** Do NOT see draft posts
- [ ] **Test:** Navigate to `/it/blog`
- [ ] **Expected:** See published posts (Italian)
- [ ] **Test:** Filter by category
- [ ] **Expected:** Only posts in that category shown
- [ ] **Test:** Filter by tag
- [ ] **Expected:** Only posts with that tag shown
- [ ] **Test:** Search by keyword
- [ ] **Expected:** Relevant posts shown
- [ ] **Test:** Click on a post
- [ ] **Expected:** Navigate to post detail page

**Multi-language:**
- [ ] **Test:** Switch language (EN → IT)
- [ ] **Expected:** Content language changes
- [ ] **Expected:** URL updates to `/it/blog`
- [ ] **Test:** Switch back (IT → EN)
- [ ] **Expected:** Content language changes back

**Console Check:** No errors

---

### 3.2 Post Detail Page

- [ ] **Test:** Navigate to published post
- [ ] **Expected:** Post title displayed
- [ ] **Expected:** Post content displayed
- [ ] **Expected:** Cover image displayed (if exists)
- [ ] **Expected:** Category badge shown
- [ ] **Expected:** Tags displayed
- [ ] **Expected:** Reading time shown
- [ ] **Expected:** Published date shown
- [ ] **Expected:** Share buttons visible
- [ ] **Expected:** Related posts section (if applicable)
- [ ] **Test:** Scroll through post
- [ ] **Expected:** Smooth scrolling
- [ ] **Test:** Click share buttons
- [ ] **Expected:** Share dialog opens (or link copied)

**Multi-language:**
- [ ] **Test:** View post in EN
- [ ] **Expected:** English content shown
- [ ] **Test:** Switch to IT
- [ ] **Expected:** Italian content shown
- [ ] **Test:** URL updates correctly

**Try Invalid Post:**
- [ ] **Test:** Navigate to non-existent post slug
- [ ] **Expected:** 404 Not Found page
- [ ] **Test:** Navigate to unpublished post (if you know slug)
- [ ] **Expected:** 404 Not Found (or access denied)

**Console Check:** No errors

---

### 3.3 View Tracking

- [ ] **Test:** View a post
- [ ] **Test:** Check Supabase database
- [ ] **Expected:** `views` count incremented
- [ ] **Test:** Refresh page
- [ ] **Expected:** Views increment (or not, depending on implementation)

---

## 💬 4. COMMENTS SYSTEM

### 4.1 View Comments

**As Unauthenticated User:**
- [ ] **Test:** Navigate to published post
- [ ] **Expected:** Comments section visible
- [ ] **Expected:** See approved comments
- [ ] **Expected:** Do NOT see unapproved comments
- [ ] **Expected:** "Sign in to comment" message shown
- [ ] **Test:** Click "Sign In"
- [ ] **Expected:** Redirected to login

**As Authenticated User:**
- [ ] **Test:** Navigate to published post
- [ ] **Expected:** Comments section visible
- [ ] **Expected:** See all approved comments
- [ ] **Expected:** Comment form visible

---

### 4.2 Post Comment

**As Authenticated User:**
- [ ] **Test:** Fill in comment text
- [ ] **Test:** Submit comment
- [ ] **Expected:** Comment appears immediately
- [ ] **Expected:** Shows author name
- [ ] **Expected:** Shows timestamp
- [ ] **Test:** Try empty comment
- [ ] **Expected:** Validation error shown

**Console Check:** No errors

---

### 4.3 Reply to Comment

- [ ] **Test:** Click "Reply" on a comment
- [ ] **Expected:** Reply form appears
- [ ] **Test:** Fill in reply text
- [ ] **Test:** Submit reply
- [ ] **Expected:** Reply appears nested under comment
- [ ] **Expected:** Indented correctly
- [ ] **Test:** Reply to a reply
- [ ] **Expected:** Nested correctly (max depth?)

**Console Check:** No errors

---

### 4.4 Edit Comment

- [ ] **Test:** Post a comment
- [ ] **Test:** Click "Edit" on own comment
- [ ] **Expected:** Edit form appears
- [ ] **Test:** Modify comment text
- [ ] **Test:** Save changes
- [ ] **Expected:** Comment updated
- [ ] **Expected:** "Edited" badge shown
- [ ] **Test:** Try editing someone else's comment
- [ ] **Expected:** Edit button not visible (or access denied)

---

### 4.5 Delete Comment

- [ ] **Test:** Click "Delete" on own comment
- [ ] **Expected:** Confirmation dialog shown
- [ ] **Test:** Confirm deletion
- [ ] **Expected:** Comment deleted
- [ ] **Expected:** Comment removed from view
- [ ] **Test:** Try deleting someone else's comment
- [ ] **Expected:** Delete button not visible (or access denied)

**As Admin:**
- [ ] **Test:** Log in as admin
- [ ] **Test:** Delete any comment
- [ ] **Expected:** Can delete any comment

---

## 🔍 5. SEARCH & FILTERING

### 5.1 Search Functionality

- [ ] **Test:** Enter search term in blog listing
- [ ] **Expected:** Relevant posts shown
- [ ] **Test:** Search for non-existent term
- [ ] **Expected:** "No results" message
- [ ] **Test:** Clear search
- [ ] **Expected:** All posts shown again

---

### 5.2 Category Filtering

- [ ] **Test:** Click on a category
- [ ] **Expected:** Only posts in that category shown
- [ ] **Test:** Click "All Categories"
- [ ] **Expected:** All posts shown

---

### 5.3 Tag Filtering

- [ ] **Test:** Click on a tag
- [ ] **Expected:** Only posts with that tag shown
- [ ] **Test:** Multiple tags
- [ ] **Expected:** Posts matching any tag (OR) or all tags (AND)?

---

## 👤 6. USER PROFILE

### 6.1 View Profile

- [ ] **Test:** Log in
- [ ] **Test:** Navigate to `/en/dashboard/profile`
- [ ] **Expected:** Profile information displayed
- [ ] **Expected:** Name shown
- [ ] **Expected:** Email shown
- [ ] **Expected:** Avatar shown (if uploaded)

---

### 6.2 Edit Profile

- [ ] **Test:** Click "Edit Profile"
- [ ] **Test:** Change full name
- [ ] **Test:** Save changes
- [ ] **Expected:** Profile updated
- [ ] **Expected:** Changes reflected immediately

---

### 6.3 Avatar Upload

- [ ] **Test:** Click "Upload Avatar"
- [ ] **Test:** Select image file
- [ ] **Expected:** Image uploads
- [ ] **Expected:** Avatar updated
- [ ] **Expected:** Image visible in profile
- [ ] **Test:** Try invalid file type
- [ ] **Expected:** Error message shown
- [ ] **Test:** Try file too large
- [ ] **Expected:** Error message shown

---

### 6.4 Change Password

- [ ] **Test:** Click "Change Password"
- [ ] **Test:** Enter current password
- [ ] **Test:** Enter new password
- [ ] **Test:** Confirm new password
- [ ] **Test:** Submit
- [ ] **Expected:** Password updated
- [ ] **Expected:** Success message shown
- [ ] **Test:** Try wrong current password
- [ ] **Expected:** Error message shown

---

## 🏷️ 7. TAG MANAGEMENT

### 7.1 View Tags (Admin/Editor)

- [ ] **Test:** Navigate to `/en/dashboard/tags`
- [ ] **Expected:** List of all tags shown
- [ ] **Expected:** Tag names (EN/IT) shown
- [ ] **Expected:** Post count shown
- [ ] **Expected:** Usage statistics shown

---

### 7.2 Rename Tag

- [ ] **Test:** Click "Edit" on a tag
- [ ] **Test:** Change tag name (EN)
- [ ] **Test:** Change tag name (IT)
- [ ] **Test:** Change slug
- [ ] **Test:** Save changes
- [ ] **Expected:** Tag updated
- [ ] **Expected:** Changes reflected in posts using that tag

---

### 7.3 Delete Tag

- [ ] **Test:** Click "Delete" on unused tag
- [ ] **Expected:** Confirmation dialog
- [ ] **Test:** Confirm deletion
- [ ] **Expected:** Tag deleted
- [ ] **Test:** Try deleting tag in use
- [ ] **Expected:** Warning or prevented

---

## 📊 8. ANALYTICS DASHBOARD

### 8.1 View Analytics

**As Admin/Editor:**
- [ ] **Test:** Navigate to `/en/dashboard/analytics`
- [ ] **Expected:** Analytics data displayed
- [ ] **Expected:** Views count shown
- [ ] **Expected:** Reads count shown
- [ ] **Expected:** Shares count shown
- [ ] **Expected:** Read rate calculated
- [ ] **Test:** Check individual post analytics
- [ ] **Expected:** Per-post stats shown

---

## 🖼️ 9. MEDIA LIBRARY

### 9.1 View Media

- [ ] **Test:** Navigate to `/en/dashboard/media`
- [ ] **Expected:** List of uploaded images
- [ ] **Expected:** Images displayed as thumbnails
- [ ] **Test:** Search for image
- [ ] **Expected:** Filtered results shown

---

### 9.2 Upload Image

- [ ] **Test:** Click "Upload Image"
- [ ] **Test:** Select image file
- [ ] **Expected:** Image uploads
- [ ] **Expected:** Image appears in library
- [ ] **Test:** Try invalid file
- [ ] **Expected:** Error message shown

---

### 9.3 Delete Image

- [ ] **Test:** Click "Delete" on image
- [ ] **Expected:** Confirmation dialog
- [ ] **Test:** Confirm deletion
- [ ] **Expected:** Image deleted
- [ ] **Expected:** Image removed from library

---

## 🌍 10. MULTI-LANGUAGE

### 10.1 Language Switching

- [ ] **Test:** Start on `/en/blog`
- [ ] **Test:** Click language switcher (EN → IT)
- [ ] **Expected:** URL changes to `/it/blog`
- [ ] **Expected:** Content changes to Italian
- [ ] **Test:** Navigate to different page
- [ ] **Expected:** Language persists in URL
- [ ] **Test:** Switch back (IT → EN)
- [ ] **Expected:** Content changes to English

---

### 10.2 Language Content

- [ ] **Test:** View post in EN
- [ ] **Expected:** English title, excerpt, content
- [ ] **Test:** View same post in IT
- [ ] **Expected:** Italian title, excerpt, content
- [ ] **Test:** Check all UI elements
- [ ] **Expected:** All buttons, labels translated

---

## 🔒 11. SECURITY & RLS TESTING

### 11.1 Unauthenticated Access

**Should Work:**
- [ ] **Test:** View published posts
- [ ] **Expected:** ✅ Can view
- [ ] **Test:** View tags
- [ ] **Expected:** ✅ Can view
- [ ] **Test:** Search/filter posts
- [ ] **Expected:** ✅ Can search

**Should NOT Work:**
- [ ] **Test:** Access dashboard
- [ ] **Expected:** ❌ Redirected to login
- [ ] **Test:** Create post (API)
- [ ] **Expected:** ❌ Permission denied
- [ ] **Test:** Edit post (API)
- [ ] **Expected:** ❌ Permission denied
- [ ] **Test:** Delete post (API)
- [ ] **Expected:** ❌ Permission denied
- [ ] **Test:** View unpublished posts
- [ ] **Expected:** ❌ Cannot view

---

### 11.2 User Role Permissions

**Regular User:**
- [ ] **Test:** Try creating post
- [ ] **Expected:** ❌ Permission denied
- [ ] **Test:** Try editing someone else's post
- [ ] **Expected:** ❌ Permission denied
- [ ] **Test:** Try deleting post
- [ ] **Expected:** ❌ Permission denied
- [ ] **Test:** Try updating own profile
- [ ] **Expected:** ✅ Can update
- [ ] **Test:** Try updating someone else's profile
- [ ] **Expected:** ❌ Permission denied

**Editor:**
- [ ] **Test:** Create post
- [ ] **Expected:** ✅ Can create
- [ ] **Test:** Edit own posts
- [ ] **Expected:** ✅ Can edit
- [ ] **Test:** Edit other editor's posts
- [ ] **Expected:** ❌ Permission denied (or allowed?)
- [ ] **Test:** Delete own posts
- [ ] **Expected:** ✅ Can delete
- [ ] **Test:** Update user roles
- [ ] **Expected:** ❌ Permission denied (admin only)

**Admin:**
- [ ] **Test:** Create post
- [ ] **Expected:** ✅ Can create
- [ ] **Test:** Edit any post
- [ ] **Expected:** ✅ Can edit
- [ ] **Test:** Delete any post
- [ ] **Expected:** ✅ Can delete
- [ ] **Test:** Update user roles
- [ ] **Expected:** ✅ Can update
- [ ] **Test:** Delete any comment
- [ ] **Expected:** ✅ Can delete

---

## 🎨 12. UI/UX TESTING

### 12.1 Responsive Design

**Desktop (1920x1080):**
- [ ] **Test:** View blog listing
- [ ] **Expected:** Layout looks good
- [ ] **Test:** View post detail
- [ ] **Expected:** Content readable
- [ ] **Test:** View dashboard
- [ ] **Expected:** All elements visible

**Tablet (768px):**
- [ ] **Test:** View all pages
- [ ] **Expected:** Layout adapts
- [ ] **Expected:** Navigation works
- [ ] **Expected:** Forms usable

**Mobile (375px):**
- [ ] **Test:** View all pages
- [ ] **Expected:** Mobile menu works
- [ ] **Expected:** Content readable
- [ ] **Expected:** Forms usable
- [ ] **Expected:** No horizontal scroll

---

### 12.2 Loading States

- [ ] **Test:** Navigate between pages
- [ ] **Expected:** Loading indicators shown
- [ ] **Test:** Submit forms
- [ ] **Expected:** Loading state during submission
- [ ] **Test:** Upload images
- [ ] **Expected:** Progress indicator shown

---

### 12.3 Error Handling

- [ ] **Test:** Trigger network error (disconnect internet)
- [ ] **Expected:** Error message shown
- [ ] **Expected:** User-friendly error message
- [ ] **Test:** Try invalid actions
- [ ] **Expected:** Appropriate error messages
- [ ] **Test:** Check browser console
- [ ] **Expected:** No unhandled errors

---

## 🚀 13. PERFORMANCE TESTING

### 13.1 Page Load Times

- [ ] **Test:** Load blog listing page
- [ ] **Expected:** Loads in < 3 seconds
- [ ] **Test:** Load post detail page
- [ ] **Expected:** Loads in < 3 seconds
- [ ] **Test:** Load dashboard
- [ ] **Expected:** Loads in < 3 seconds

---

### 13.2 Image Loading

- [ ] **Test:** View post with images
- [ ] **Expected:** Images load progressively
- [ ] **Expected:** No layout shift
- [ ] **Expected:** Images optimized (check Network tab)

---

## 📱 14. BROWSER COMPATIBILITY

Test on multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

For each browser:
- [ ] **Test:** Login/logout
- [ ] **Test:** Create post
- [ ] **Test:** View blog
- [ ] **Test:** Comment on post
- [ ] **Expected:** All features work correctly

---

## ✅ 15. FINAL CHECKS

### 15.1 Console Errors

- [ ] **Test:** Open browser DevTools (F12)
- [ ] **Test:** Navigate through entire site
- [ ] **Expected:** No console errors
- [ ] **Expected:** No warnings (or minimal)

---

### 15.2 TypeScript Compilation

- [ ] **Test:** Run `npm run build`
- [ ] **Expected:** Build succeeds
- [ ] **Expected:** No TypeScript errors
- [ ] **Expected:** No build warnings

---

### 15.3 Linting

- [ ] **Test:** Run `npm run lint`
- [ ] **Expected:** No linting errors
- [ ] **Expected:** No critical warnings

---

## 📝 TESTING SUMMARY

**Date:** _______________  
**Tester:** _______________  
**Environment:** _______________

**Results:**
- Total Tests: ________
- Passed: ________
- Failed: ________
- Partial: ________
- Not Tested: ________

**Critical Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Blocking Issues:** (Must fix before production)
1. ________________________________
2. ________________________________

**Non-Blocking Issues:** (Can fix later)
1. ________________________________
2. ________________________________

**Recommendations:**
- [ ] Ready for production
- [ ] Needs fixes before production
- [ ] Needs more testing

---

## 🔄 NEXT STEPS AFTER TESTING

1. **Document all bugs found**
2. **Prioritize fixes** (Critical → Important → Nice to have)
3. **Fix critical issues**
4. **Re-test fixed issues**
5. **Proceed to automated testing setup** (Phase 1)

---

**Note:** This checklist should be updated as new features are added or issues are discovered.

