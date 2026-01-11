-- SQL to run in Supabase SQL Editor
-- This creates a flexible table for managing website items/content
-- Safe to run multiple times - will handle existing objects gracefully

-- ============================================================================
-- STEP 1: Create website_items table for flexible content management
-- ============================================================================
CREATE TABLE IF NOT EXISTS website_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  item_type TEXT DEFAULT 'general',
  content JSONB DEFAULT '{}'::jsonb, -- For storing custom fields
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0, -- For custom ordering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Enable Row Level Security
-- ============================================================================
ALTER TABLE website_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Drop existing policies if they exist (to avoid conflicts)
-- Must be done AFTER table creation
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read published items" ON website_items;
DROP POLICY IF EXISTS "Only admins can insert items" ON website_items;
DROP POLICY IF EXISTS "Only admins can update items" ON website_items;
DROP POLICY IF EXISTS "Only admins can delete items" ON website_items;

-- ============================================================================
-- STEP 4: Create policies for website_items table
-- ============================================================================

-- Anyone can read published items (or admins can read all)
CREATE POLICY "Anyone can read published items" ON website_items
  FOR SELECT USING (
    is_published = true OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- Only admins can insert items
CREATE POLICY "Only admins can insert items" ON website_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- Only admins can update items
CREATE POLICY "Only admins can update items" ON website_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- Only admins can delete items
CREATE POLICY "Only admins can delete items" ON website_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_role = 'admin'
    )
  );

-- ============================================================================
-- STEP 5: Create indexes for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_website_items_category ON website_items(category);
CREATE INDEX IF NOT EXISTS idx_website_items_item_type ON website_items(item_type);
CREATE INDEX IF NOT EXISTS idx_website_items_is_published ON website_items(is_published);
CREATE INDEX IF NOT EXISTS idx_website_items_order_index ON website_items(order_index);

-- ============================================================================
-- STEP 6: Create function to automatically update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_website_items_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- STEP 7: Create trigger to update updated_at on website_items
-- ============================================================================
DROP TRIGGER IF EXISTS update_website_items_updated_at_trigger ON website_items;

CREATE TRIGGER update_website_items_updated_at_trigger
  BEFORE UPDATE ON website_items
  FOR EACH ROW
  EXECUTE FUNCTION update_website_items_updated_at();

-- ============================================================================
-- OPTIONAL: Insert some sample items (uncomment if needed)
-- ============================================================================
-- INSERT INTO website_items (title, description, category, item_type, content) VALUES
--   ('Welcome Banner', 'Main banner for homepage', 'banner', 'banner', '{"link": "/products", "buttonText": "Shop Now"}'::jsonb),
--   ('Featured Product', 'Highlighted product showcase', 'feature', 'product', '{"productId": "123"}'::jsonb),
--   ('About Us Section', 'Company information section', 'content', 'text', '{"html": "<p>Your company info</p>"}'::jsonb)
-- ON CONFLICT DO NOTHING;
