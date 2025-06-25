
-- Create candidates table for job applications
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  job_id TEXT NOT NULL,
  selected_positions TEXT[] DEFAULT '{}',
  sector_experience TEXT NOT NULL CHECK (sector_experience IN ('Sí', 'No')),
  position_experience TEXT NOT NULL CHECK (position_experience IN ('Sí', 'No')),
  availability TEXT NOT NULL CHECK (availability IN ('Inmediata', '< 1 mes', '1-3 meses', '> 3 meses')),
  additional_comments TEXT,
  cv_url TEXT,
  estado TEXT NOT NULL DEFAULT 'received' CHECK (estado IN ('received', 'reviewing', 'contacted', 'closed')),
  consent_given BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table for open positions
CREATE TABLE public.jobs (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  business TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Jerez de la Frontera',
  sector TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', true);

-- Enable RLS on both tables
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for candidates table (public read/write for now)
CREATE POLICY "Anyone can view candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert candidates" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update candidates" ON public.candidates FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete candidates" ON public.candidates FOR DELETE USING (true);

-- Create policies for jobs table (public read/write for now)
CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert jobs" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update jobs" ON public.jobs FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete jobs" ON public.jobs FOR DELETE USING (true);

-- Create storage policies for CVs bucket
CREATE POLICY "Anyone can upload CVs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cvs');
CREATE POLICY "Anyone can view CVs" ON storage.objects FOR SELECT USING (bucket_id = 'cvs');
CREATE POLICY "Anyone can update CVs" ON storage.objects FOR UPDATE USING (bucket_id = 'cvs');
CREATE POLICY "Anyone can delete CVs" ON storage.objects FOR DELETE USING (bucket_id = 'cvs');

-- Insert some initial job data
INSERT INTO public.jobs (id, title, description, business, sector) VALUES 
('1', 'Camarero/a de Sala', 'Atención al cliente en tabanco tradicional. Conocimiento de vinos de Jerez valorado.', 'Tabanco Las Banderillas', 'Hostelería'),
('2', 'Cocinero/a', 'Preparación de tapas tradicionales y platos de la casa. Experiencia en cocina andaluza.', 'Taberna Jerez', 'Cocina'),
('3', 'Ayudante de Cocina', 'Apoyo en cocina, preparación de ingredientes y mantenimiento del área de trabajo.', 'Tabanco San Pablo', 'Cocina'),
('4', 'Barman/Barmaid', 'Preparación de cócteles y bebidas. Conocimiento en vinos y licores de la zona.', 'Restaurante Mareal', 'Bar'),
('5', 'Administrativo/a', 'Gestión administrativa, facturación y atención telefónica. Conocimientos de informática.', 'Licojerez', 'Administración'),
('6', 'Repartidor/a', 'Distribución de productos a clientes. Carnet de conducir y vehículo propio necesarios.', 'Licojerez', 'Logística');

-- Enable realtime for both tables
ALTER TABLE public.candidates REPLICA IDENTITY FULL;
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
