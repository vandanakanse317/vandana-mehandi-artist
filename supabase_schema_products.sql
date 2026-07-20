CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC,
  features TEXT[],
  image_urls TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_enabled BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Auth all products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access Products Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Auth Insert Products Bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');
CREATE POLICY "Auth Update Products Bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'products');
CREATE POLICY "Auth Delete Products Bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products');
