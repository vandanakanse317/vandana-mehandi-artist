-- Run this in your Supabase SQL Editor

-- Update Settings Table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS profilePhotoUrl TEXT DEFAULT '';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS profileName TEXT DEFAULT 'Vandana Artist';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS profileDesignation TEXT DEFAULT 'Professional Mehandi Artist';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS profileBio TEXT DEFAULT 'Creating beautiful hand-drawn stories for over a decade.';
UPDATE public.gallery SET category = 'Portfolio' WHERE category IN ('Signature Mehndi Collection', 'Flower Decoration');
UPDATE public.gallery SET category = 'Classes' WHERE category = 'Mehndi Classes';
-- Create gallery bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;

-- Gallery Bucket Policies
CREATE POLICY "Public Access Gallery Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Auth Insert Gallery Bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Auth Update Gallery Bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Auth Delete Gallery Bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');
