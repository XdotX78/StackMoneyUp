# 🔐 Setup Your Credentials

## ⚠️ Important Clarification

**`fcarp78@icloud.com` is NOT a password - it's an EMAIL address!**

It was hardcoded as an example/default value in some scripts. You need to replace it with **YOUR** credentials.

---

## 📋 What You Need

1. **Your Email** - The email you use to login to StackMoneyUp
2. **Your Password** - The password you use to login to StackMoneyUp

---

## 🚀 Quick Setup

### Option 1: Set Environment Variables (Recommended)

**Windows (PowerShell):**
```powershell
# Set YOUR email (replace with your actual email)
$env:STACKMONEYUP_EMAIL="your-email@example.com"

# Set YOUR password (replace with your actual password)
$env:STACKMONEYUP_PASSWORD="your-password"
```

**Mac/Linux:**
```bash
# Set YOUR email (replace with your actual email)
export STACKMONEYUP_EMAIL="your-email@example.com"

# Set YOUR password (replace with your actual password)
export STACKMONEYUP_PASSWORD="your-password"
```

### Option 2: Edit Script Files Directly

Edit `scripts/get_token.py`:

```python
# Change this line:
EMAIL = os.getenv("STACKMONEYUP_EMAIL", "")  # Empty default

# To your email:
EMAIL = os.getenv("STACKMONEYUP_EMAIL", "your-email@example.com")
```

Then set password via environment variable:
```bash
export STACKMONEYUP_PASSWORD="your-password"
```

---

## ✅ Verify Your Credentials

1. **Check your email**: Can you login to https://stackmoneyup.com with this email?
2. **Check your password**: Does this password work when you login?
3. **Check your role**: Is your account `editor` or `admin`? (Required for agents)

---

## 🧪 Test It

After setting your credentials:

```bash
python scripts/get_token.py
```

**Expected output:**
```
🔐 Logging in as your-email@example.com...
✅ Login successful!
📋 YOUR API TOKEN:
[token here]
```

**If you see errors:**
- "Invalid login credentials" → Wrong email or password
- "User not found" → Email doesn't exist
- "Forbidden" → Account not editor/admin

---

## 🔍 Where Did `fcarp78@icloud.com` Come From?

It was hardcoded as a **default example** in these files:
- `scripts/get_token.py`
- `scripts/crewai_simple_tool.py`
- `scripts/create-post-simple.py`

**It's just a placeholder** - replace it with YOUR email!

---

## 📝 Summary

1. **Email**: Your StackMoneyUp login email
2. **Password**: Your StackMoneyUp login password
3. **Role**: Must be `editor` or `admin`

Set both via environment variables or edit the scripts directly.

---

**Need help?** Make sure:
- ✅ Email is correct (you can login with it)
- ✅ Password is correct (you can login with it)
- ✅ Account has `editor` or `admin` role


