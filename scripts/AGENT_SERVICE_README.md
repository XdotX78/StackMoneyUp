# 🤖 Agent Service - Run CrewAI Agents Separately

## Overview

This service runs your existing CrewAI agents as a separate Python service.
It can be triggered from your Next.js website.

## Architecture

```
Next.js Website
    ↓ POST /api/agent/generate
Agent Service (Python/FastAPI)
    ↓ Executes CrewAI Agent
    ↓ Calls /api/blog/create
Blog Post Created
```

## Setup

### 1. Install Dependencies

```bash
pip install fastapi uvicorn requests crewai crewai-tools
```

### 2. Set Environment Variables

```bash
# In your .env or environment
STACKMONEYUP_API_TOKEN=your-token-here
AGENT_SERVICE_URL=http://localhost:8000  # In Next.js .env.local
```

### 3. Run the Service

```bash
# Option A: Direct Python
python scripts/agent_service.py

# Option B: Uvicorn
uvicorn scripts.agent_service:app --host 0.0.0.0 --port 8000

# Option C: With reload (development)
uvicorn scripts.agent_service:app --reload --port 8000
```

## Usage

### From Next.js Website

```typescript
// In your dashboard component
const response = await fetch('/api/agent/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'compound interest',
    category: 'Investing',
    tags: ['investing', 'compound-interest']
  })
});

const { job_id, status } = await response.json();
```

### Direct API Call

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "compound interest",
    "category": "Investing",
    "tags": ["investing"]
  }'
```

### Check Status

```bash
curl http://localhost:8000/status/{job_id}
```

## How It Works

1. **Next.js calls** `/api/agent/generate` with topic
2. **Next.js API** forwards to agent service
3. **Agent service** starts CrewAI agent in background
4. **Agent** generates article using your existing CrewAI setup
5. **Agent** calls `/api/blog/create` via the tool
6. **Article** is created as DRAFT

## Production Deployment

### Option A: Same Server (Recommended)

Run agent service on same server as Next.js:

```bash
# Use PM2 or systemd to keep it running
pm2 start scripts/agent_service.py --interpreter python3
```

### Option B: Separate Server

Run agent service on dedicated server/container:

```bash
# Set AGENT_SERVICE_URL in Next.js to point to agent server
AGENT_SERVICE_URL=https://agent.yourdomain.com
```

### Option C: Serverless Functions

Deploy agent service as serverless function (Vercel, Netlify Functions, etc.)

## Environment Variables

**Agent Service:**
- `STACKMONEYUP_API_TOKEN` - Token for calling /api/blog/create
- `PORT` - Port to run on (default: 8000)

**Next.js:**
- `AGENT_SERVICE_URL` - URL of agent service (default: http://localhost:8000)

## Notes

- ✅ Keeps your existing CrewAI agents
- ✅ Runs separately (no timeout issues)
- ✅ Can be triggered from website
- ✅ Agent calls back to website when done
- ⚠️ Requires Python service running
- ⚠️ For production, use Redis/DB for job storage instead of in-memory


