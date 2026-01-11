-- QUICK FIX: Ensure products can be added and viewed by everyone
-- Run this in Supabase SQL Editor if products are not showing

-- ============================================================================
-- STEP 1: Drop existing policies to avoid conflicts
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- ============================================================================
-- STEP 2: Create policies that allow everyone to read products
-- ============================================================================
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (true);

-- ============================================================================
-- STEP 3: Create policy that allows admins to insert products
-- ============================================================================
CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- ============================================================================
-- STEP 4: Create policy that allows admins to update products
-- ============================================================================
CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- ============================================================================
-- STEP 5: Create policy that allows admins to delete products
-- ============================================================================
CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- ============================================================================
-- STEP 6: Verify your admin user role
-- ============================================================================
-- Run this to check if your user is admin:
-- SELECT id, email, user_role FROM user_profiles WHERE user_role = 'admin';

-- ============================================================================
-- STEP 7: If you need to set yourself as admin, run:
-- ============================================================================
-- UPDATE user_profiles SET user_role = 'admin' WHERE email = 'your-email@example.com';

