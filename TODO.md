# 📋 StackMoneyUp – Project To-Do List

**Last Updated:** January 2025  
**Project:** StackMoneyUp – Personal Finance Blog Platform  
**Status:** ~85% Complete - Core features done, UX enhancements added, needs security fixes + SEO optimization + testing

---

## 🎯 PRIORITY PHASES

**PHASE 0: Security & SEO (CRITICAL - IMMEDIATE - 2-3 hours)**
- 🔒 Supabase security warnings (9 issues)
- 🚀 SEO Quick Wins (1 hour implementation)
- 🛡️ Content protection (anti-scraping basics)

**PHASE 1: Production-Ready (CRITICAL - 2-3 weeks)**
- Testing (manual + automated)
- Error handling & monitoring
- Performance optimization
- Security audit (RLS testing)
- Production deployment

**PHASE 2: Advanced SEO & UX (IMPORTANT - 1-2 weeks)**
- ✅ Full-text search - PostgreSQL full-text search with GIN indexes
- 📊 Advanced SEO (Organization schema, internal linking)
- Newsletter integration
- ✅ Dark mode - Theme toggle with next-themes
- ✅ RSS feed - RSS 2.0 feed with multi-language support
- ✅ Better SEO - JSON-LD structured data, reading progress bar

**PHASE 3: Growth Features (FUTURE - 3-4 weeks)**
- Multi-author system
- Advanced analytics
- Content recommendations
- Monetization features

---

## ✅ COMPLETED

### 🔐 Authentication
- [x] Supabase Auth: email/password
- [x] Google OAuth login/signup
- [x] Login ↔ Signup UI toggle
- [x] Auth state handling (session persistence)
- [x] Protected routes for dashboard
- [x] Password confirmation field (signup)
- [x] Show/hide password toggle (eye icon)
- [x] Improved email confirmation error messages
- [x] Better user feedback for auth errors
- [x] Integrated auth patterns (useAuth hook + AuthContext)
- [x] Fixed all async/await issues with isAuthenticated()
- [x] Add password reset functions to auth.ts (resetPassword, updatePassword)
- [x] Create forgot-password page with email input form
- [x] Create reset-password page for handling reset token from email
- [x] Add 'Forgot password?' link to login page
- [x] Add password reset translations (EN/IT)

### 🚀 Core Features
- [x] Multi-language (EN / IT)
- [x] Blog editor base structure
- [x] Dashboard for blog posts
- [x] SEO basic setup
- [x] Responsive layout
- [x] User Profile page - Profile page with edit functionality, avatar upload, and password change

### 🛠 Code Quality & Maintenance
- [x] Fixed all TypeScript errors
- [x] Removed duplicate CSS files (src/styles/globals.css)
- [x] Deleted unused empty files (ProfileCard.tsx)
- [x] Created error logging utility (src/lib/logger.ts)
- [x] Added missing translation keys (deleteConfirm, blog.tagline)
- [x] Fixed all import errors and type safety issues

---

## 🚨 PHASE 0: CRITICAL - SECURITY & SEO (IMMEDIATE - 2-3 hours)

### 🔒 Supabase Security Fixes (3 minutes)
- [ ] Run SQL script to fix 8 function search_path warnings
  - `get_post_share_count`, `is_bookmarked`, `update_blog_post_updated_at`
  - `set_blog_post_published_at`, `update_tag_updated_at`, `update_tag_post_count`
  - `handle_new_user`, `sync_user_role_to_metadata`
- [ ] Enable "Leaked Password Protection" in Supabase Auth Dashboard
- [ ] Verify all 9 security warnings are resolved

**Guide:** `APPLY_SUPABASE_SECURITY.md` + `fix_all_security_warnings.sql`

---

### 🚀 SEO Quick Wins - Phase 1 (1 hour)
- [ ] **Copy Attribution** - Auto-add source URL when users copy content (15 min)
  - Create `BlogPostContent.tsx` component
  - Detect copy events, append "© StackMoneyUp + URL"
  - Protects content from plagiarism

- [ ] **Enhanced BlogPosting Schema** - Add breadcrumbs, word count, language (10 min)
  - Update `src/app/[lang]/blog/[slug]/page.tsx`
  - Add breadcrumb navigation to JSON-LD
  - Add `wordCount`, `inLanguage`, `articleBody`

- [ ] **Enhanced Open Graph Tags** - Better social sharing (10 min)
  - Add `modifiedTime`, `section`, `tags` to OG metadata
  - Add `type: 'image/jpeg'` to OG images
  - Improve Twitter Card metadata

- [ ] **Controlled RSS Feed** - Prevent full-article scraping (15 min)
  - Update `src/app/[lang]/rss/route.ts`
  - Limit RSS to title + excerpt (200 chars) + link only
  - Remove full `content` from feed

- [ ] **Copyright Notice in Footer** - Legal protection (5 min)
  - Update `src/components/layout/Footer.tsx`
  - Add "© 2025 StackMoneyUp. All rights reserved."
  - Link to Terms of Service

**Guide:** `SEO_ACTION_PLAN.md` - Phase 1

---

### 🛡️ Content Protection Basics (15 minutes)
- [ ] Add copy event tracking to analytics
- [ ] Add visible copyright notice on blog posts
- [ ] Update robots.txt with crawl-delay for aggressive bots

---

## 🔄 IN PROGRESS
- [ ] Manual testing on production (with maintenance password)
- [ ] Integration tests for auth flow and blog CRUD
- [ ] E2E tests with Playwright for critical user journeys

---

## 🛠 BACKEND & DATABASE
- [x] Supabase database schema (posts, users, tags…) - All tables created with proper schema
- [x] Row Level Security (RLS) rules - RLS policies implemented for blog_posts, tags, and profiles
- [x] User roles & permissions (admin / editor / user) - Role-based access control implemented
- [x] Blog posts table (title, slug, content, author, status…) - Complete with multi-language support
- [x] User profiles table (bio, avatar, preferences) - Profiles table with role management
- [x] Tags / categories relationship - Tags table with auto-updating post counts via triggers
- [x] Comments system - Complete with nested replies, edit/delete, moderation support ✅ DONE
- [x] Supabase Storage + policy for image uploads - Avatar upload implemented
- [x] Blog image upload to Supabase Storage - Blog images upload implemented with proper RLS policies
- [x] Database migrations + seed data - Migration scripts created in migrations/ directory

---

## 🎨 FRONTEND FEATURES
- [x] Password reset (forgot password)  
- [x] Email verification UI - User-friendly messages added
- [x] Blog image upload to Supabase Storage
- [x] Blog post preview (before publishing) - Modal preview with EN/IT toggle  
- [x] Search + filter by category/tags - Enhanced with tag filtering, clickable tags  
- [x] "Related posts" suggestions - Smart scoring based on category + tags  
- [x] Reading time indicator - Displayed on all blog cards and post pages  
- [x] Social media share buttons - ShareButtonsClient component implemented
- [x] Connect blog listing to Supabase - Blog page now fetches real posts
- [x] Connect dashboard posts to Supabase - Full CRUD operations implemented
- [x] Connect blog post detail to Supabase - Post detail page with view tracking
- [x] Connect tags management to Supabase - Tag CRUD operations working
- [x] Full-text search implementation - PostgreSQL full-text search with weighted search vectors
- [x] Google OAuth image fix - Added Google user content hostnames to next.config.ts

---

## 📊 DASHBOARD ENHANCEMENTS
- [x] Post analytics (views, reads…) - Analytics dashboard with views, reads, read rate, and shares
- [x] Draft auto-save improvements - Auto-save to localStorage implemented
- [x] Bulk actions (delete/publish multiple posts) - Checkbox selection, bulk publish/unpublish/delete
- [x] Post scheduling (publish later) - Date/time picker for scheduled publishing
- [x] Media library (view/upload images) - View, upload, delete images with search functionality  
- [x] Tag management UI - View, rename, delete tags with usage statistics
- [x] SEO preview panel - Google, Facebook, Twitter previews with character counts and recommendations

---

## ✅ AUTH / SECURITY TODO
- [x] Email verification templates in Supabase - Documentation created with template examples
- [x] Configure OAuth redirect URLs - OAuth callback route created with multi-language support
- [x] OAuth redirect + callback handling - Complete OAuth flow implemented
- [x] Test full login → logout → refresh flow - Logout working correctly
- [x] RLS testing script created - Automated RLS testing script (`scripts/test-rls.ts`)
- [x] Enable RLS + test unauthenticated access - All RLS tests passed ✅ DONE

---

## ⚙️ DEVOPS & DEPLOYMENT (CRITICAL - PHASE 1)
- [x] Configure environment variables (prod) - Complete guide created (PRODUCTION_ENV_SETUP.md)
- [x] Production build optimization - Optimization guide created (PRODUCTION_OPTIMIZATION.md)
- [x] Deploy on Netlify (or similar) - Netlify.toml configured
- [x] CI/CD pipeline (GitHub Actions) - GitHub Actions workflow created (.github/workflows/ci-cd.yml)
- [x] Error logging - Basic logger utility created (can be extended with Sentry/Logtail)  
- [x] Create maintenance page component with password form
- [x] Update middleware to check maintenance mode and password cookie
- [x] Create API route to verify maintenance password and set cookie
- [x] Add environment variables documentation for maintenance mode
- [x] Deployment guide - Complete deployment documentation (DEPLOYMENT_GUIDE.md)
- [x] Google Analytics / Plausible integration - Setup guide created (ANALYTICS_SETUP.md)
- [x] **ACTUAL DEPLOYMENT** - Deployed to production (maintenance mode currently enabled)
- [x] Production environment setup - Production Supabase project configured (maintenance mode active)
- [x] Production monitoring - Setup guide created (PRODUCTION_MONITORING_SETUP.md)
- [ ] CDN configuration - Optimize static assets delivery (Netlify/Vercel handles this)
- [x] Rate limiting - Rate limiting middleware implemented for API routes
- [x] CSRF protection - CSRF utilities created (src/lib/csrf.ts)
- [x] Security headers - Security headers added (HSTS, CSP, X-Frame-Options, etc.)

---

## 🧪 TESTING & QUALITY (CRITICAL - PHASE 1)
- [x] Manual testing checklist - Comprehensive test plan created (MANUAL_TESTING_CHECKLIST.md)
- [x] Unit tests (auth, utils) - Vitest setup complete, 84 tests passing
  - ✅ Utils tests: 32 tests (utils.ts)
  - ✅ Auth tests: 10 tests (auth.ts)
  - ✅ CSRF tests: 18 tests (csrf.ts) - NEW
  - ✅ Translation tests: 12 tests (translations.ts) - NEW
  - ✅ Rate limiting tests: 12 tests (rateLimit.ts) - NEW
- [x] Code quality improvements - All linting errors fixed (33 errors → 0, 50 warnings → 0)
- [x] Hydration mismatch fixes - Fixed ThemeToggle and other components
- [ ] Integration tests for signup/login - Test auth flow with Supabase
- [ ] Integration tests for blog CRUD - Test blog operations
- [ ] Integration tests for comments - Test comment system
- [ ] E2E tests (Playwright) - Critical user journeys (browse, comment, admin)
- [x] RLS policy testing - All 6 tests passed (unauthenticated access restrictions verified) ✅ DONE
- [x] Performance optimizations - Image optimization (next/image), caching headers, lazy loading ready
- [x] Error boundaries - ErrorBoundary component created and integrated
- [x] Error monitoring - Setup guide created (PRODUCTION_MONITORING_SETUP.md)
- [x] Error monitoring integration - Logger updated with Sentry support, ErrorBoundary integrated
- [x] Security checklist created - Comprehensive security checklist (SECURITY_CHECKLIST.md)
- [x] RLS testing script - Automated RLS testing script (`scripts/test-rls.ts`)
- [ ] Accessibility audit (a11y) - Use axe-core or similar
- [ ] Cross-browser testing - Test Chrome, Firefox, Safari, Edge
- [ ] Performance monitoring - Core Web Vitals, Lighthouse scores

---

## 📄 DOCUMENTATION (Important)
- [x] Deployment guide - Complete deployment documentation (DEPLOYMENT_GUIDE.md)
- [x] Database schema documentation - Complete schema docs (DATABASE_SCHEMA.md)
- [x] Website structure documentation - Complete structure docs (WEBSITE_STRUCTURE.md)
- [ ] API documentation - Document all API routes and functions
- [ ] Component documentation - Storybook or component docs
- [ ] Testing guide - Comprehensive testing documentation
- [ ] Contributor guide - Guide for writers/editors
- [ ] Code comments - Add JSDoc comments to functions

---

## 🚀 PHASE 2: ENHANCE USER EXPERIENCE (Important - 2-3 weeks)

### 📊 Advanced SEO - Phase 2 (1-2 days)
- [ ] **Homepage Organization Schema** - Brand recognition (30 min)
  - Add Organization + WebSite schema to `src/app/[lang]/page.tsx`
  - Include logo, social media profiles, search action
  
- [ ] **Blog Listing CollectionPage Schema** - Better blog indexing (20 min)
  - Add CollectionPage schema to `src/app/[lang]/blog/page.tsx`
  - Include ItemList with all blog posts

- [ ] **About & Contact Page Schemas** - Complete schema coverage (20 min)
  - Add AboutPage schema to about page
  - Add ContactPage schema to contact page

- [ ] **Internal Linking Strategy** - SEO + user engagement (2 hours)
  - Create RelatedPosts component (smart scoring)
  - Add "Read More" sections within posts
  - Implement breadcrumb navigation UI

- [ ] **Enhanced Robots.txt** - Better crawl budget (10 min)
  - Add crawl-delay for aggressive bots (SemrushBot, AhrefsBot)
  - Block /api/, /dashboard/, /_next/ from indexing
  - Add multiple sitemap references

- [ ] **Copy Event Analytics** - Track content copying (15 min)
  - Integrate with Google Analytics
  - Track copy length, page URL, frequency

**Guide:** `SEO_ACTION_PLAN.md` - Phase 2

---

### 🌟 General UX Improvements
- [x] Full-text search - PostgreSQL full-text search with weighted search vectors, GIN indexes, and RPC function ✅ DONE
- [x] Newsletter signup - "Coming Soon" placeholder component created ✅ DONE
- [ ] Newsletter integration - Connect with SendGrid/Mailchimp/Resend (when ready)
- [x] RSS feed - RSS 2.0 feed with multi-language support, proper caching headers ✅ DONE
- [x] Dark mode - Theme toggle with next-themes, dark mode variables, ThemeProvider ✅ DONE
- [x] Better SEO - JSON-LD structured data for blog posts, improved meta tags ✅ DONE
- [x] Open Graph optimization - Custom OG images, better social sharing ✅ DONE (already implemented)
- [x] Twitter Card optimization - Enhanced Twitter sharing ✅ DONE (already implemented)
- [x] Share tracking - Track social shares in database ✅ DONE
- [x] Print-friendly post layout - Optimized CSS for printing ✅ DONE
- [ ] Export post as PDF - PDF generation for blog posts (optional)
- [x] Reading progress bar - Reading progress indicator on blog post pages ✅ DONE
- [x] Bookmarking system - Allow users to save favorite posts ✅ DONE
- [x] Cookie consent system - Full GDPR/CCPA compliant cookie consent with granular control ✅ DONE

## 🌟 PHASE 3: GROWTH FEATURES (Future - 3-4 weeks)

### 🔐 Advanced Content Protection (Optional - 1 day)
- [ ] **Light Rate Limiting** - Prevent aggressive scraping (2 hours)
  - Track page views per IP in middleware
  - Limit to 50 requests/minute per IP
  - Serve cached/minimal content for violators

- [ ] **Honeypot Links** - Bot detection (30 min)
  - Add invisible links in footer
  - Log IPs that access honeypot URLs
  - Optional: Block detected bots

- [ ] **Delayed Content Loading** - JS-based protection (1 hour)
  - Load main content 200-400ms after page load
  - Basic scrapers get empty HTML
  - Google still indexes (runs JS)

- [ ] **Image Watermarking** - Visual branding (2 hours)
  - Auto-add "StackMoneyUp" watermark to blog images
  - Subtle corner/edge placement
  - Maintains brand visibility if stolen

**Guide:** `smart-content-protection.md` + `SEO_ACTION_PLAN.md` - Phase 3

---

### 🚀 General Growth Features
- [ ] Multi-author system - Support multiple authors per post
- [ ] Content moderation panel - Advanced moderation tools
- [ ] Analytics integration - Google Analytics / Plausible implementation
- [ ] Custom analytics dashboard - Enhanced analytics visualization
- [ ] User favorites/bookmarks - Save posts for later
- [ ] Content recommendation - Algorithm-based related posts
- [ ] Email notifications - Notify users of new posts/comments
- [ ] Advanced search filters - Date range, category, author filters

## 💰 MONETIZATION (Optional)
- [ ] Google AdSense integration - Display ads
- [ ] Premium content system - Stripe integration for paywall
- [ ] Affiliate links management - Track and manage affiliate links
- [ ] Sponsored posts - Support for sponsored content

---

## 🐛 KNOWN ISSUES & FIXES NEEDED
- [x] OAuth redirect not fully configured - OAuth callback route implemented
- [ ] Email sending from Supabase not verified - Requires Supabase dashboard configuration
- [x] Need end-to-end auth testing - Basic flow working, needs comprehensive testing
- [x] Loading states missing - Loading skeleton components created and integrated everywhere
- [x] Error boundaries missing - ErrorBoundary component created and integrated
- [x] Image optimization incomplete - All images now use next/image with Supabase storage support
- [x] Caching strategy not implemented - Cache headers added for static assets, images, fonts, and API routes
- [x] Rate limiting not implemented - Rate limiting middleware implemented (src/lib/rateLimit.ts)
- [x] CSRF protection not implemented - CSRF utilities created (src/lib/csrf.ts)
- [x] Security headers not configured - Security headers configured (HSTS, CSP, X-Frame-Options, etc.)
- [x] Google OAuth image hostname error - Added Google user content domains to next.config.ts image remotePatterns

---

## 📊 PROJECT STATUS SUMMARY

**Completed:** ~85%  
**Remaining:** Security fixes (3 min), SEO optimization (1-2 hours), Testing, Error Monitoring

**Strengths:**
- ✅ Modern tech stack (Next.js 16, React 19, TypeScript)
- ✅ Clean architecture (lib/, components/, hooks/)
- ✅ Multi-language support (EN/IT)
- ✅ Full CRUD operations for blog
- ✅ Role-based access control (admin/editor/user)
- ✅ Comments system with nested replies
- ✅ Rich text editor (TipTap)
- ✅ SEO features (basic JSON-LD, Open Graph, Twitter Cards)
- ✅ Analytics dashboard with views/reads/shares
- ✅ Cookie consent (GDPR/CCPA compliant)
- ✅ 84 unit tests passing

**Critical Gaps (PHASE 0 - IMMEDIATE):**
- ⚠️ **Supabase Security Warnings** - 9 warnings need fixing (3 min)
- ⚠️ **SEO Optimization** - Quick wins available (1 hour)
- ⚠️ **Content Protection** - Basic anti-scraping needed (15 min)

**Important Gaps (PHASE 1):**
- ⚠️ Manual testing on production (with maintenance password)
- ⚠️ Integration tests for auth flow and blog CRUD (optional)
- ⚠️ E2E tests with Playwright (optional)
- ⚠️ Error monitoring setup (guide ready, needs implementation)

**Next Steps (Priority Order):**
1. 🔒 **Fix Supabase security warnings** (3 minutes)
   - Run SQL script: `fix_all_security_warnings.sql`
   - Enable leaked password protection in dashboard
2. 🚀 **Implement SEO Phase 1** (1 hour)
   - Copy attribution component
   - Enhanced schema.org with breadcrumbs
   - Better Open Graph tags
   - Controlled RSS feed
   - Copyright notice
3. 🛡️ **Add basic content protection** (15 minutes)
   - Update robots.txt
   - Add copy tracking
4. ✅ Run manual testing on production (with maintenance password)
5. 📊 **Implement SEO Phase 2** (1-2 days)
   - Organization schema (homepage)
   - CollectionPage schema (blog listing)
   - Internal linking strategy
6. 🔍 Set up error monitoring (Sentry/Logtail)
7. 🚀 Disable maintenance mode when ready for public launch

**Quick Reference Guides:**
- Security: `APPLY_SUPABASE_SECURITY.md` + `fix_all_security_warnings.sql`
- SEO: `SEO_ACTION_PLAN.md` + `smart-content-protection.md`
- Testing: `MANUAL_TESTING_CHECKLIST.md` + `TESTING_COMPLETE_GUIDE.md`
- Deployment: `DEPLOYMENT_GUIDE.md`

---
