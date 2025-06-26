
-- Add internal status column to candidates table
ALTER TABLE public.candidates 
ADD COLUMN estado_interno TEXT NOT NULL DEFAULT 'nuevo' 
CHECK (estado_interno IN ('nuevo', 'no_valido', 'posible', 'buen_candidato'));

-- Create a public view for applicants that hides internal status
CREATE VIEW public.candidate_applications AS
SELECT 
  id,
  job_id,
  full_name,
  email,
  created_at,
  updated_at,
  'En proceso' as estado_publico
FROM public.candidates
WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid());

-- Add policy to allow applicants to delete their own data
CREATE POLICY "Users can delete their own applications" 
  ON public.candidates 
  FOR DELETE 
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
