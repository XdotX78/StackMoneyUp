# 📋 StackMoneyUp – Project To-Do List

**Last Updated:** January 2025  
**Project:** StackMoneyUp – Personal Finance Blog Platform

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

## 🔄 IN PROGRESS
- [ ] OAuth redirect + callback handling  
- [x] Email verification flow (Supabase + UI) - Basic flow complete, needs testing

---

## 🛠 BACKEND & DATABASE
- [ ] Supabase database schema (posts, users, tags…)
- [ ] Row Level Security (RLS) rules
- [ ] User roles & permissions (admin / editor / user)
- [ ] Blog posts table (title, slug, content, author, status…)
- [ ] User profiles table (bio, avatar, preferences)
- [ ] Tags / categories relationship
- [ ] Comments system (optional)
- [x] Supabase Storage + policy for image uploads - Avatar upload implemented
- [x] Blog image upload to Supabase Storage - Blog images upload implemented with proper RLS policies
- [ ] Database migrations + seed data

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

---

## 📊 DASHBOARD ENHANCEMENTS
- [ ] Post analytics (views, reads…)  
- [ ] Draft auto-save improvements  
- [ ] Bulk actions (delete/publish multiple posts)  
- [ ] Post scheduling (publish later)  
- [ ] Media library (view/upload images)  
- [ ] Tag management UI  
- [ ] SEO preview panel

---

## ✅ AUTH / SECURITY TODO
- [ ] Email verification templates in Supabase  
- [ ] Configure OAuth redirect URLs  
- [x] Test full login → logout → refresh flow - Logout working correctly
- [ ] Enable RLS + test unauthenticated access

---

## ⚙️ DEVOPS & DEPLOYMENT
- [ ] Configure environment variables (prod)  
- [ ] Production build optimization  
- [x] Deploy on Netlify (or similar) - Netlify.toml configured
- [ ] CI/CD pipeline (GitHub Actions?)  
- [x] Error logging - Basic logger utility created (can be extended with Sentry/Logtail)  
- [x] Create maintenance page component with password form
- [x] Update middleware to check maintenance mode and password cookie
- [x] Create API route to verify maintenance password and set cookie
- [x] Add environment variables documentation for maintenance mode
- [ ] Google Analytics / Plausible integration

---

## 🧪 TESTING & QUALITY
- [ ] Unit tests (auth, utils)  
- [ ] Integration tests for signup/login  
- [ ] E2E tests (Cypress / Playwright)  
- [ ] Performance optimizations  
- [ ] Accessibility audit (a11y)  
- [ ] Cross-browser testing

---

## 📄 DOCUMENTATION
- [ ] API documentation (frontend & backend)  
- [ ] Component documentation  
- [ ] Deployment guide  
- [ ] Contributor guide for writers/editors

---

## 💡 FUTURE FEATURES
- [ ] Email newsletter / newsletter signup  
- [ ] RSS feed  
- [ ] Dark mode  
- [ ] Print-friendly post layout  
- [ ] Export post as PDF  
- [ ] Multi-author system  
- [ ] Monetization → Ads, Premium content, Stripe  
- [ ] Content moderation panel

---

## 🐛 KNOWN ISSUES
- [ ] OAuth redirect not fully configured  
- [ ] Email sending from Supabase not verified  
- [x] Need end-to-end auth testing - Basic flow working, needs comprehensive testing

---
