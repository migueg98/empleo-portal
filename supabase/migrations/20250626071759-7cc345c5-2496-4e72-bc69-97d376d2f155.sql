
-- Add unique constraint to prevent duplicate applications
ALTER TABLE public.candidates 
ADD CONSTRAINT unique_candidate_job_email UNIQUE (email, job_id);
