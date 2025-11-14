# 🔑 Use Service Role Key (Never Expires!)

**Quick solution: Use Supabase Service Role Key - it NEVER expires!**

---

## ✅ Step-by-Step

### Step 1: Get Service Role Key

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api

2. **Find "service_role" key:**
   - Scroll down to "Project API keys"
   - Look for **"service_role secret"** (NOT anon key!)
   - Click **"Reveal"** to show it
   - **Copy** the entire key (very long, starts with `eyJ...`)

### Step 2: Use in CrewAI

**In CrewAI configuration:**
- Set `STACKMONEYUP_AUTH` = Your service role key
- ✅ **Never expires!**
- ✅ Works immediately!

### Step 3: Done!

That's it! Your agents can now use this key forever (until you revoke it).

---

## ⚠️ Security Notes

**Service Role Key has ADMIN access:**
- Can bypass all security rules
- Can access all data
- Can modify anything

**Keep it SECRET:**
- ✅ Never commit to Git
- ✅ Don't share publicly
- ✅ Store securely
- ✅ Revoke if compromised

**For agents, this is OK because:**
- They only create draft posts
- You review before publishing
- Limited to your account

---

## 🔄 Alternative: Custom API Key System

If you want more control (can revoke, limited permissions), I can implement:
1. Custom API key generator
2. Database storage
3. Validation endpoint
4. Revocation system

**But for now, Service Role Key works perfectly!**

---

## 📝 Quick Copy-Paste

1. **Get key:** Supabase Dashboard → Settings → API → service_role
2. **Copy it**
3. **Paste in CrewAI:** `STACKMONEYUP_AUTH` field
4. **Done!** Never expires!

---

**Want me to implement the custom API key system instead?** It's more secure but takes more setup.

**Or use Service Role Key?** It works immediately and never expires! 🚀

