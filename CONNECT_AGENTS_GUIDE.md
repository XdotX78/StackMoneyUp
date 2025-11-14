# 🔗 Complete Guide: Connect CrewAI Agents to Website

**Step-by-step guide to connect your CrewAI agents to the StackMoneyUp website.**

---

## 🎯 What We're Building

```
Dashboard (Website)
    ↓ Click "Generate Article"
    ↓ POST /api/agent/generate
Agent Service (Python)
    ↓ Runs CrewAI Agent
    ↓ Calls /api/blog/create
Blog Post Created (DRAFT)
```

---

## ✅ Prerequisites

- ✅ Python 3.8+ installed
- ✅ Node.js 18+ installed (for website)
- ✅ Your CrewAI agents already built
- ✅ Editor/Admin account on website

---

## 📋 Step-by-Step Setup

### Step 1: Get API Token

Your agent needs a token to authenticate with the website API.

#### Option A: Automatic (Recommended)

```bash
# 1. Set your password
export STACKMONEYUP_PASSWORD="your-password"

# 2. Get token automatically
python scripts/get_token.py
```

The script will output your token. Copy it!

#### Option B: Manual

1. Login to https://stackmoneyup.com/en/login
2. Open DevTools (F12) → Application → Cookies
3. Find cookie: `sb-qhxettplmhkwmmcgrcef-auth-token`
4. Copy the value (it's JSON)
5. Parse it to get `access_token`

---

### Step 2: Install Python Dependencies

```bash
# Install required packages
pip install fastapi uvicorn requests crewai crewai-tools
```

---

### Step 3: Configure Agent Service

Set environment variables for the agent service:

```bash
# Set your API token (from Step 1)
export STACKMONEYUP_API_TOKEN="your-token-here"

# Set website URL
export STACKMONEYUP_URL="https://stackmoneyup.com"
# Or for local development:
# export STACKMONEYUP_URL="http://localhost:3000"
```

**Or create `.env` file:**

```bash
# .env (in project root)
STACKMONEYUP_API_TOKEN=your-token-here
STACKMONEYUP_URL=https://stackmoneyup.com
```

---

### Step 4: Test Connection

Before running the full agent service, test if your token works:

```bash
python scripts/test_connection.py
```

**Expected output:**
```
✅ SUCCESS! Connection works!
   Post ID: xxx
   Slug: test-connection-article
```

If you see errors:
- **401 Unauthorized**: Token expired → Get new token (Step 1)
- **403 Forbidden**: Account not editor/admin → Check your role
- **Network error**: Website not accessible → Check URL

---

### Step 5: Run Agent Service

Start the agent service:

```bash
# Development (with auto-reload)
uvicorn scripts.agent_service:app --reload --port 8000

# Or production
python scripts/agent_service.py
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test agent service:**
```bash
curl http://localhost:8000/health
# Should return: {"status": "ok", "service": "agent-service"}
```

---

### Step 6: Configure Next.js Website

Add to `.env.local` (in project root):

```bash
# Agent Service URL
AGENT_SERVICE_URL=http://localhost:8000

# For production, use your agent service URL:
# AGENT_SERVICE_URL=https://agent.yourdomain.com
```

---

### Step 7: Test Full Flow

#### Test 1: Agent Service Directly

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "test article",
    "category": "Investing",
    "tags": ["test"]
  }'
```

**Expected response:**
```json
{
  "job_id": "xxx-xxx-xxx",
  "status": "processing",
  "message": "Article generation started for topic: test article"
}
```

#### Test 2: From Website API

```bash
# First, login to website and get session cookie
# Then call:
curl -X POST http://localhost:3000/api/agent/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "topic": "test article",
    "category": "Investing"
  }'
```

---

## 🎨 Step 8: Add Dashboard UI (Optional)

Create a button in your dashboard to trigger article generation.

**File:** `src/app/[lang]/dashboard/generate/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function GenerateArticlePage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/agent/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category: 'Investing',
          tags: []
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to generate article' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Article</h1>
      
      <div className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter article topic..."
          className="w-full p-2 border rounded"
        />
        
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !topic}
        >
          {loading ? 'Generating...' : 'Generate Article'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            {result.error ? (
              <p className="text-red-600">Error: {result.error}</p>
            ) : (
              <div>
                <p className="text-green-600">✅ {result.message}</p>
                <p>Job ID: {result.job_id}</p>
                <p>Status: {result.status}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔍 Troubleshooting

### Agent Service Won't Start

```bash
# Check if port 8000 is in use
lsof -i :8000

# Use different port
uvicorn scripts.agent_service:app --port 8001
# Update AGENT_SERVICE_URL in .env.local
```

### Token Not Working

```bash
# Test token manually
python scripts/test_connection.py

# If 401, get new token
python scripts/get_token.py
```

### Agent Service Can't Reach Website

```bash
# Check website URL
echo $STACKMONEYUP_URL

# Test website is accessible
curl http://localhost:3000/api/blog/create
# Should return 401 (unauthorized, but website is up)
```

### CORS Errors

The agent service already has CORS enabled. If you see CORS errors:
- Check `AGENT_SERVICE_URL` matches exactly
- Verify agent service is running
- Check browser console for exact error

---

## 📝 Quick Checklist

- [ ] Got API token (`python scripts/get_token.py`)
- [ ] Set `STACKMONEYUP_API_TOKEN` environment variable
- [ ] Tested connection (`python scripts/test_connection.py`)
- [ ] Installed Python dependencies (`pip install fastapi uvicorn...`)
- [ ] Started agent service (`python scripts/agent_service.py`)
- [ ] Set `AGENT_SERVICE_URL` in `.env.local`
- [ ] Tested agent service (`curl http://localhost:8000/health`)
- [ ] Tested full flow (generate article)

---

## 🚀 Production Deployment

### Option A: Same Server

Run agent service on same server as Next.js:

```bash
# Use PM2 to keep it running
pm2 start scripts/agent_service.py --interpreter python3 --name agent-service
```

### Option B: Separate Server

1. Deploy agent service to separate server/container
2. Update `AGENT_SERVICE_URL` in Next.js to point to agent server
3. Set up reverse proxy (nginx) if needed

### Option C: Serverless

Deploy agent service as serverless function (Vercel, Netlify Functions, etc.)

---

## 📚 Files Created

- `scripts/get_token.py` - Get API token automatically
- `scripts/test_connection.py` - Test connection to website
- `scripts/agent_service.py` - Agent service (already created)
- `src/app/api/agent/generate/route.ts` - Next.js API route (already created)
- `CONNECT_AGENTS_GUIDE.md` - This guide

---

## 🆘 Still Stuck?

1. **Check logs:**
   - Agent service: Terminal where it's running
   - Next.js: Terminal where `npm run dev` is running
   - Browser: DevTools Console

2. **Verify each step:**
   - Token is valid (test with `test_connection.py`)
   - Agent service is running (`curl http://localhost:8000/health`)
   - Environment variables are set (`echo $STACKMONEYUP_API_TOKEN`)

3. **Common issues:**
   - Token expired → Get new one
   - Wrong URL → Check `STACKMONEYUP_URL`
   - Port conflict → Use different port
   - Permission denied → Check user role (must be editor/admin)

---

**You're all set!** 🎉

Start with Step 1 and work through each step. If you get stuck at any step, let me know!


