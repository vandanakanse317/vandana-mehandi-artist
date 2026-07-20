-- Run this SQL in your Supabase SQL Editor to migrate your gallery images

-- 1. Add bucket column to gallery table if it doesn't exist to prevent broken images
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS bucket VARCHAR(255);

-- 2. Populate bucket column based on the OLD category values before updating them!
UPDATE gallery SET bucket = 'signature-mehandi' WHERE category = 'Signature Mehndi Collection' AND bucket IS NULL;
UPDATE gallery SET bucket = 'flower-decoration' WHERE category = 'Flower Decoration' AND bucket IS NULL;
UPDATE gallery SET bucket = 'mehandi-classes' WHERE category IN ('Mehndi Classes', 'Classes') AND bucket IS NULL;
UPDATE gallery SET bucket = 'gallery' WHERE bucket IS NULL;

-- 3. Migrate all other Mehandi categories to 'All Mehandi'
-- This maps images from Arabic, Traditional, Signature, Latest, etc. to 'All Mehandi'
-- We explicitly preserve Flower Decoration, Bridal Collection, and Classes.
UPDATE gallery
SET category = 'All Mehandi'
WHERE category NOT IN ('Flower Decoration', 'Bridal Collection', 'Classes', 'Mehndi Classes', 'All Mehandi');
