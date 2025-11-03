-- ============================================
-- FIX: Set Your User as Admin
-- ============================================
-- Copy and paste this into Supabase SQL Editor
-- https://app.supabase.com/project/_/sql/new
-- ============================================

-- Option 1: Update by email (RECOMMENDED - Replace with your actual email)
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR_EMAIL_HERE@example.com'
);

-- Option 2: If you're the first/only user, set the first user as admin
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id IN (
--   SELECT id FROM public.profiles
--   ORDER BY created_at ASC
--   LIMIT 1
-- );

-- Verify the update worked - Check your role
SELECT 
  p.id, 
  p.role, 
  p.name, 
  u.email,
  p.created_at as profile_created,
  u.created_at as user_created
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at DESC;

-- If you see your email with role = 'admin', you're all set!
