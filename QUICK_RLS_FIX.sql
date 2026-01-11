-- ============================================================================
-- QUICK FIX: RLS Policy Error During Signup
-- ============================================================================
-- Run this if you're getting "new row violates row-level security policy"
-- This is a simplified fix that ensures the RPC function works
-- ============================================================================

-- Step 1: Ensure the create_user_profile function exists and works
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_user_role TEXT DEFAULT 'retailer',
  p_full_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- This function bypasses RLS because it uses SECURITY DEFINER
  INSERT INTO public.user_profiles (id, email, user_role, full_name, phone)
  VALUES (
    p_user_id, 
    COALESCE(p_email, ''), 
    COALESCE(p_user_role, 'retailer'), 
    p_full_name, 
    p_phone
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, user_profiles.email),
    user_role = COALESCE(EXCLUDED.user_role, user_profiles.user_role),
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
    updated_at = TIMEZONE('utc', NOW());
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in create_user_profile: %', SQLERRM;
END;
$$;

-- Step 2: Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated, anon;

-- Step 3: Verify it was created
DO $$
BEGIN
  RAISE NOTICE '✅ create_user_profile function created/updated';
  RAISE NOTICE '✅ This function bypasses RLS and can create profiles';
END $$;

-- ============================================================================
-- TEST: Verify the function exists
-- ============================================================================
-- Run this to check:
-- SELECT proname, prosecdef 
-- FROM pg_proc 
-- WHERE proname = 'create_user_profile';
-- 
-- prosecdef should be 't' (true) for SECURITY DEFINER

