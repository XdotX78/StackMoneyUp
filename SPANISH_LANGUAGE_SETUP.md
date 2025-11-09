# 🇪🇸 Spanish Language Setup Guide

This guide explains how to enable Spanish (ES) as the third language on StackMoneyUp.

## ✅ What's Been Done (Frontend)

The frontend code is **already updated** with Spanish support:

- ✅ **Type System**: `Language` type now includes `'es'`
- ✅ **Translations**: Complete Spanish UI translations added
- ✅ **Routes**: `/es/` routes enabled in middleware
- ✅ **Language Switcher**: Spanish flag 🇪🇸 added to dropdown
- ✅ **Metadata**: SEO tags, Open Graph, and Twitter Cards support ES
- ✅ **Sitemap**: All `/es/` routes included
- ✅ **RSS Feed**: Spanish RSS available at `/es/rss?lang=es`
- ✅ **robots.txt**: Spanish sitemap reference added

## 🔧 What You Need to Do (Database)

You need to run a **single SQL migration** to add Spanish fields to your database.

### Step 1: Apply Database Migration

1. **Go to Supabase Dashboard**
   - Navigate to: https://app.supabase.com/project/qhxettplmhkwmmcgrcef/sql/new

2. **Copy the Migration**
   - Open: `migrations/005_add_spanish_language.sql`
   - Copy the entire file contents

3. **Run the Migration**
   - Paste into Supabase SQL Editor
   - Click **"Run"**
   - Wait for success message

### What the Migration Does

The migration adds these columns:

**blog_posts table:**
- `title_es` (TEXT, NOT NULL)
- `excerpt_es` (TEXT, NOT NULL)
- `content_es` (TEXT, NOT NULL)

**tags table:**
- `name_es` (TEXT, NOT NULL)
- `description_es` (TEXT, NULL)

**Important:** Existing posts will have Spanish fields automatically filled with English content as a default. You can update them later via the editor.

### Step 2: Verify Migration Success

Run this query in Supabase SQL Editor to verify:

```sql
-- Check blog_posts columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name LIKE '%_es';

-- Check tags columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tags' AND column_name LIKE '%_es';
```

You should see the new Spanish columns.

## 🎨 Blog Editor (Next Step)

After the database migration, the next phase is to update the blog editor to include Spanish tabs.

**Current Editor:**
- English Tab (title, excerpt, content)
- Italian Tab (title, excerpt, content)

**Planned Editor:** *(Next TODO)*
- Tabs for: Title/Slug/Tags (multi-language)
- Tabs for: Content/Excerpt (multi-language)
- Each tab will have: EN | IT | ES

This is covered in TODO: `review-blog-multilang-architecture`

## 🚀 Testing Spanish Pages

After applying the migration, you can immediately test:

1. **Homepage**: https://stackmoneyup.com/es
2. **Blog**: https://stackmoneyup.com/es/blog
3. **About**: https://stackmoneyup.com/es/about
4. **Contact**: https://stackmoneyup.com/es/contact
5. **Language Switcher**: Click 🌐 in header → Select "Español"

## 📝 Translation Quality

All Spanish translations have been professionally written for:
- Financial terminology accuracy
- Natural Spanish phrasing
- Consistent tone with EN/IT versions

**Coverage:**
- ✅ Navigation & UI
- ✅ Blog interface
- ✅ Authentication pages
- ✅ Dashboard
- ✅ Forms & buttons
- ✅ Error messages
- ✅ Category names
- ✅ Footer & legal

## 🔄 Next Steps

1. **Apply Migration** ← **DO THIS FIRST**
2. Create new blog posts with Spanish content
3. Update existing posts with Spanish translations (optional)
4. Test all `/es/` routes in production
5. Implement multi-language tabs in editor (next TODO)

## ❓ FAQ

**Q: Will existing blog posts break?**
A: No. The migration sets English content as the default for Spanish fields.

**Q: Do I need to translate all posts immediately?**
A: No. Posts will display English content in Spanish tabs until you add Spanish translations.

**Q: What about SEO?**
A: All SEO tags (hreflang, alternate, canonical) are already configured for ES.

**Q: Can I test locally first?**
A: Yes! Run the migration on your local Supabase database first (if you have one).

---

**Ready?** → Go apply `migrations/005_add_spanish_language.sql` in Supabase SQL Editor! 🚀

