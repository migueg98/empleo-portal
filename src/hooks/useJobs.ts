
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobPosition } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

export const useJobs = () => {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [sectors, setSectors] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
  const { toast } = useToast();

  const fetchSectors = async () => {
    try {
      console.log('Fetching sectors...');
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');

      if (error) {
        console.error('Sectors fetch error:', error);
        throw error;
      }
      
      console.log('Sectors fetched successfully:', data);
      setSectors(data || []);
    } catch (error: any) {
      console.error('Error fetching sectors:', error);
      setError(`Error loading sectors: ${error.message}`);
      setSectors([]); // Fallback to empty array
    }
  };

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from Supabase...');
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('jobs_with_sectors')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Jobs fetch error:', error);
        throw error;
      }

      console.log('Raw jobs data:', data);

      const transformedJobs: JobPosition[] = (data || []).map(job => ({
        id: job.id,
        title: job.title || 'Sin título',
        description: job.description || 'Sin descripción',
        business: job.business || 'Empresa Principal',
        city: job.city || 'Jerez de la Frontera',
        isActive: job.is_active || false,
        createdAt: new Date(job.created_at),
        sector: job.sector_name || job.sector || 'Sin sector',
        sectorId: job.sector_id || 0
      }));

      console.log('Transformed jobs:', transformedJobs);
      setJobs(transformedJobs);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setError(`Error loading jobs: ${errorMessage}`);
      setJobs([]); // Fallback to empty array
      
      toast({
        title: "Error al cargar empleos",
        description: `No se pudieron cargar los empleos: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData: Omit<JobPosition, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding new job:', jobData);
      const newId = Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          id: newId,
          title: jobData.title,
          description: jobData.description,
          business: jobData.business,
          city: jobData.city,
          sector: jobData.sector,
          sector_id: jobData.sectorId,
          is_active: jobData.isActive
        }])
        .select()
        .single();

      if (error) {
        console.error('Job creation error:', error);
        throw error;
      }
      
      console.log('Successfully added job:', data);
      
      toast({
        title: "Éxito",
        description: "Vacante creada correctamente.",
      });

      await fetchJobs(); // Refresh the jobs list
      
    } catch (error: any) {
      console.error('Error adding job:', error);
      const errorMessage = error.message || 'Error desconocido';
      
      toast({
        title: "Error al crear vacante",
        description: `No se pudo crear la vacante: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateJob = async (id: string, jobData: Partial<Omit<JobPosition, 'id' | 'createdAt'>>) => {
    try {
      console.log('Updating job:', id, jobData);
      
      const updateData: any = {};
      if (jobData.title !== undefined) updateData.title = jobData.title;
      if (jobData.description !== undefined) updateData.description = jobData.description;
      if (jobData.business !== undefined) updateData.business = jobData.business;
      if (jobData.city !== undefined) updateData.city = jobData.city;
      if (jobData.isActive !== undefined) updateData.is_active = jobData.isActive;
      if (jobData.sectorId !== undefined) {
        updateData.sector_id = jobData.sectorId;
        // Also update the legacy sector field for compatibility
        const sector = sectors.find(s => s.id === jobData.sectorId);
        if (sector) updateData.sector = sector.name;
      }

      const { data, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Job update error:', error);
        throw error;
      }
      
      console.log('Successfully updated job:', data);
      
      toast({
        title: "Éxito",
        description: "Vacante actualizada correctamente.",
      });

      await fetchJobs(); // Refresh the jobs list
      
    } catch (error: any) {
      console.error('Error updating job:', error);
      const errorMessage = error.message || 'Error desconocido';
      
      toast({
        title: "Error al actualizar vacante",
        description: `No se pudo actualizar la vacante: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      console.log('Deleting job:', id);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Job deletion error:', error);
        throw error;
      }
      
      console.log('Successfully deleted job:', id);
      
      toast({
        title: "Éxito",
        description: "Vacante eliminada correctamente.",
      });

      await fetchJobs(); // Refresh the jobs list
      
    } catch (error: any) {
      console.error('Error deleting job:', error);
      const errorMessage = error.message || 'Error desconocido';
      
      toast({
        title: "Error al eliminar vacante",
        description: `No se pudo eliminar la vacante: ${errorMessage}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('useJobs: Setting up...');
    
    const initializeJobs = async () => {
      try {
        await fetchSectors();
        await fetchJobs();
      } catch (error) {
        console.error('Failed to initialize jobs:', error);
      }
    };

    initializeJobs();

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing jobs channel...');
      try {
        supabase.removeChannel(channelRef.current);
      } catch (cleanupError) {
        console.warn('Error cleaning up existing channel:', cleanupError);
      }
      channelRef.current = null;
    }

    // Set up real-time subscription with better error handling
    const channelName = `jobs-changes-${Math.random().toString(36).substring(7)}`;
    console.log('Creating new jobs channel:', channelName);
    
    try {
      channelRef.current = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'jobs'
        }, (payload) => {
          console.log('Jobs real-time update received:', payload);
          fetchJobs(); // This will refresh all pages using jobs data
        })
        .subscribe((status) => {
          console.log('Jobs channel subscription status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.error('Failed to subscribe to jobs channel - real-time updates may not work');
            // Don't set error state for subscription failures, just log
          }
        });
    } catch (error) {
      console.error('Error setting up jobs real-time subscription:', error);
      // Don't block the app if real-time fails
    }

    return () => {
      console.log('useJobs: Cleaning up...');
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (cleanupError) {
          console.warn('Error during channel cleanup:', cleanupError);
        }
        channelRef.current = null;
      }
    };
  }, []);

  return { 
    jobs, 
    sectors,
    loading, 
    error, 
    addJob, 
    updateJob, 
    deleteJob, 
    refreshJobs: fetchJobs 
  };
};
