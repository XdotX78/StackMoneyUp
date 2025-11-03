# 🏗️ Website Structure Documentation

**Last Updated:** January 2025  
**Framework:** Next.js 16 (App Router)  
**Language:** TypeScript + React 19

---

## Project Overview

StackMoneyUp is a personal finance blog platform built with Next.js, featuring:
- Multi-language support (English/Italian)
- Role-based access control (Admin/Editor/User)
- Blog post management system
- Tag and category organization
- User authentication via Supabase

---

## Directory Structure

```
stackmoneyup/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [lang]/            # Multi-language routes
│   │   │   ├── about/
│   │   │   ├── blog/          # Blog listing and detail pages
│   │   │   ├── contact/
│   │   │   ├── dashboard/     # Admin/Editor dashboard
│   │   │   ├── login/
│   │   │   ├── privacy/
│   │   │   └── terms/
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── blog/              # Blog-related components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── layout/           # Layout components (Header, Footer)
│   │   ├── profile/          # User profile components
│   │   └── ui/               # Reusable UI components
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication state
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Auth state hook
│   │   └── useRole.ts        # Role checking hook
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Authentication functions
│   │   ├── blog.ts           # Blog CRUD operations
│   │   ├── storage.ts        # File upload utilities
│   │   ├── supabaseClient.ts # Supabase client setup
│   │   ├── translations.ts  # Multi-language translations
│   │   └── utils.ts          # General utilities
│   ├── types/                # TypeScript type definitions
│   │   └── blog.ts           # Blog-related types
│   └── styles/               # Global styles
├── public/                   # Static assets
├── middleware.ts             # Next.js middleware (i18n, maintenance)
└── package.json              # Dependencies
```

---

## Routing Structure

### Public Routes

All routes are prefixed with language code (`en` or `it`):

- `/` → Home page
- `/[lang]/blog` → Blog listing page
- `/[lang]/blog/[slug]` → Individual blog post
- `/[lang]/about` → About page
- `/[lang]/contact` → Contact page
- `/[lang]/privacy` → Privacy policy
- `/[lang]/terms` → Terms of service
- `/[lang]/login` → Login/Signup page
- `/[lang]/forgot-password` → Password reset request
- `/[lang]/reset-password` → Password reset form

### Protected Routes (Dashboard)

- `/[lang]/dashboard` → Dashboard home
- `/[lang]/dashboard/posts` → Manage posts
- `/[lang]/dashboard/new-post` → Create new post
- `/[lang]/dashboard/edit/[slug]` → Edit post
- `/[lang]/dashboard/tags` → Manage tags
- `/[lang]/dashboard/media` → Media library
- `/[lang]/dashboard/analytics` → Analytics dashboard
- `/[lang]/dashboard/profile` → User profile

---

## Key Components

### Layout Components

**`Header.tsx`**
- Navigation menu
- Language switcher
- Auth button (Login/Logout)
- Mobile menu

**`Footer.tsx`**
- Site links
- Social media links
- Copyright info

**`AuthButton.tsx`**
- Shows login button for guests
- Shows user menu for authenticated users
- Handles logout

### Blog Components

**`BlogGrid.tsx`**
- Displays blog posts in grid layout
- Responsive design

**`BlogCard.tsx`**
- Individual post card
- Shows title, excerpt, category, tags, read time

**`BlogEditor.tsx`**
- Rich text editor (TipTap)
- Multi-language content editing
- Image upload support

**`PostForm.tsx`**
- Complete post creation/editing form
- Handles all post fields (title, content, category, tags, etc.)
- SEO preview
- Scheduled publishing

**`SEOPreview.tsx`**
- Google, Facebook, Twitter preview
- Character count validation
- SEO recommendations

### Dashboard Components

**Dashboard Pages:**
- `posts/page.tsx` - List all posts with filtering, bulk actions
- `new-post/page.tsx` - Create new post
- `edit/[slug]/page.tsx` - Edit existing post
- `tags/page.tsx` - Tag management (CRUD)
- `media/page.tsx` - Media library (upload, view, delete)
- `analytics/page.tsx` - Post analytics (views, reads, shares)

---

## State Management

### Authentication State

**`AuthContext.tsx`**
- Global authentication state
- User session management
- Auth state change listener

**`useAuth` hook**
- Provides `user`, `session`, `loading`, `error`
- `refreshSession()` function

**`useRole` hook**
- Fetches user with role from `profiles` table
- Provides role checking functions: `isAdmin()`, `isEditor()`, `canManagePosts()`

### Local State

Most components use React hooks (`useState`, `useEffect`) for local state management. No global state management library (Redux, Zustand) is used.

---

## Data Flow

### Blog Posts

1. **Create/Update:**
   - User fills form in `PostForm.tsx`
   - Form data sent to `createPost()` or `updatePost()` in `src/lib/blog.ts`
   - Tags auto-created via `ensureTagsExist()`
   - Post saved to Supabase `blog_posts` table
   - Tag counts updated via database trigger

2. **Read:**
   - `getPublishedPosts()` - Fetches published posts for blog page
   - `getAllPosts()` - Fetches all posts for dashboard
   - `getPostBySlug()` - Fetches single post by slug
   - Views incremented via `incrementPostViews()`

3. **Delete:**
   - `deletePost()` - Deletes post and updates tag counts

### Tags

1. **Fetch:**
   - `getAllTags()` - Fetches all tags with post counts

2. **Create:**
   - Auto-created when posts are saved (if tag doesn't exist)

3. **Update:**
   - `updateTag()` - Updates tag name/slug (requires updating all posts with that tag)

4. **Delete:**
   - `deleteTag()` - Deletes tag (removes from all posts)

---

## Authentication Flow

1. **Signup:**
   - User fills form → `signUp()` in `src/lib/auth.ts`
   - Supabase creates user → `handle_new_user()` trigger creates profile
   - Email confirmation sent (if enabled)

2. **Login:**
   - User enters credentials → `signIn()` in `src/lib/auth.ts`
   - Session created → `AuthContext` updates state
   - User redirected to dashboard

3. **Role Check:**
   - `useRole()` hook fetches user with role from `profiles` table
   - Components check `isAdmin()` or `isEditor()` for permissions

---

## Multi-Language Support

### Language Detection

- URL parameter: `/[lang]/...`
- Default: English (`en`)
- Supported: English (`en`), Italian (`it`)

### Translation System

**`src/lib/translations.ts`**
- `getTranslations(lang)` - Returns translation object for language
- All UI text is translated
- Blog content is stored in database with `_en` and `_it` suffixes

### Implementation

- Blog posts: `title_en`, `title_it`, `content_en`, `content_it`
- Tags: `name_en`, `name_it`
- UI: Translation objects in `translations.ts`

---

## Styling

### CSS Framework

- **Tailwind CSS** - Utility-first CSS framework
- Custom configuration in `tailwind.config.js`

### Design System

- **Primary Color:** Emerald (green)
- **Typography:** Geist font family
- **Components:** Custom UI components in `src/components/ui/`

### Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Mobile menu for navigation

---

## API Routes

### Next.js API Routes

**`/api/maintenance/auth`**
- Verifies maintenance mode password
- Sets cookie for maintenance access

### Supabase Integration

All database operations go through Supabase client:
- Client-side: Uses `supabase` from `supabaseClient.ts`
- Server-side: Uses service role key for admin operations

---

## Environment Variables

Required environment variables (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=your_site_url
MAINTENANCE_MODE=false
MAINTENANCE_PASSWORD=your_password
```

---

## Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Deployment

- **Platform:** Netlify (configured via `netlify.toml`)
- **Build Command:** `npm run build`
- **Publish Directory:** `.next`

---

## Key Features

### Blog Management
- ✅ Create, read, update, delete posts
- ✅ Draft/published status
- ✅ Scheduled publishing
- ✅ Featured posts
- ✅ View/read/share tracking

### Content Organization
- ✅ Categories (free-form text)
- ✅ Tags (managed with auto-counting)
- ✅ Multi-language content
- ✅ Search and filtering

### User Management
- ✅ Role-based access (Admin/Editor/User)
- ✅ User profiles
- ✅ Avatar uploads
- ✅ Password reset

### Media Management
- ✅ Image upload to Supabase Storage
- ✅ Media library view
- ✅ Image deletion

---

## Future Enhancements

- [ ] Comments system
- [ ] Newsletter subscription
- [ ] RSS feed
- [ ] Dark mode
- [ ] Advanced analytics
- [ ] Multi-author support
- [ ] Content moderation

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TipTap Editor:** https://tiptap.dev/docs

