# 🔑 Service Role Key Setup - Final Guide

**Complete guide to use Service Role Key (never expires!) for CrewAI agents.**

---

## ✅ Why Service Role Key?

- ✅ **Never expires** - Set it once, use it forever
- ✅ **No refresh needed** - No manual updates
- ✅ **Works immediately** - Ready to use right away
- ✅ **Perfect for agents** - Automated, reliable authentication

---

## 📋 Step-by-Step Setup

### Step 1: Get Your Service Role Key

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api

2. **Find Service Role Key:**
   - Scroll to "Project API keys" section
   - Look for **"service_role secret"** (NOT anon key!)
   - Click **"Reveal"** to show the key
   - **Copy** the entire key (very long, starts with `eyJ...`)

### Step 2: Configure CrewAI

**In CrewAI configuration, set:**

| Field | Value |
|-------|-------|
| **STACKMONEYUP_EMAIL** | `francesco.carpena78@gmail.com` (your email) |
| **STACKMONEYUP_AUTH** | `eyJhbGci...` (your service_role key) |
| **STACKMONEYUP_URL** | `https://stackmoneyup.com` |
| **SUPABASE_URL** | `https://qhxettplmhkwmmcgrcef.supabase.co` |
| **SUPABASE_KEY** | (anon key from Supabase Dashboard) |

### Step 3: Test It!

Run your CrewAI agent - it should work immediately and forever! 🚀

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

## 🔄 If You Need to Revoke

**If your key is compromised:**

1. Go to Supabase Dashboard → Settings → API
2. Click **"Reset"** next to service_role key
3. Copy the new key
4. Update CrewAI with new key

**Old key will stop working immediately.**

---

## 📝 Summary

**What you need:**
1. Service Role Key from Supabase Dashboard
2. Paste it into CrewAI `STACKMONEYUP_AUTH` field
3. Done! Never expires!

**Benefits:**
- ✅ Never expires
- ✅ No manual refresh
- ✅ Works immediately
- ✅ Perfect for automation

---

**That's it! Your agents are ready to go!** 🎉

