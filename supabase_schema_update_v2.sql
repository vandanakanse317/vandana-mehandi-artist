-- Run this in your Supabase SQL Editor

-- 1. Update Gallery Table
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT true;

-- 2. Create Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT,
    description TEXT,
    category TEXT,
    thumbnail_url TEXT,
    video_url TEXT,
    is_featured BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0
);

-- 3. Enable RLS on Videos Table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Videos
DROP POLICY IF EXISTS "Enable read access for all users on videos" ON public.videos;
CREATE POLICY "Enable read access for all users on videos" ON public.videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only on videos" ON public.videos;
CREATE POLICY "Enable insert for authenticated users only on videos" ON public.videos FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only on videos" ON public.videos;
CREATE POLICY "Enable update for authenticated users only on videos" ON public.videos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users only on videos" ON public.videos;
CREATE POLICY "Enable delete for authenticated users only on videos" ON public.videos FOR DELETE TO authenticated USING (true);

-- 5. Create Storage Bucket for Videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true) 
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies for Videos Bucket
CREATE POLICY "Public Access Videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Auth Insert Videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'videos');
CREATE POLICY "Auth Update Videos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'videos');
CREATE POLICY "Auth Delete Videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'videos');
