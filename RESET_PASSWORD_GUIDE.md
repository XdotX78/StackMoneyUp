# 🔑 Reset Your Password - Quick Guide

## 🚀 Fastest Method: Website Password Reset

### Step 1: Go to Password Reset Page

Open in your browser:
```
https://stackmoneyup.com/en/forgot-password
```

### Step 2: Enter Your Email

Enter your email address:
- `fcarp78@icloud.com` (or whatever email you used)

### Step 3: Check Your Email

1. Check your inbox for password reset email
2. **Check spam folder** if you don't see it
3. Click the reset link in the email

### Step 4: Set New Password

1. Enter your new password (at least 6 characters)
2. Confirm it
3. Click "Update Password"

### Step 5: Use New Password for API Token

Once you have your new password:

```powershell
# Set your NEW password
$env:STACKMONEYUP_PASSWORD="your-new-password"

# Get API token
python scripts/get_token.py
```

---

## 🔧 Alternative: Supabase Dashboard

If website reset doesn't work:

1. **Go to:** https://supabase.com/dashboard
2. **Select your project**
3. **Go to:** Authentication → Users
4. **Find your user** (search by email)
5. **Click three dots** → Reset Password
6. **Check email** for reset link

---

## ✅ After Resetting

Once you have your new password:

1. **Set it:**
   ```powershell
   $env:STACKMONEYUP_PASSWORD="your-new-password"
   ```

2. **Get token:**
   ```powershell
   python scripts/get_token.py
   ```

3. **Copy token** and paste into CrewAI `STACKMONEYUP_AUTH` field

---

## 🆘 Still Can't Reset?

If you can't access your email or reset doesn't work:

1. **Create new account** on the website
2. **Set role to `editor`** in Supabase Dashboard
3. **Use new account** for the agent

---

**Start with Option 1** - it's the easiest! 🚀

