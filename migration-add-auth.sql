-- INCREMENTAL MIGRATION FOR AUTHENTICATION
-- Run this in Supabase SQL Editor to add authentication to existing database
-- This will NOT drop or recreate existing tables

-- ============================================================================
-- STEP 1: Create user_profiles table
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_role TEXT NOT NULL CHECK (user_role IN ('retailer', 'dealer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- STEP 2: Add user_id column to existing orders table
-- ============================================================================

-- Add user_id column (nullable for now to preserve existing orders)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================================================
-- STEP 3: Enable Row Level Security
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- Note: Products and orders RLS should already be enabled, but we'll ensure it
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Drop old permissive policies (if they exist)
-- ============================================================================

-- Drop old policies on products
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for all users" ON products;
DROP POLICY IF EXISTS "Enable update for all users" ON products;
DROP POLICY IF EXISTS "Enable delete for all users" ON products;

-- Drop old policies on orders
DROP POLICY IF EXISTS "Enable read access for all users on orders" ON orders;
DROP POLICY IF EXISTS "Enable insert for all users on orders" ON orders;
DROP POLICY IF EXISTS "Enable update for all users on orders" ON orders;
DROP POLICY IF EXISTS "Enable delete for all users on orders" ON orders;

-- ============================================================================
-- STEP 5: Create new RLS policies for user_profiles
-- ============================================================================

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- STEP 6: Create new RLS policies for products
-- ============================================================================

CREATE POLICY "Anyone can read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- ============================================================================
-- STEP 7: Create new RLS policies for orders
-- ============================================================================

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete orders" ON orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- ============================================================================
-- STEP 8: Create function and trigger for automatic user profile creation
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, user_role, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'retailer'),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================

-- Your existing products and orders data is preserved
-- New orders will require authentication
-- Old orders (with null user_id) can still be viewed by admins

-- NEXT STEPS:
-- 1. Create your first admin user by signing up on the website
-- 2. Then run: UPDATE user_profiles SET user_role = 'admin' WHERE email = 'your@email.com';
-- 3. Test the authentication flow
