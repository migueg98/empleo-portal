
-- Create sectors lookup table
CREATE TABLE public.sectors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the three main sectors
INSERT INTO public.sectors (name) VALUES 
  ('Hostelería'),
  ('Distribuidora'), 
  ('Otros');

-- Add sector_id column to jobs table
ALTER TABLE public.jobs ADD COLUMN sector_id INTEGER REFERENCES public.sectors(id);

-- Update existing jobs to have proper sector_id based on current sector values
UPDATE public.jobs 
SET sector_id = (
  SELECT s.id 
  FROM public.sectors s 
  WHERE s.name = CASE 
    WHEN public.jobs.sector ILIKE '%hostel%' OR public.jobs.sector ILIKE '%camar%' OR public.jobs.sector ILIKE '%cocin%' THEN 'Hostelería'
    WHEN public.jobs.sector ILIKE '%distrib%' OR public.jobs.sector ILIKE '%almac%' OR public.jobs.sector ILIKE '%reparto%' THEN 'Distribuidora'
    ELSE 'Otros'
  END
);

-- Make sector_id NOT NULL after updating existing data
ALTER TABLE public.jobs ALTER COLUMN sector_id SET NOT NULL;

-- Create a view for easy querying with sector names
CREATE OR REPLACE VIEW public.jobs_with_sectors AS
SELECT 
  j.*,
  s.name as sector_name
FROM public.jobs j
JOIN public.sectors s ON j.sector_id = s.id;

-- Enable RLS on sectors table (read-only for public access)
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read sectors
CREATE POLICY "Everyone can read sectors" ON public.sectors FOR SELECT USING (true);
