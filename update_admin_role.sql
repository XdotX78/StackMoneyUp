-- ============================================
-- QUICK FIX: Update Your Role to Admin
-- ============================================
-- Run this in your Supabase SQL Editor
-- https://app.supabase.com/project/_/sql/new
-- ============================================

-- EASIEST OPTION: Update the first user (if you're the only registered user)
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM public.profiles
  ORDER BY created_at ASC
  LIMIT 1
);

-- OR Option 2: Update by your email (replace with your actual email)
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (
--   SELECT id FROM auth.users 
--   WHERE email = 'your-email@example.com'
-- );

-- Verify the update worked
SELECT 
  p.id, 
  p.role, 
  p.name, 
  u.email,
  u.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at DESC;

