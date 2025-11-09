# 💰 StackMoneyUp - Personal Finance Blog Platform

A modern, multi-language blog platform built with Next.js 16, React 19, and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-green)](https://supabase.com/)

---

## ✨ Features

- 🌍 **Multi-language** support (English/Italian/Spanish)
- ✍️ **Rich text editor** with TipTap
- 📊 **Interactive charts** with Chart.js (line, bar, pie)
- 🤖 **AI Agent API** for automated content creation
- 🔐 **Role-based access** (admin/editor/user)
- 📈 **Analytics dashboard** (views, reads, shares)
- 🔍 **Full-text search** with PostgreSQL
- 💬 **Comments system** with nested replies
- 🔖 **Bookmarking** for favorite posts
- 📱 **Fully responsive** design
- 🌓 **Dark mode** support
- 🍪 **GDPR/CCPA compliant** cookie consent
- 💰 **Google AdSense** integration (ready to enable)
- 🎨 **SEO optimized** with schema.org markup
- 🔒 **Row Level Security** (RLS) with Supabase
- 🚀 **Production-ready** with CI/CD

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/stackmoneyup.git
cd stackmoneyup

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Documentation

### Core Guides

| Guide | Description | Files Merged |
|-------|-------------|--------------|
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Complete Supabase & Auth setup | 5 files |
| **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** | Database schema, RLS, search | 4 files |
| **[SEO_AND_SECURITY_GUIDE.md](SEO_AND_SECURITY_GUIDE.md)** | SEO optimization & security fixes | 7 files |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Production deployment | 3 files |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | Unit, integration, E2E tests | 3 files |

### Reference Documents

- **[TODO.md](TODO.md)** - Project task tracking
- **[WEBSITE_STRUCTURE.md](WEBSITE_STRUCTURE.md)** - Site architecture
- **[MAINTENANCE.md](MAINTENANCE.md)** - Maintenance mode guide
- **[SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)** - Security audit checklist
- **[MANUAL_TESTING_CHECKLIST.md](MANUAL_TESTING_CHECKLIST.md)** - Testing checklist
- **[ANALYTICS_SETUP.md](ANALYTICS_SETUP.md)** - Analytics configuration

### AI Agent & Charts

- **[AI_AGENT_API_DOCUMENTATION.md](AI_AGENT_API_DOCUMENTATION.md)** - API for AI content creation
- **[HOW_TO_GET_API_TOKEN.md](HOW_TO_GET_API_TOKEN.md)** - Authentication guide
- **[CHART_SHORTCODES_GUIDE.md](CHART_SHORTCODES_GUIDE.md)** - Interactive chart documentation
- **[scripts/](scripts/)** - Python examples for AI agents
- **[ADSENSE_SETUP_GUIDE.md](ADSENSE_SETUP_GUIDE.md)** 💰 - Google AdSense monetization (ready to enable)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **TipTap** - Rich text editor
- **next-themes** - Dark mode

### Backend
- **Supabase** - PostgreSQL database, Auth, Storage
- **Row Level Security (RLS)** - Data access control
- **PostgreSQL Full-Text Search** - Fast search with GIN indexes

### DevOps
- **Netlify/Vercel** - Hosting
- **GitHub Actions** - CI/CD
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## 📋 Project Status

**Completion:** ~85%  
**Status:** Security fixes + SEO optimization in progress

### ✅ Completed
- Core blog functionality (CRUD)
- Multi-language support
- Role-based access control
- Comments system
- Full-text search
- Dark mode
- Cookie consent (GDPR/CCPA)
- Analytics dashboard
- 84 unit tests passing

### 🚧 In Progress
- Supabase security fixes (9 warnings)
- SEO optimization (Phase 1)
- Content protection
- Manual production testing

### 📅 Planned
- Error monitoring (Sentry)
- Advanced SEO (Phase 2)
- Newsletter integration
- Multi-author system

---

## 🗂 Project Structure

```
stackmoneyup/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [lang]/             # Multi-language routes
│   │   │   ├── blog/           # Blog pages
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   └── ...
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── blog/               # Blog-specific components
│   │   ├── layout/             # Layout components
│   │   ├── ui/                 # UI components
│   │   └── ...
│   ├── lib/                    # Utility functions
│   │   ├── auth.ts             # Authentication
│   │   ├── blog.ts             # Blog operations
│   │   ├── supabaseClient.ts   # Supabase client
│   │   └── ...
│   ├── types/                  # TypeScript types
│   ├── hooks/                  # Custom React hooks
│   └── contexts/               # React contexts
├── public/                     # Static assets
├── migrations/                 # Database migrations
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # E2E tests
├── scripts/                    # Utility scripts
└── [documentation files]       # Guides and checklists
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Unit tests
npm run test:unit

# Integration tests (requires test database)
npm run test:integration

# E2E tests (requires test environment)
npm run test:e2e

# RLS policy testing
npm run test:rls

# Test with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

---

## 🚀 Deployment

### Quick Deploy

**Netlify (Recommended):**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
MAINTENANCE_MODE=false
MAINTENANCE_PASSWORD=your_secure_password
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions.

---

## 🔒 Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Role-based access control (RBAC)
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ Content Security Policy
- ✅ Secure cookies (HttpOnly, Secure, SameSite)
- 🚧 Supabase function security fixes in progress

See [SEO_AND_SECURITY_GUIDE.md](SEO_AND_SECURITY_GUIDE.md) for security setup.

---

## 📈 SEO

- ✅ Schema.org structured data (BlogPosting)
- ✅ Open Graph meta tags
- ✅ Twitter Card meta tags
- ✅ Canonical URLs
- ✅ Multi-language sitemap
- ✅ RSS feed (controlled)
- ✅ Reading progress indicator
- 🚧 Enhanced schema with breadcrumbs (in progress)
- 🚧 Content protection (in progress)

See [SEO_AND_SECURITY_GUIDE.md](SEO_AND_SECURITY_GUIDE.md) for SEO optimization.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform
- [TipTap](https://tiptap.dev/) - Rich text editor
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📧 Contact

**Project Link:** [https://github.com/yourusername/stackmoneyup](https://github.com/yourusername/stackmoneyup)

---

**Built with ❤️ for the personal finance community**
