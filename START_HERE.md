# 🚀 START HERE - Connect Your Agents to Website

**Quick start guide - Get your agents connected in 5 minutes!**

---

## ⚡ Quick Start

### Step 1: Get Service Role Key

1. Go to: https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api
2. Find **"service_role secret"** key
3. Click **"Reveal"** and copy it

### Step 2: Configure CrewAI

In CrewAI, set:
- `STACKMONEYUP_AUTH` = Your service role key (never expires!)
- `STACKMONEYUP_URL` = `https://stackmoneyup.com`
- `STACKMONEYUP_EMAIL` = Your email

**Done!** Your agents are ready to use! 🚀

---

## 📋 Alternative: Manual Setup (For Testing)

If you want to test the connection manually:

---

## 📋 Manual Setup (Step-by-Step)

If the quick start doesn't work, follow these steps:

### Step 1: Get Service Role Key (Never Expires!)

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api

2. **Find Service Role Key:**
   - Scroll to "Project API keys"
   - Find **"service_role secret"** (NOT anon key!)
   - Click **"Reveal"** and copy the entire key

**✅ This key NEVER expires - use it forever!**

### Step 2: Set Environment Variables

```bash
# Set the service role key you got from Step 1
export STACKMONEYUP_API_TOKEN="your-service-role-key-here"
export STACKMONEYUP_URL="https://stackmoneyup.com"
```

**Or in PowerShell:**
```powershell
$env:STACKMONEYUP_API_TOKEN="your-service-role-key-here"
$env:STACKMONEYUP_URL="https://stackmoneyup.com"
```

### Step 3: Test Connection

```bash
python scripts/test_connection.py
```

**Should see:** ✅ SUCCESS! Connection works!

### Step 4: Install Dependencies

```bash
pip install fastapi uvicorn requests crewai crewai-tools
```

### Step 5: Start Agent Service

```bash
python scripts/agent_service.py
```

**You should see:** `INFO: Uvicorn running on http://0.0.0.0:8000`

### Step 6: Configure Website

Add to `.env.local`:

```bash
AGENT_SERVICE_URL=http://localhost:8000
```

### Step 7: Test Everything

```bash
# Test agent service
curl http://localhost:8000/health

# Should return: {"status": "ok", "service": "agent-service"}
```

---

## 🎯 What Happens Next?

Once everything is running:

1. **Agent service** runs on `http://localhost:8000`
2. **Website** can trigger agents via `/api/agent/generate`
3. **Agents** create articles and save them as DRAFTS
4. **You** review and publish articles in dashboard

---

## 🆘 Troubleshooting

### "Token not found"
→ Get Service Role Key from Supabase Dashboard → Settings → API → service_role
→ Make sure you copied the entire key (it's very long!)

### "Connection failed"
→ Check `STACKMONEYUP_URL` is correct
→ Make sure website is running

### "Port 8000 in use"
→ Use different port: `uvicorn scripts.agent_service:app --port 8001`
→ Update `AGENT_SERVICE_URL` in `.env.local`

### "Permission denied"
→ Make sure your account is `editor` or `admin` role

---

## 📚 Full Documentation

For detailed instructions, see:
- **[CONNECT_AGENTS_GUIDE.md](CONNECT_AGENTS_GUIDE.md)** - Complete setup guide
- **[AGENT_SETUP_GUIDE.md](AGENT_SETUP_GUIDE.md)** - Detailed configuration
- **[scripts/AGENT_SERVICE_README.md](scripts/AGENT_SERVICE_README.md)** - Agent service docs

---

## ✅ Checklist

- [ ] Got Service Role Key (Supabase Dashboard → API → service_role)
- [ ] Set `STACKMONEYUP_API_TOKEN` environment variable with service role key
- [ ] Tested connection (`python scripts/test_connection.py`)
- [ ] Installed dependencies (`pip install fastapi uvicorn...`)
- [ ] Started agent service (`python scripts/agent_service.py`)
- [ ] Set `AGENT_SERVICE_URL` in `.env.local`
- [ ] Tested agent service (`curl http://localhost:8000/health`)

---

**Ready?** Start with Step 1 above! 🚀


