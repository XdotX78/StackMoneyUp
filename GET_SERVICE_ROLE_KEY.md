# 🔑 Get Your Supabase Service Role Key

**Quick Guide:** 2 minutes

---

## 🎯 **What is it?**

The **Service Role Key** is a special admin key that allows your application to:
- Manage all users (view, update roles)
- Bypass Row Level Security (RLS) policies
- Perform admin operations

⚠️ **IMPORTANT:** Keep this key secret! Never commit it to Git or share it publicly.

---

## 📋 **Step-by-Step Instructions**

### **1. Go to Supabase Dashboard**

Click this link (opens in new tab):
👉 **[Get Service Role Key](https://app.supabase.com/project/qhxettplmhkwmmcgrcef/settings/api)**

Or manually:
1. Go to [https://supabase.com](https://supabase.com)
2. Log in
3. Select your `StackMoneyUp` project
4. Click **Settings** (gear icon in left sidebar)
5. Click **API** in the settings menu

---

### **2. Find the Service Role Key**

On the API settings page, scroll down to find:

```
Project API keys
└─ service_role secret
   └─ [Long key starting with "eyJhbG..."]
```

**Look for:** "service_role" (NOT "anon" or "public")

**It looks like:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IiFoamV0dHBsbWhrd21tY2dyY2VmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgzMzU1NywiZXhwIjoyMDc3NDA5NTU3fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Click **Reveal** to show the key, then **Copy** it.

---

### **3. Add to .env.local**

1. Open your project in your editor
2. Open the `.env.local` file (at the root of your project)
3. Find this line:
   ```bash
   # SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

4. **Replace it with:**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE
   ```
   (Remove the `#` to uncomment it)

5. **Save the file**

---

### **4. Restart Dev Server**

Stop the current dev server (Ctrl+C) and restart:
```bash
npm run dev
```

---

## ✅ **Verification**

After restarting, try:
1. Go to `http://localhost:3000/en/dashboard/users`
2. You should see the user management page
3. No more "supabaseKey is required" error! ✅

---

## 🔒 **Security Reminders**

**DO:**
- ✅ Keep it in `.env.local` (already in `.gitignore`)
- ✅ Add to Netlify environment variables for production
- ✅ Keep it secret

**DON'T:**
- ❌ Commit to Git
- ❌ Share publicly
- ❌ Use in client-side code (only server actions!)

---

## 📍 **Where It's Used**

The Service Role Key is ONLY used in:
- `src/app/actions/users.ts` - Admin user management
- Server-side operations that need admin access

It's **NEVER** exposed to the browser or client-side code.

---

## 🆘 **Troubleshooting**

### **"Still getting the error after adding key"**
- Make sure you uncommented the line (removed `#`)
- Make sure there are no extra spaces
- Restart the dev server: Stop with Ctrl+C, then `npm run dev`

### **"Can't find the key in Supabase"**
- Make sure you're in the correct project
- Look for "service_role" NOT "anon"
- Click "Reveal" to show the hidden key

### **"Key doesn't work"**
- Make sure you copied the entire key (it's very long!)
- Check for any trailing spaces or line breaks
- The key should start with `eyJhbG...`

---

**Need help?** The error message will show you the direct link to get your key! 🚀

