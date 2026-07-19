-- Add the missing order column
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;

-- Add the missing subCategory column (used in Mehndi Classes)
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS "subCategory" text;

-- Add the missing user_id column (if you intend to restrict access)
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS "user_id" uuid REFERENCES auth.users(id);
