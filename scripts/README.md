# 🤖 AI Agent Scripts

Scripts for AI agents to interact with the StackMoneyUp blog API.

## 📁 Files

- `ai-agent-example.py` - Python script to create blog posts (requires manual token)
- `ai-agent-with-login.py` - **✨ RECOMMENDED** - Auto-login script (no manual token needed!)
- `crewai_blog_tool.py` - **🤖 CREWAI** - Tool for CrewAI agents to create posts
- `crewai_example.py` - Complete CrewAI example with agent and task

## 🚀 Quick Start

### ⚡ Method A: Auto-Login (FASTEST - RECOMMENDED)

No need to copy tokens manually!

```bash
# 1. Install dependencies
pip install requests

# 2. Set your credentials
export STACKMONEYUP_EMAIL="your@email.com"
export STACKMONEYUP_PASSWORD="your-password"

# Or on Windows PowerShell:
$env:STACKMONEYUP_EMAIL="your@email.com"
$env:STACKMONEYUP_PASSWORD="your-password"

# 3. Run the script
python ai-agent-with-login.py
```

**Done!** The script will login automatically and create a test post.

---

### 🔧 Method B: Manual Token (Alternative)

If you prefer to use a token manually:

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

## 🤖 CrewAI Integration

If you're using CrewAI, use the dedicated tool:

```python
from crewai_tools import tool
from scripts.crewai_blog_tool import create_blog_post

agent = Agent(
    role='Blog Writer',
    tools=[create_blog_post],
    ...
)
```

**Full documentation:** See `CREWAI_INTEGRATION_GUIDE.md` in the root directory.

**Quick test:**
```bash
export STACKMONEYUP_API_TOKEN="your-token-here"
python scripts/crewai_example.py
```

---

## 🔗 Useful Links

- API Endpoint: `https://stackmoneyup.com/api/blog/create`
- Dashboard: `https://stackmoneyup.com/dashboard`
- Edit Posts: `https://stackmoneyup.com/dashboard/posts`
- CrewAI Guide: `../CREWAI_INTEGRATION_GUIDE.md`
- Chart Shortcodes: `../CHART_SHORTCODES_GUIDE.md`

