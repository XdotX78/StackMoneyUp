# 🔗 Agent Setup Guide - Connect Agent to Website

Complete guide to connect your CrewAI agents to the website.

---

## 📋 What You Need

1. **API Token** - To authenticate agent calls to `/api/blog/create`
2. **Agent Service** - Python FastAPI service running
3. **Environment Variables** - Configured in both services
4. **Dashboard UI** - (Optional) Button to trigger agents

---

## 🔑 Step 1: Get API Token

Your agent needs a token to call `/api/blog/create`. You have 3 options:

### Option A: Get Token from Browser (Easiest)

1. **Login to Dashboard**
   - Go to https://stackmoneyup.com/en/login
   - Login with your editor/admin account

2. **Open DevTools** (F12)
   - Go to **Application** tab → **Cookies**
   - Find cookie: `sb-qhxettplmhkwmmcgrcef-auth-token`
   - Copy the entire value (it's a JSON string)

3. **Extract Access Token**
   - The cookie value is JSON, parse it to get `access_token`
   - Or use the script below to get it programmatically

### Option B: Login Programmatically (Recommended for Agents)

Create a script to get token automatically:

```python
# scripts/get_token.py
import requests
import json
import os

SUPABASE_URL = "https://qhxettplmhkwmmcgrcef.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E"

EMAIL = os.getenv("STACKMONEYUP_EMAIL", "fcarp78@icloud.com")
PASSWORD = os.getenv("STACKMONEYUP_PASSWORD", "")

if not PASSWORD:
    print("❌ Set STACKMONEYUP_PASSWORD environment variable")
    exit(1)

# Login
response = requests.post(
    f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
    headers={
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    },
    json={"email": EMAIL, "password": PASSWORD}
)

if response.status_code == 200:
    token = response.json()["access_token"]
    print(f"\n✅ Token obtained!")
    print(f"\nToken: {token}")
    print(f"\nSet it with:")
    print(f"export STACKMONEYUP_API_TOKEN='{token}'")
else:
    print(f"❌ Login failed: {response.json()}")
```

Run it:
```bash
export STACKMONEYUP_PASSWORD="your-password"
python scripts/get_token.py
```

### Option C: Use Service Account Token (Long-lived)

For production, create a service account and use a long-lived token.

---

## 🐍 Step 2: Set Up Agent Service

### 2.1 Install Dependencies

```bash
pip install fastapi uvicorn requests crewai crewai-tools
```

### 2.2 Set Environment Variables

Create `.env` file in project root or set environment variables:

```bash
# Agent Service Environment Variables
STACKMONEYUP_API_TOKEN=your-token-from-step-1
STACKMONEYUP_URL=https://stackmoneyup.com  # or http://localhost:3000 for dev
```

Or export them:
```bash
export STACKMONEYUP_API_TOKEN="your-token-here"
export STACKMONEYUP_URL="https://stackmoneyup.com"
```

### 2.3 Run Agent Service

```bash
# Development (with auto-reload)
uvicorn scripts.agent_service:app --reload --port 8000

# Production
python scripts/agent_service.py
```

The service will run on `http://localhost:8000`

---

## 🌐 Step 3: Configure Next.js Website

### 3.1 Set Environment Variables

Add to `.env.local`:

```bash
# Agent Service URL
AGENT_SERVICE_URL=http://localhost:8000  # For development
# AGENT_SERVICE_URL=https://agent.yourdomain.com  # For production
```

### 3.2 Test the Connection

The API route is already created at `/api/agent/generate`. Test it:

```bash
# From your Next.js app (after login)
curl -X POST http://localhost:3000/api/agent/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "topic": "compound interest",
    "category": "Investing",
    "tags": ["investing", "compound-interest"]
  }'
```

---

## 🔄 Step 4: How It Works

```
1. Dashboard → POST /api/agent/generate
   ↓
2. Next.js API → Calls Agent Service
   ↓
3. Agent Service → Starts CrewAI Agent (background)
   ↓
4. CrewAI Agent → Calls create_blog_post tool
   ↓
5. Tool → POST /api/blog/create (with token)
   ↓
6. Blog Post Created (DRAFT)
```

---

## ✅ Step 5: Test Everything

### Test 1: Agent Service Health

```bash
curl http://localhost:8000/health
# Should return: {"status": "ok", "service": "agent-service"}
```

### Test 2: Generate Article

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "test article",
    "category": "Investing",
    "tags": ["test"]
  }'
```

### Test 3: From Website

1. Login to dashboard
2. Call `/api/agent/generate` endpoint
3. Check agent service logs
4. Article should appear in dashboard as DRAFT

---

## 🚨 Troubleshooting

### Agent Service Not Starting

```bash
# Check if port 8000 is available
lsof -i :8000

# Or use different port
uvicorn scripts.agent_service:app --port 8001
# Update AGENT_SERVICE_URL in .env.local
```

### Token Not Working

```bash
# Test token manually
curl -X POST https://stackmoneyup.com/api/blog/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title_en": "Test", ...}'

# If 401, token expired - get new one
# If 403, check user role (must be editor/admin)
```

### Agent Service Can't Reach Website

```bash
# Check if website is accessible
curl http://localhost:3000/api/blog/create

# Update STACKMONEYUP_URL in agent service
export STACKMONEYUP_URL="http://localhost:3000"  # or your production URL
```

### CORS Errors

The agent service already has CORS enabled. If you see CORS errors:
- Check `AGENT_SERVICE_URL` matches exactly
- Verify agent service is running
- Check browser console for exact error

---

## 📝 Quick Start Checklist

- [ ] Get API token (Step 1)
- [ ] Install Python dependencies (Step 2.1)
- [ ] Set `STACKMONEYUP_API_TOKEN` (Step 2.2)
- [ ] Run agent service (Step 2.3)
- [ ] Set `AGENT_SERVICE_URL` in Next.js (Step 3.1)
- [ ] Test connection (Step 3.2)
- [ ] Generate test article (Step 5)

---

## 🎯 Next Steps

Once everything is connected:

1. **Add Dashboard UI** - Button to trigger article generation
2. **Add Status Tracking** - Show job status in dashboard
3. **Add Error Handling** - Better error messages
4. **Production Deployment** - Deploy agent service to server

---

## 📚 Related Files

- `scripts/agent_service.py` - Agent service code
- `src/app/api/agent/generate/route.ts` - Next.js API route
- `scripts/crewai_blog_tool.py` - Tool that calls /api/blog/create
- `HOW_TO_GET_API_TOKEN.md` - Detailed token guide

---

**Need help?** Check the logs:
- Agent service: Console output
- Next.js: Terminal where `npm run dev` is running
- Browser: DevTools Console


