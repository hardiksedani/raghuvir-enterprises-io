<<<<<<< HEAD
-- SQL to run in Supabase SQL Editor
-- This creates a storage bucket for product images

-- ============================================================================
-- STEP 1: Create storage bucket for product images
-- ============================================================================
-- Note: You need to run this in Supabase Dashboard > Storage > Create Bucket
-- Or use the Supabase Dashboard UI to create a bucket named 'product-images'
-- with public access enabled

-- If using SQL, you can also create it via:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Create storage policies for product-images bucket
-- ============================================================================

-- Allow anyone to read images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users (admins) to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to update images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to delete images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

=======
-- SQL to run in Supabase SQL Editor
-- This creates a storage bucket for product images

-- ============================================================================
-- STEP 1: Create storage bucket for product images
-- ============================================================================
-- Note: You need to run this in Supabase Dashboard > Storage > Create Bucket
-- Or use the Supabase Dashboard UI to create a bucket named 'product-images'
-- with public access enabled

-- If using SQL, you can also create it via:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Create storage policies for product-images bucket
-- ============================================================================

-- Allow anyone to read images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users (admins) to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to update images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to delete images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

>>>>>>> d4b4a93 (update code)
