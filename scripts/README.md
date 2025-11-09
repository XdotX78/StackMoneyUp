# 🤖 AI Agent Scripts

Scripts for AI agents to interact with the StackMoneyUp blog API.

## 📁 Files

- `ai-agent-example.py` - Python script to create blog posts via API

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install requests
```

### 2. Get Authentication Token

**Option A: Use your session cookie (easiest)**
1. Login to https://stackmoneyup.com/dashboard
2. Open browser DevTools (F12)
3. Go to Application → Cookies
4. Copy the `sb-*-auth-token` value

**Option B: Get Bearer token from Supabase**
1. Go to Supabase Dashboard
2. API Settings → Generate new token
3. Copy the token

### 3. Set Token
```bash
export STACKMONEYUP_API_TOKEN="your-token-here"
```

Or edit `ai-agent-example.py` and set `AUTH_TOKEN` directly.

### 4. Run Script
```bash
python ai-agent-example.py
```

## 📖 Full Documentation

See `AI_AGENT_API_DOCUMENTATION.md` in the root directory for complete API documentation.

## 🔒 Security

- All posts are created as **DRAFTS**
- Manual review required before publishing
- Only editors/admins can create posts
- Authentication required

## ✅ Expected Output

```
🤖 AI Agent Blog Post Creator
==================================================

📝 Creating blog post...
Title (EN): The Compound Effect of Consistent Investing
Category: Investing
Tags: investing, compound-interest, passive-income, long-term, etf

✅ Post created successfully!
==================================================
Post ID: uuid-here
Slug: compound-effect-investing
Published: False (DRAFT)
Created: 2025-01-09T21:30:00Z

📋 Next Steps:
  - Review the post in the dashboard
  - Edit at: /dashboard/edit/compound-effect-investing
  - Publish manually when ready

🔗 Edit URL: https://stackmoneyup.com/dashboard/edit/compound-effect-investing
```

## 🐛 Troubleshooting

**Error 401 - Unauthorized**
- Check your token is correct
- Make sure you're logged in

**Error 403 - Forbidden**
- Your account needs editor or admin role
- Contact admin to upgrade your role

**Error 400 - Bad Request**
- Check all required fields are present
- Validate category is one of the allowed values
- Ensure tags is an array

## 💡 Tips

- Use meaningful slugs (auto-generated from title)
- Keep excerpts between 120-160 characters
- Use Markdown for content formatting
- Include cover images for better SEO
- Add relevant tags for discoverability

## 🔗 Useful Links

- API Endpoint: `https://stackmoneyup.com/api/blog/create`
- Dashboard: `https://stackmoneyup.com/dashboard`
- Edit Posts: `https://stackmoneyup.com/dashboard/posts`

