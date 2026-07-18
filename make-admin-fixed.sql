<<<<<<< HEAD
-- ============================================================================
-- MAKE YOURSELF ADMIN (FIXED VERSION - WORKS WITH RLS)
-- ============================================================================
-- This version bypasses RLS by using SECURITY DEFINER function
-- Instructions:
-- 1. Replace 'YOUR_EMAIL@example.com' below with YOUR actual email address
-- 2. Run this entire script in Supabase SQL Editor
-- 3. After running, logout and login again to access /admin panel
-- ============================================================================

-- STEP 1: Check your current profile (optional - to verify your email)
-- This will show all users, so you can find your email
SELECT email, user_role, full_name, id
FROM user_profiles 
ORDER BY created_at DESC;

-- ============================================================================
-- STEP 2: Create a function to update user role (bypasses RLS)
-- ============================================================================
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
BEGIN
  UPDATE user_profiles 
  SET user_role = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- ============================================================================
-- STEP 3: Make yourself admin (REPLACE THE EMAIL BELOW!)
-- ============================================================================
-- Replace 'hardiksedani95@gmail.com' with YOUR email address
SELECT make_user_admin('hardiksedani2610@gmail.com');  -- ⬅️ CHANGE THIS TO YOUR EMAIL!

-- ============================================================================
-- STEP 4: Verify the update worked
-- ============================================================================
SELECT email, user_role, full_name
FROM user_profiles 
WHERE email = 'hardiksedani2610@gmail.com';  -- ⬅️ CHANGE THIS TO YOUR EMAIL!

-- ============================================================================
-- ALTERNATIVE: Make yourself admin by user ID (if you know your user ID)
-- ============================================================================
-- CREATE OR REPLACE FUNCTION make_user_admin_by_id(user_id UUID)
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   UPDATE user_profiles 
--   SET user_role = 'admin'
--   WHERE id = user_id;
--   
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'User with ID % not found', user_id;
--   END IF;
-- END;
-- $$;

-- Then run:
-- SELECT make_user_admin_by_id('your-user-id-here');

-- ============================================================================
-- CLEANUP (Optional): Remove the function after use
-- ============================================================================
-- DROP FUNCTION IF EXISTS make_user_admin(TEXT);

-- ============================================================================
-- TIPS:
-- - You can find your email in Supabase Dashboard > Authentication > Users
-- - Or check your signup confirmation email
-- - After updating, you MUST logout and login again for changes to take effect
-- - The function uses SECURITY DEFINER to bypass RLS policies
-- ============================================================================

=======
-- ============================================================================
-- MAKE YOURSELF ADMIN (FIXED VERSION - WORKS WITH RLS)
-- ============================================================================
-- This version bypasses RLS by using SECURITY DEFINER function
-- Instructions:
-- 1. Replace 'YOUR_EMAIL@example.com' below with YOUR actual email address
-- 2. Run this entire script in Supabase SQL Editor
-- 3. After running, logout and login again to access /admin panel
-- ============================================================================

-- STEP 1: Check your current profile (optional - to verify your email)
-- This will show all users, so you can find your email
SELECT email, user_role, full_name, id
FROM user_profiles 
ORDER BY created_at DESC;

-- ============================================================================
-- STEP 2: Create a function to update user role (bypasses RLS)
-- ============================================================================
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
BEGIN
  UPDATE user_profiles 
  SET user_role = 'admin'
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- ============================================================================
-- STEP 3: Make yourself admin (REPLACE THE EMAIL BELOW!)
-- ============================================================================
-- Replace 'hardiksedani95@gmail.com' with YOUR email address
SELECT make_user_admin('hardiksedani2610@gmail.com');  -- ⬅️ CHANGE THIS TO YOUR EMAIL!

-- ============================================================================
-- STEP 4: Verify the update worked
-- ============================================================================
SELECT email, user_role, full_name
FROM user_profiles 
WHERE email = 'hardiksedani2610@gmail.com';  -- ⬅️ CHANGE THIS TO YOUR EMAIL!

-- ============================================================================
-- ALTERNATIVE: Make yourself admin by user ID (if you know your user ID)
-- ============================================================================
-- CREATE OR REPLACE FUNCTION make_user_admin_by_id(user_id UUID)
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   UPDATE user_profiles 
--   SET user_role = 'admin'
--   WHERE id = user_id;
--   
--   IF NOT FOUND THEN
--     RAISE EXCEPTION 'User with ID % not found', user_id;
--   END IF;
-- END;
-- $$;

-- Then run:
-- SELECT make_user_admin_by_id('your-user-id-here');

-- ============================================================================
-- CLEANUP (Optional): Remove the function after use
-- ============================================================================
-- DROP FUNCTION IF EXISTS make_user_admin(TEXT);

-- ============================================================================
-- TIPS:
-- - You can find your email in Supabase Dashboard > Authentication > Users
-- - Or check your signup confirmation email
-- - After updating, you MUST logout and login again for changes to take effect
-- - The function uses SECURITY DEFINER to bypass RLS policies
-- ============================================================================

>>>>>>> d4b4a93 (update code)
