CREATE TABLE IF NOT EXISTS public.classes_info (
  id integer PRIMARY KEY DEFAULT 1,
  banner_image text,
  heading text,
  description text,
  course_fee text,
  course_duration text,
  batch_timing text,
  class_location text,
  cta_primary text,
  cta_secondary text,
  highlights jsonb DEFAULT '[]'::jsonb,
  curriculum jsonb DEFAULT '[]'::jsonb,
  gallery jsonb DEFAULT '[]'::jsonb,
  reviews jsonb DEFAULT '[]'::jsonb
);

-- Enable RLS
ALTER TABLE public.classes_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on classes_info"
  ON public.classes_info
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users (admin) to insert/update
CREATE POLICY "Allow authenticated full access on classes_info"
  ON public.classes_info
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default row if not exists
INSERT INTO public.classes_info (id, heading, description, course_fee, course_duration, batch_timing, class_location, cta_primary, cta_secondary)
VALUES (
  1, 
  'Professional Mehndi Training', 
  'Learn the craft from basic to advanced levels. Practical, patient instruction for beginners and developing artists, from confident cone control to complete bridal layouts.',
  '₹15,000',
  '2 Months',
  '11:00 AM to 2:00 PM',
  'Vandana Mehndi Studio, Mumbai',
  'Enroll Now on WhatsApp',
  'Call Now'
) ON CONFLICT (id) DO NOTHING;

-- Also we need a bucket for classes if it doesn't exist, we can use the 'products' bucket or create 'classes'
INSERT INTO storage.buckets (id, name, public) VALUES ('classes', 'classes', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Classes images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'classes' );

CREATE POLICY "Authenticated users can upload classes images."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'classes' );

CREATE POLICY "Authenticated users can update classes images."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( bucket_id = 'classes' );

CREATE POLICY "Authenticated users can delete classes images."
  ON storage.objects FOR DELETE
  TO authenticated
  USING ( bucket_id = 'classes' );
