# 📧 Email Verification Setup Guide

**Last Updated:** January 2025

This guide explains how to configure email verification templates in Supabase for StackMoneyUp.

---

## Overview

Email verification ensures that users confirm their email addresses before accessing the platform. Supabase provides customizable email templates for:

- Email confirmation
- Password reset
- Magic link (if enabled)
- Email change confirmation

---

## Step 1: Access Email Templates in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Email Templates**
3. You'll see templates for:
   - **Confirm signup** - Sent when user signs up
   - **Reset password** - Sent when user requests password reset
   - **Magic link** - Sent when using magic link authentication
   - **Change email address** - Sent when user changes email

---

## Step 2: Configure Email Confirmation Template

### Template Variables

Supabase provides these variables you can use in templates:

- `{{ .ConfirmationURL }}` - Link to confirm email
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL
- `{{ .Token }}` - Confirmation token (for custom implementations)
- `{{ .TokenHash }}` - Hashed token
- `{{ .RedirectTo }}` - URL to redirect after confirmation

### Default Template

The default confirmation email template includes:
- Subject line
- HTML body
- Plain text body (fallback)

### Custom Template Example

Here's a custom template you can use for StackMoneyUp:

**Subject:**
```
Confirm your StackMoneyUp account
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">StackMoneyUp</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827; margin-top: 0;">Confirm your email address</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Thanks for signing up for StackMoneyUp! To complete your registration, please confirm your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Confirm Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #6b7280; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
      {{ .ConfirmationURL }}
    </p>
    
    <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      If you didn't create an account with StackMoneyUp, you can safely ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>© {{ .Year }} StackMoneyUp. All rights reserved.</p>
  </div>
</body>
</html>
```

**Plain Text Body:**
```
Confirm your StackMoneyUp account

Thanks for signing up for StackMoneyUp! To complete your registration, please confirm your email address by visiting this link:

{{ .ConfirmationURL }}

If you didn't create an account with StackMoneyUp, you can safely ignore this email.

© {{ .Year }} StackMoneyUp. All rights reserved.
```

---

## Step 3: Configure Password Reset Template

**Subject:**
```
Reset your StackMoneyUp password
```

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">StackMoneyUp</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
    <h2 style="color: #111827; margin-top: 0;">Reset your password</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      You requested to reset your password for your StackMoneyUp account. Click the button below to set a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="color: #6b7280; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
      {{ .ConfirmationURL }}
    </p>
    
    <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>© {{ .Year }} StackMoneyUp. All rights reserved.</p>
  </div>
</body>
</html>
```

---

## Step 4: Configure Email Settings

### Enable Email Confirmation

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, ensure:
   - ✅ **Enable email confirmations** is checked
   - ✅ **Secure email change** is enabled (recommended)

### Email Provider Settings

**Using Supabase's default SMTP:**
- Free tier: 3 emails/hour per user
- Pro tier: Higher limits
- Good for development/testing

**Using custom SMTP (recommended for production):**
1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your SMTP provider:
   - **Host:** Your SMTP server
   - **Port:** Usually 587 (TLS) or 465 (SSL)
   - **Username:** Your SMTP username
   - **Password:** Your SMTP password
   - **Sender email:** The "from" address
   - **Sender name:** Display name (e.g., "StackMoneyUp")

**Popular SMTP providers:**
- SendGrid
- Mailgun
- AWS SES
- Postmark
- Resend

---

## Step 5: Test Email Templates

### Test Confirmation Email

1. Sign up with a new email address
2. Check your email inbox (and spam folder)
3. Verify the email looks correct
4. Click the confirmation link
5. Verify you're redirected correctly

### Test Password Reset Email

1. Go to forgot password page
2. Enter your email
3. Check your email inbox
4. Verify the reset link works
5. Complete password reset

---

## Step 6: Multi-Language Support (Optional)

For multi-language emails, you can:

1. **Use different templates per language:**
   - Create separate templates with language codes
   - Configure redirect URLs with language parameter

2. **Custom implementation:**
   - Use custom SMTP with template system
   - Send emails via API route with language detection

**Example redirect URL with language:**
```
{{ .SiteURL }}/{{ .Language }}/auth/confirm?token={{ .Token }}
```

---

## Troubleshooting

### Emails not sending

**Problem:** Emails not received.

**Solutions:**
1. Check spam/junk folder
2. Verify SMTP settings are correct
3. Check Supabase logs for errors
4. Verify email confirmation is enabled
5. Check rate limits (free tier has limits)

### Template variables not working

**Problem:** Variables like `{{ .ConfirmationURL }}` show as literal text.

**Solutions:**
1. Ensure variables use double curly braces with spaces: `{{ .Variable }}`
2. Check template syntax is correct
3. Preview template before saving

### Links not working

**Problem:** Confirmation links redirect incorrectly.

**Solutions:**
1. Verify `NEXT_PUBLIC_SITE_URL` environment variable is set
2. Check redirect URLs in Supabase settings
3. Ensure language parameter is included in redirect URL
4. Test links in different browsers

### Email confirmation not required

**Problem:** Users can sign in without confirming email.

**Solutions:**
1. Enable "Require email confirmation" in Supabase settings
2. Check `email_confirmed_at` field in database
3. Verify email confirmation is checked in your app code

---

## Best Practices

1. **Always enable email confirmation** in production
2. **Use custom SMTP** for better deliverability
3. **Set up SPF/DKIM records** for your domain
4. **Test templates** before going live
5. **Monitor email delivery** rates
6. **Keep templates simple** and mobile-friendly
7. **Include plain text version** for accessibility
8. **Set appropriate expiration times** for reset links (1 hour recommended)

---

## References

- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Best Practices](https://supabase.com/docs/guides/auth/auth-email-best-practices)

