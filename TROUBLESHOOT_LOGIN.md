# 🔧 Troubleshooting Login Issues

## Common Issues and Solutions

### Issue: "Login failed: Invalid login credentials"

**Possible causes:**
1. ✅ **Email or password is wrong** - Double-check both
2. ✅ **Account doesn't exist** - User might not be in Supabase
3. ✅ **Email not confirmed** - Supabase requires email verification

**Solutions:**

#### Solution 1: Verify Account Exists

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Authentication** → **Users**
4. Search for your email: `francesco.carpena78@gmail.com`
5. Check if user exists

**If user doesn't exist:**
- Create account on website first: https://stackmoneyup.com/en/login
- Or create directly in Supabase Dashboard

#### Solution 2: Check Email Confirmation

1. In Supabase Dashboard → Authentication → Users
2. Find your user
3. Check if "Email Confirmed" is ✅ or ❌

**If not confirmed:**
- Option A: Check your email for verification link
- Option B: Manually confirm in Supabase Dashboard (click user → Actions → Confirm Email)
- Option C: Disable email confirmation (Settings → Auth → Email Auth → Uncheck "Confirm email")

#### Solution 3: Reset Password

1. Go to: https://stackmoneyup.com/en/forgot-password
2. Enter your email
3. Check email for reset link
4. Set new password
5. Try login again

---

### Issue: "Email not confirmed"

**Solution:**

**Quick Fix - Disable Email Confirmation:**

1. Go to Supabase Dashboard
2. Settings → Authentication → Email Auth
3. **Uncheck** "Confirm email"
4. Save
5. Try login again

**Or confirm your email:**

1. Check your inbox for verification email
2. Click the verification link
3. Try login again

---

### Issue: "Account doesn't exist"

**Solution:**

**Create account on website:**
1. Go to: https://stackmoneyup.com/en/login
2. Click "Sign Up"
3. Use email: `francesco.carpena78@gmail.com`
4. Set password
5. Verify email if needed
6. Set role to `editor` in Supabase Dashboard

**Or create directly in Supabase:**
1. Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Set role to `editor` in profiles table

---

### Issue: Password works on website but not in script

**Possible causes:**
1. Special characters in password need escaping
2. Password has spaces that need quotes
3. Environment variable not set correctly

**Solutions:**

#### Check Password Format

**Windows PowerShell:**
```powershell
# If password has special characters, use single quotes
$env:STACKMONEYUP_PASSWORD='your-password-with-!@#$'

# Or escape special characters
$env:STACKMONEYUP_PASSWORD="your-password-with-`$special"
```

**Or set email explicitly:**
```powershell
$env:STACKMONEYUP_EMAIL="francesco.carpena78@gmail.com"
$env:STACKMONEYUP_PASSWORD="your-password"
python scripts/get_token.py
```

#### Verify Environment Variables

```powershell
# Check if variables are set
echo $env:STACKMONEYUP_EMAIL
echo $env:STACKMONEYUP_PASSWORD

# Should show your values (password will be visible, that's ok for testing)
```

---

### Issue: Wrong Supabase URL/Key

**Check your Supabase credentials:**

1. Go to Supabase Dashboard → Settings → API
2. Verify:
   - **Project URL** matches: `https://qhxettplmhkwmmcgrcef.supabase.co`
   - **anon/public key** matches the one in `get_token.py`

**If different:**
- Update `SUPABASE_URL` and `SUPABASE_KEY` in `scripts/get_token.py`
- Or get correct values from Supabase Dashboard

---

## 🧪 Debug Steps

### Step 1: Test Website Login

1. Go to: https://stackmoneyup.com/en/login
2. Try logging in with:
   - Email: `francesco.carpena78@gmail.com`
   - Your password
3. **If this works**, the issue is with the script
4. **If this fails**, the issue is with your account

### Step 2: Check Supabase Dashboard

1. Go to: https://app.supabase.com
2. Select project: `qhxettplmhkwmmcgrcef`
3. Authentication → Users
4. Find: `francesco.carpena78@gmail.com`
5. Check:
   - ✅ User exists?
   - ✅ Email confirmed?
   - ✅ Role is `editor` or `admin`?

### Step 3: Test with Improved Script

The updated script now shows more detailed errors. Run:

```powershell
$env:STACKMONEYUP_EMAIL="francesco.carpena78@gmail.com"
$env:STACKMONEYUP_PASSWORD="your-password"
python scripts/get_token.py
```

Look at the detailed error message - it will tell you exactly what's wrong.

---

## ✅ Quick Checklist

- [ ] Can login to website? (https://stackmoneyup.com/en/login)
- [ ] User exists in Supabase Dashboard?
- [ ] Email is confirmed?
- [ ] Role is `editor` or `admin`?
- [ ] Password has no special characters that need escaping?
- [ ] Environment variables set correctly?
- [ ] Supabase URL/key are correct?

---

## 🆘 Still Stuck?

**Get more debug info:**

```powershell
# Run with verbose output
$env:STACKMONEYUP_EMAIL="francesco.carpena78@gmail.com"
$env:STACKMONEYUP_PASSWORD="your-password"
python scripts/get_token.py
```

**Check the error message** - it will tell you exactly what's wrong!

**Common fixes:**
1. Email not confirmed → Confirm in Supabase Dashboard
2. User doesn't exist → Create account on website
3. Wrong credentials → Reset password
4. Special characters → Use quotes around password

