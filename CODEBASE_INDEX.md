# 📚 Codebase Index

**Last Updated:** January 2025  
**Project:** StackMoneyUp - Personal Finance Blog Platform  
**Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Supabase

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Core Application Files](#core-application-files)
4. [API Routes](#api-routes)
5. [Components](#components)
6. [Library Functions](#library-functions)
7. [Database Schema](#database-schema)
8. [Testing Structure](#testing-structure)
9. [Configuration Files](#configuration-files)
10. [Documentation Files](#documentation-files)
11. [Scripts & Utilities](#scripts--utilities)

---

## 🎯 Project Overview

StackMoneyUp is a modern, multi-language personal finance blog platform featuring:
- **Multi-language support** (English, Italian, Spanish)
- **Role-based access control** (Admin, Editor, User)
- **Rich text editor** with TipTap
- **Interactive charts** (Chart.js)
- **AI Agent API** for automated content creation
- **Full-text search** with PostgreSQL
- **Comments system** with nested replies
- **Bookmarking** functionality
- **Analytics dashboard**
- **SEO optimization** with schema.org markup
- **GDPR/CCPA compliant** cookie consent
- **Google AdSense** integration ready

---

## 📁 Directory Structure

```
stackmoneyup/
├── src/
│   ├── app/                      # Next.js App Router (pages & API routes)
│   │   ├── [lang]/              # Multi-language routes
│   │   ├── api/                 # API endpoints
│   │   ├── actions/             # Server actions
│   │   ├── maintenance/        # Maintenance mode pages
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Root page (redirects to /en)
│   │   └── sitemap.ts           # Dynamic sitemap generation
│   ├── components/              # React components
│   │   ├── ads/                 # AdSense components
│   │   ├── blog/                # Blog-specific components
│   │   ├── charts/              # Chart components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── layout/              # Layout components (Header, Footer)
│   │   ├── newsletter/          # Newsletter components
│   │   ├── profile/             # User profile components
│   │   ├── providers/           # Context providers
│   │   └── ui/                  # Reusable UI components
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── CookieConsentContext.tsx  # Cookie consent state
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts           # Auth state hook
│   │   └── useRole.ts           # Role checking hook
│   ├── lib/                     # Utility libraries
│   │   ├── analytics.ts         # Analytics tracking
│   │   ├── auth.ts              # Authentication functions
│   │   ├── blog.ts              # Blog CRUD operations
│   │   ├── bookmarks.ts         # Bookmark management
│   │   ├── comments.ts          # Comments system
│   │   ├── csrf.ts              # CSRF protection
│   │   ├── logger.ts            # Logging utilities
│   │   ├── rateLimit.ts         # Rate limiting
│   │   ├── shareTracking.ts     # Share tracking
│   │   ├── shortcodes.ts        # Chart shortcode processing
│   │   ├── storage.ts           # File upload utilities
│   │   ├── supabaseClient.ts    # Supabase client setup
│   │   ├── translations.ts      # Multi-language translations
│   │   ├── users.ts             # User management
│   │   └── utils.ts             # General utilities
│   ├── types/                   # TypeScript type definitions
│   │   ├── blog.ts              # Blog-related types
│   │   └── user.ts              # User-related types
│   └── styles/                  # Global styles (empty)
├── public/                      # Static assets
├── migrations/                  # Database migrations
├── tests/                       # Test files
│   ├── e2e/                     # End-to-end tests (Playwright)
│   ├── integration/             # Integration tests (Vitest)
│   └── setup.ts                 # Test setup
├── scripts/                     # Utility scripts
├── middleware.ts                # Next.js middleware
└── [config files]               # Configuration files
```

---

## 🔧 Core Application Files

### Root Configuration

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `next.config.ts` | Next.js configuration (images, headers, security) |
| `tsconfig.json` | TypeScript configuration |
| `middleware.ts` | Next.js middleware (i18n routing, maintenance mode) |
| `netlify.toml` | Netlify deployment configuration |
| `vitest.config.ts` | Vitest test configuration |
| `playwright.config.ts` | Playwright E2E test configuration |
| `eslint.config.mjs` | ESLint configuration |
| `postcss.config.mjs` | PostCSS configuration |

### App Router Pages

#### Root Layout & Pages
- **`src/app/layout.tsx`** - Root layout with ThemeProvider
- **`src/app/page.tsx`** - Root page (redirects to `/en`)
- **`src/app/sitemap.ts`** - Dynamic sitemap generation
- **`src/app/globals.css`** - Global styles

#### Multi-Language Routes (`src/app/[lang]/`)

**Public Pages:**
- **`page.tsx`** - Home page
- **`layout.tsx`** - Language-specific layout with Header/Footer
- **`not-found.tsx`** - 404 page
- **`blog/page.tsx`** - Blog listing page
- **`blog/[slug]/page.tsx`** - Individual blog post page
- **`blog/tags/[slug]/page.tsx`** - Tag archive page
- **`about/page.tsx`** - About page
- **`contact/page.tsx`** - Contact page
- **`privacy/page.tsx`** - Privacy policy
- **`terms/page.tsx`** - Terms of service
- **`login/page.tsx`** - Login/Signup page
- **`forgot-password/page.tsx`** - Password reset request
- **`reset-password/page.tsx`** - Password reset form
- **`maintenance/page.tsx`** - Maintenance mode page
- **`sitemap/page.tsx`** - Sitemap display page
- **`rss/route.ts`** - RSS feed generation

**Dashboard Pages (Protected):**
- **`dashboard/page.tsx`** - Dashboard home
- **`dashboard/layout.tsx`** - Dashboard layout with sidebar
- **`dashboard/posts/page.tsx`** - Post management list
- **`dashboard/new-post/page.tsx`** - Create new post
- **`dashboard/edit/[slug]/page.tsx`** - Edit existing post
- **`dashboard/tags/page.tsx`** - Tag management
- **`dashboard/media/page.tsx`** - Media library
- **`dashboard/analytics/page.tsx`** - Analytics dashboard
- **`dashboard/profile/page.tsx`** - User profile
- **`dashboard/users/page.tsx`** - User management (admin only)

---

## 🔌 API Routes

### Next.js API Routes (`src/app/api/`)

| Route | File | Purpose |
|-------|------|---------|
| `/api/blog/create` | `src/app/api/blog/create/route.ts` | AI Agent API - Create blog posts (POST) |
| `/api/maintenance/auth` | `src/app/api/maintenance/auth/route.ts` | Maintenance mode authentication |

### Server Actions (`src/app/actions/`)

| File | Purpose |
|------|---------|
| `users.ts` | User management server actions |

---

## 🧩 Components

### Layout Components (`src/components/layout/`)

| Component | Purpose |
|-----------|---------|
| `Header.tsx` | Main navigation header with menu, language switcher, auth button |
| `Footer.tsx` | Site footer with links and copyright |
| `AuthButton.tsx` | Authentication button (login/logout/user menu) |
| `LanguageSwitcher.tsx` | Language selection dropdown |
| `MobileMenu.tsx` | Mobile navigation menu |

### Blog Components (`src/components/blog/`)

| Component | Purpose |
|-----------|---------|
| `BlogCard.tsx` | Blog post card for listings |
| `BlogGrid.tsx` | Grid layout for blog posts |
| `BlogEditor.tsx` | Rich text editor (TipTap) for post content |
| `BlogContentWithCharts.tsx` | Renders blog content with chart shortcode processing |
| `BlogPostContent.tsx` | Main blog post content renderer |
| `BlogPostPreview.tsx` | Post preview component |
| `PostForm.tsx` | Complete post creation/editing form |
| `EditorToolbar.tsx` | TipTap editor toolbar |
| `ImageUpload.tsx` | Image upload component for editor |
| `SEOPreview.tsx` | SEO preview (Google, Facebook, Twitter) |
| `CommentsSection.tsx` | Comments display and management |
| `BookmarkButton.tsx` | Bookmark toggle button |
| `ReadingProgress.tsx` | Reading progress indicator |

### Chart Components (`src/components/charts/`)

| Component | Purpose |
|-----------|---------|
| `BarChart.tsx` | Bar chart component (Chart.js) |
| `LineChart.tsx` | Line chart component (Chart.js) |
| `PieChart.tsx` | Pie chart component (Chart.js) |
| `index.ts` | Chart component exports |

### Ad Components (`src/components/ads/`)

| Component | Purpose |
|-----------|---------|
| `AdSense.tsx` | AdSense wrapper component |
| `AdBanner.tsx` | Banner ad component |
| `AdSidebar.tsx` | Sidebar ad component |
| `AdInArticle.tsx` | In-article ad component |
| `AdResponsive.tsx` | Responsive ad component |
| `index.ts` | Ad component exports |

### UI Components (`src/components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Button.tsx` | Button component |
| `Card.tsx` | Card component |
| `Input.tsx` | Input field component |
| `Textarea.tsx` | Textarea component |
| `Badge.tsx` | Badge component |
| `Modal.tsx` | Modal dialog component |
| `Tabs.tsx` | Tabs component |
| `ThemeToggle.tsx` | Dark/light theme toggle |
| `LoadingSkeleton.tsx` | Loading skeleton component |
| `index.ts` | UI component exports |

### Profile Components (`src/components/profile/`)

| Component | Purpose |
|-----------|---------|
| `ProfileLayout.tsx` | Profile page layout |
| `ProfileHeader.tsx` | Profile header with avatar |
| `ProfileSidebar.tsx` | Profile sidebar navigation |
| `ProfileDetails.tsx` | Profile details form |

### Providers (`src/components/providers/`)

| Component | Purpose |
|-----------|---------|
| `ThemeProvider.tsx` | Theme provider (next-themes) |
| `AuthProviderWrapper.tsx` | Auth context provider wrapper |

### Other Components

| Component | Purpose |
|-----------|---------|
| `CookieConsent.tsx` | GDPR/CCPA cookie consent banner |
| `ErrorBoundary.tsx` | React error boundary |
| `newsletter/NewsletterSignup.tsx` | Newsletter signup form |

---

## 📚 Library Functions

### Core Libraries (`src/lib/`)

| File | Purpose | Key Functions |
|------|---------|---------------|
| `supabaseClient.ts` | Supabase client initialization | `supabase` (client instance) |
| `auth.ts` | Authentication utilities | `signIn()`, `signUp()`, `signOut()`, `getCurrentUser()`, `getUserRole()` |
| `blog.ts` | Blog CRUD operations | `getPublishedPosts()`, `getAllPosts()`, `getPostBySlug()`, `createPost()`, `updatePost()`, `deletePost()`, `incrementPostViews()`, `incrementPostReads()` |
| `translations.ts` | Multi-language translations | `getTranslations(lang)` |
| `utils.ts` | General utilities | `generateSlug()`, `calculateReadTime()`, `formatDate()`, etc. |
| `storage.ts` | File upload utilities | `uploadImage()`, `deleteImage()`, `getImageUrl()` |
| `comments.ts` | Comments system | `getComments()`, `createComment()`, `updateComment()`, `deleteComment()` |
| `bookmarks.ts` | Bookmark management | `getBookmarks()`, `addBookmark()`, `removeBookmark()`, `isBookmarked()` |
| `analytics.ts` | Analytics tracking | `trackView()`, `trackRead()`, `trackShare()` |
| `shareTracking.ts` | Share tracking | `trackShare()`, `getShareCounts()` |
| `shortcodes.ts` | Chart shortcode processing | `processShortcodes()`, `parseChartShortcode()` |
| `csrf.ts` | CSRF protection | `generateCSRFToken()`, `validateCSRFToken()` |
| `rateLimit.ts` | Rate limiting | `rateLimit()`, `checkRateLimit()` |
| `logger.ts` | Logging utilities | `log()`, `logError()`, `logInfo()` |
| `users.ts` | User management | `getUser()`, `updateUser()`, `updateUserRole()` |

---

## 🗄️ Database Schema

### Migrations (`migrations/`)

| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | Initial database schema (tables, RLS policies) |
| `002_seed_data.sql` | Seed data (initial admin user, tags) |
| `003_comments_schema.sql` | Comments system schema |
| `004_fulltext_search.sql` | Full-text search indexes |
| `005_add_spanish_language.sql` | Spanish language support |

### Database Tables

**Core Tables:**
- `profiles` - User profiles with roles (admin, editor, user)
- `blog_posts` - Blog posts with multi-language content
- `tags` - Post tags with multi-language names
- `comments` - Post comments with nested replies
- `bookmarks` - User bookmarks
- `share_tracking` - Share tracking data

**Key Features:**
- Row Level Security (RLS) enabled on all tables
- Full-text search with PostgreSQL GIN indexes
- Multi-language support (en, it, es)
- Automatic tag counting via database triggers
- View/read/share tracking

---

## 🧪 Testing Structure

### Test Files (`tests/`)

**E2E Tests (Playwright) - `tests/e2e/`:**
- `admin-flow.spec.ts` - Admin user flow tests
- `auth-flow.spec.ts` - Authentication flow tests
- `create-post.spec.ts` - Post creation tests
- `guest-journey.spec.ts` - Guest user journey tests

**Integration Tests (Vitest) - `tests/integration/`:**
- `auth.test.ts` - Authentication integration tests
- `blog-crud.test.ts` - Blog CRUD operation tests
- `comments.test.ts` - Comments system tests
- `permissions.test.ts` - Permission/RBAC tests

**Unit Tests:**
- Test files co-located with source files (`*.test.ts`)
- Examples: `src/lib/auth.test.ts`, `src/lib/csrf.test.ts`, `src/lib/rateLimit.test.ts`, etc.

**Test Scripts:**
- `npm run test` - Run all tests
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests only
- `npm run test:e2e` - E2E tests only
- `npm run test:all` - Run all test suites
- `npm run test:coverage` - Coverage report
- `npm run test:rls` - RLS policy testing

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, npm scripts |
| `next.config.ts` | Next.js config (images, headers, security) |
| `tsconfig.json` | TypeScript compiler options |
| `middleware.ts` | Next.js middleware (i18n, maintenance) |
| `netlify.toml` | Netlify deployment config |
| `vitest.config.ts` | Vitest test runner config |
| `playwright.config.ts` | Playwright E2E test config |
| `eslint.config.mjs` | ESLint linting rules |
| `postcss.config.mjs` | PostCSS config for Tailwind |

---

## 📖 Documentation Files

### Core Guides

| File | Description |
|------|-------------|
| `README.md` | Main project README with overview |
| `SETUP_GUIDE.md` | Complete setup instructions |
| `DATABASE_GUIDE.md` | Database schema and RLS guide |
| `DEPLOYMENT_GUIDE.md` | Production deployment guide |
| `TESTING_GUIDE.md` | Testing documentation |
| `WEBSITE_STRUCTURE.md` | Website architecture overview |
| `SEO_AND_SECURITY_GUIDE.md` | SEO and security best practices |

### Feature-Specific Documentation

| File | Description |
|------|-------------|
| `AI_AGENT_API_DOCUMENTATION.md` | AI Agent API documentation |
| `HOW_TO_GET_API_TOKEN.md` | API authentication guide |
| `CHART_SHORTCODES_GUIDE.md` | Chart shortcode usage |
| `ADSENSE_SETUP_GUIDE.md` | Google AdSense setup |
| `ANALYTICS_SETUP.md` | Analytics configuration |
| `SPANISH_LANGUAGE_SETUP.md` | Spanish language setup |
| `CREWAI_INTEGRATION_GUIDE.md` | CrewAI integration guide |

### Reference Documents

| File | Description |
|------|-------------|
| `TODO.md` | Project task tracking |
| `SECURITY_CHECKLIST.md` | Security audit checklist |
| `MANUAL_TESTING_CHECKLIST.md` | Manual testing checklist |
| `MAINTENANCE.md` | Maintenance mode guide |
| `CLEANUP_SUMMARY.md` | Code cleanup summary |
| `CODE_QUALITY_AUDIT.md` | Code quality audit |

### SQL Scripts

| File | Description |
|------|-------------|
| `migrations/*.sql` | Database migrations |
| `fix_all_security_warnings.sql` | Security fixes |
| `update_admin_role.sql` | Admin role updates |
| `FIX_ADMIN_ROLE.sql` | Admin role fixes |
| `supabase_*.sql` | Supabase setup scripts |

---

## 🔨 Scripts & Utilities

### Python Scripts (`scripts/`)

| File | Purpose |
|------|---------|
| `crewai_simple_tool.py` | CrewAI integration tool for blog creation |
| `crewai_example.py` | CrewAI example script |
| `crewai_blog_tool.py` | Blog-specific CrewAI tool |
| `create-post-simple.py` | Simple post creation script |
| `create-post-ultra-simple.py` | Ultra-simple post creation |
| `ai-agent-example.py` | AI agent example |
| `ai-agent-with-login.py` | AI agent with authentication |
| `test-rls.ts` | RLS policy testing script |
| `config.json.example` | Example configuration file |

### PowerShell Scripts

| File | Purpose |
|------|---------|
| `start-dev.ps1` | Development server startup |
| `test-api.ps1` | API testing script |

### JSON Test Files

| File | Purpose |
|------|---------|
| `test-api-with-charts.json` | API test with charts |
| `test-simple.json` | Simple API test |

---

## 🔑 Key Features & Capabilities

### Multi-Language Support
- **Languages:** English (en), Italian (it), Spanish (es)
- **Implementation:** URL-based routing (`/[lang]/...`)
- **Storage:** Multi-language columns in database (`title_en`, `title_it`, `title_es`)
- **Translation:** `src/lib/translations.ts` for UI translations

### Authentication & Authorization
- **Provider:** Supabase Auth
- **Roles:** Admin, Editor, User
- **Implementation:** `src/lib/auth.ts`, `src/contexts/AuthContext.tsx`
- **Protection:** Middleware + role checks

### Blog Management
- **CRUD:** Full create, read, update, delete operations
- **Editor:** TipTap rich text editor
- **Status:** Draft/Published with scheduled publishing
- **Features:** Featured posts, categories, tags, cover images
- **Tracking:** Views, reads, shares

### Content Features
- **Charts:** Interactive charts via shortcodes (`[chart:type:data]`)
- **Comments:** Nested comment system
- **Bookmarks:** User bookmarking functionality
- **Search:** Full-text search with PostgreSQL
- **SEO:** Schema.org markup, Open Graph, Twitter Cards

### Analytics & Tracking
- **Metrics:** Views, reads, shares
- **Dashboard:** Analytics dashboard for admins/editors
- **Implementation:** `src/lib/analytics.ts`, `src/lib/shareTracking.ts`

### Security
- **RLS:** Row Level Security on all tables
- **CSRF:** CSRF protection (`src/lib/csrf.ts`)
- **Rate Limiting:** Rate limiting (`src/lib/rateLimit.ts`)
- **Headers:** Security headers in `next.config.ts`
- **Cookies:** Secure cookie handling

### SEO & Performance
- **Sitemap:** Dynamic sitemap generation
- **RSS:** RSS feed generation
- **Schema:** Schema.org structured data
- **Meta Tags:** Open Graph, Twitter Cards
- **Caching:** Cache headers configured
- **Images:** Optimized image handling

---

## 🚀 Getting Started

### Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables

Required variables (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MAINTENANCE_MODE=false
MAINTENANCE_PASSWORD=your_password
```

### Database Setup

1. Run migrations in order:
   ```bash
   # Apply migrations via Supabase dashboard or CLI
   migrations/001_initial_schema.sql
   migrations/002_seed_data.sql
   migrations/003_comments_schema.sql
   migrations/004_fulltext_search.sql
   migrations/005_add_spanish_language.sql
   ```

2. Verify RLS policies are enabled
3. Create initial admin user (via seed data or manually)

---

## 📝 Code Patterns & Conventions

### File Naming
- **Components:** PascalCase (`BlogCard.tsx`)
- **Utilities:** camelCase (`blog.ts`, `auth.ts`)
- **Types:** camelCase (`blog.ts`, `user.ts`)
- **Tests:** `*.test.ts` or `*.spec.ts`

### Component Structure
- **Server Components:** Default (no `'use client'`)
- **Client Components:** Marked with `'use client'`
- **Layouts:** `layout.tsx` files
- **Pages:** `page.tsx` files

### TypeScript
- **Strict mode:** Enabled
- **Types:** Defined in `src/types/`
- **Interfaces:** Used for object shapes
- **Types:** Used for unions, primitives

### Styling
- **Framework:** Tailwind CSS
- **Approach:** Utility-first
- **Theme:** Dark mode support via `next-themes`

---

## 🔍 Finding Code

### Common Tasks

**Add a new page:**
- Create `src/app/[lang]/your-page/page.tsx`
- Add translations to `src/lib/translations.ts`
- Update navigation in `src/components/layout/Header.tsx`

**Add a new API route:**
- Create `src/app/api/your-route/route.ts`
- Export `GET`, `POST`, etc. functions

**Add a new component:**
- Create in appropriate `src/components/` subdirectory
- Export from `index.ts` if needed

**Add a new utility function:**
- Add to appropriate `src/lib/` file or create new file
- Export function

**Modify database schema:**
- Create new migration in `migrations/`
- Update types in `src/types/` if needed
- Update RLS policies if needed

---

## 📊 Project Statistics

- **Total Components:** ~50+
- **API Routes:** 2
- **Library Functions:** 15+
- **Database Tables:** 6+
- **Test Files:** 20+
- **Documentation Files:** 20+

---

## 🔗 External Dependencies

### Core Dependencies
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Supabase** - Backend (PostgreSQL, Auth, Storage)
- **Tailwind CSS 4** - Styling
- **TipTap** - Rich text editor
- **Chart.js** - Charts
- **next-themes** - Dark mode

### Development Dependencies
- **Vitest** - Unit/integration testing
- **Playwright** - E2E testing
- **ESLint** - Linting
- **TypeScript** - Type checking

---

## 📞 Support & Resources

- **Documentation:** See individual guide files
- **Issues:** Check `TODO.md` for known issues
- **Security:** See `SECURITY_CHECKLIST.md`
- **Testing:** See `TESTING_GUIDE.md`
- **Deployment:** See `DEPLOYMENT_GUIDE.md`

---

**Last Indexed:** January 2025  
**Maintained by:** Development Team

