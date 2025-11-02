# Maintenance Mode Documentation

This project includes a maintenance mode feature that allows you to restrict access to the site while you're working on updates or changes.

## How It Works

1. **Environment Variables**: Set `MAINTENANCE_MODE=true` and `MAINTENANCE_PASSWORD=your-secure-password` in your environment variables
2. **Middleware Protection**: The middleware intercepts all requests and checks if maintenance mode is enabled
3. **Password Authentication**: Users are redirected to a maintenance page where they must enter the password
4. **Cookie-Based Session**: Once authenticated, a secure cookie is set (valid for 7 days) that allows access to the site

## Setup

### Local Development (`.env.local`)

Add these variables to your `.env.local` file:

```env
# Maintenance Mode
MAINTENANCE_MODE=false
MAINTENANCE_PASSWORD=your-secure-password-here
```

### Production (Vercel/Other Platforms)

Add these environment variables in your deployment platform:

- **MAINTENANCE_MODE**: Set to `true` to enable maintenance mode, `false` to disable
- **MAINTENANCE_PASSWORD**: Your secure password (use a strong password!)

## Usage

### Enabling Maintenance Mode

1. Set `MAINTENANCE_MODE=true` in your environment variables
2. Set `MAINTENANCE_PASSWORD=your-password` (choose a strong password)
3. Redeploy or restart your application

### Disabling Maintenance Mode

1. Set `MAINTENANCE_MODE=false` (or remove it)
2. Redeploy or restart your application

### Accessing the Site During Maintenance

1. Navigate to your site URL
2. You'll be redirected to the maintenance page
3. Enter the maintenance password
4. You'll have access for 7 days (cookie expires after 7 days)

## Security Notes

- **Never commit passwords to Git**: The `.env.local` file is already in `.gitignore`
- **Use strong passwords**: Choose a secure password for `MAINTENANCE_PASSWORD`
- **Cookie Security**: 
  - Cookies are `httpOnly` (cannot be accessed via JavaScript)
  - Cookies are `secure` in production (HTTPS only)
  - Cookies expire after 7 days
  - Cookies are `sameSite: 'lax'` for CSRF protection

## Files Involved

- `middleware.ts` - Checks maintenance mode and redirects unauthorized users
- `src/app/[lang]/maintenance/page.tsx` - Maintenance page with password form
- `src/app/api/maintenance/auth/route.ts` - API endpoint that verifies password and sets cookie

## Troubleshooting

### Can't Access Site Even With Correct Password

1. Check that `MAINTENANCE_MODE` is actually set to `true`
2. Verify the password matches exactly (case-sensitive)
3. Clear browser cookies and try again
4. Check browser console for any errors

### Maintenance Mode Not Working

1. Verify environment variables are set correctly
2. Restart your development server or redeploy
3. Check that middleware is running (it should intercept all requests)
4. Verify the cookie is being set in browser DevTools → Application → Cookies

### Cookie Expired

- Cookies expire after 7 days
- Simply re-enter the password on the maintenance page to get a new cookie

## Best Practices

1. **Always test maintenance mode** before deploying major updates
2. **Use a different password** than your regular authentication passwords
3. **Set maintenance mode** before making breaking changes
4. **Disable maintenance mode** after you're done with updates
5. **Monitor your site** to ensure maintenance mode is working as expected

