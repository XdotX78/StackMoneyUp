# 🔧 CrewAI Configuration Guide

**What to put in each CrewAI field to connect to StackMoneyUp website.**

---

## 📋 Field-by-Field Configuration

### 1. **STACKMONEYUP_EMAIL**
**What it is:** Your StackMoneyUp account email address

**Value to enter:**
```
your-email@example.com
```

**Example:**
```
fcarp78@icloud.com
```

---

### 2. **STACKMONEYUP_AUTH** ⚠️ IMPORTANT
**What it is:** Your Supabase Service Role Key (NEVER expires!)

**How to get it:**
1. Go to: https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api
2. Scroll to "Project API keys"
3. Find **"service_role secret"** (NOT anon key!)
4. Click **"Reveal"** to show it
5. **Copy** the entire key (very long, starts with `eyJ...`)

**Value to enter:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgzMzU1NywiZXhwIjoyMDc3NDA5NTU3fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
*(This is just an example - use YOUR actual service_role key from Supabase Dashboard)*

**✅ Benefits:**
- ✅ **Never expires** - Use it forever!
- ✅ No need to refresh tokens
- ✅ Works immediately

**⚠️ Security Note:** Keep this key SECRET! Never commit to Git or share publicly.

---

### 3. **STACKMONEYUP_URL**
**What it is:** Your website URL

**Value to enter:**
```
https://stackmoneyup.com
```

**For local development:**
```
http://localhost:3000
```

---

### 4. **SUPABASE_URL**
**What it is:** Your Supabase project URL

**Value to enter:**
```
https://qhxettplmhkwmmcgrcef.supabase.co
```

---

### 5. **SUPABASE_KEY** (if shown in second screenshot)
**What it is:** Your Supabase anonymous/public key

**Value to enter:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeGV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MzM1NTcsImV4cCI6MjA3NzQwOTU1N30.Bcf2ubGPpq-vqkqiWqasai7qp35_9OxdFlTFdD2Bm6E
```

---

## ✅ Quick Setup Checklist

1. **Get your Service Role Key:**
   - Go to: https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api
   - Find **"service_role secret"** key
   - Click **"Reveal"** and copy it

2. **Fill in CrewAI fields:**
   - ✅ **STACKMONEYUP_EMAIL**: Your email (e.g., `francesco.carpena78@gmail.com`)
   - ✅ **STACKMONEYUP_AUTH**: Your service_role key from step 1
   - ✅ **STACKMONEYUP_URL**: `https://stackmoneyup.com`
   - ✅ **SUPABASE_URL**: `https://qhxettplmhkwmmcgrcef.supabase.co`
   - ✅ **SUPABASE_KEY**: (if needed) The anon key from Supabase Dashboard

3. **Save and test!**

---

## 🔍 How It Works

```
CrewAI Agent
    ↓ Uses STACKMONEYUP_AUTH (token)
    ↓ Calls STACKMONEYUP_URL/api/blog/create
    ↓ Creates blog post
```

The **STACKMONEYUP_AUTH** field is what authenticates your agent. It's the token, not the password.

---

## ⚠️ Important Notes

1. **STACKMONEYUP_AUTH = Service Role Key** (never expires!)
   - Get it from: Supabase Dashboard → Settings → API → service_role
   - ✅ **Never expires** - Use it forever!
   - ⚠️ **Keep it SECRET** - Never commit to Git or share publicly
   - Has admin access, but safe for agents (only creates drafts)

2. **STACKMONEYUP_EMAIL = Your email**
   - The email you use to login to StackMoneyUp
   - Must be an account with `editor` or `admin` role

3. **All URLs are correct** as shown above
   - Don't change SUPABASE_URL or SUPABASE_KEY
   - STACKMONEYUP_URL should be your production URL

---

## 🧪 Test Your Configuration

After filling in the fields, test if it works:

```python
# In CrewAI, try creating a test post
# Or use our test script:
python scripts/test_connection.py
```

---

## 🔄 Token Refresh

**✅ No refresh needed!** Service Role Key never expires.

- ✅ Set it once, use it forever
- ✅ No need to update CrewAI periodically
- ✅ Works immediately and permanently

**If you need to revoke it:**
- Go to Supabase Dashboard → Settings → API
- Regenerate the service_role key
- Update CrewAI with the new key

---

## 📝 Summary

| Field | Value | How to Get |
|-------|-------|------------|
| **STACKMONEYUP_EMAIL** | Your email | Your login email |
| **STACKMONEYUP_AUTH** | Service Role Key | Supabase Dashboard → API → service_role |
| **STACKMONEYUP_URL** | `https://stackmoneyup.com` | Fixed value |
| **SUPABASE_URL** | `https://qhxettplmhkwmmcgrcef.supabase.co` | Fixed value |
| **SUPABASE_KEY** | (long key) | Supabase Dashboard → API → anon key |

**Most important:** Get your **service_role key** from Supabase Dashboard and put it in **STACKMONEYUP_AUTH**!

