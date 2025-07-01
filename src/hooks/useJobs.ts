
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
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('name');

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast({
        title: "Error",
        description: "Error al cargar sectores. Revisa la consola para más detalles.",
        variant: "destructive",
      });
    }
  };

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from Supabase...');
      const { data, error } = await supabase
        .from('jobs_with_sectors')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw jobs data:', data);

      const transformedJobs: JobPosition[] = (data || []).map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        business: job.business,
        city: job.city,
        isActive: job.is_active,
        createdAt: new Date(job.created_at),
        sector: job.sector_name || job.sector,
        sectorId: job.sector_id
      }));

      console.log('Transformed jobs:', transformedJobs);
      setJobs(transformedJobs);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError('Error loading jobs. Please try again.');
      setJobs([]);
      toast({
        title: "Error",
        description: "Error al cargar empleos. Revisa la consola para más detalles.",
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

      if (error) throw error;
      
      console.log('Successfully added job:', data);
      await fetchJobs(); // Refresh the jobs list
      
      toast({
        title: "Éxito",
        description: "Vacante creada correctamente.",
      });
    } catch (error: any) {
      console.error('Error adding job:', error);
      toast({
        title: "Error",
        description: "Error al crear la vacante. Revisa la consola para más detalles.",
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
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Successfully updated job:', data);
      await fetchJobs(); // Refresh the jobs list
      
      toast({
        title: "Éxito",
        description: "Vacante actualizada correctamente.",
      });
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la vacante. Revisa la consola para más detalles.",
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

      if (error) throw error;
      
      console.log('Successfully deleted job:', id);
      await fetchJobs(); // Refresh the jobs list
      
      toast({
        title: "Éxito",
        description: "Vacante eliminada correctamente.",
      });
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la vacante. Revisa la consola para más detalles.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('useJobs: Setting up subscription...');
    fetchSectors();
    fetchJobs();

    if (channelRef.current) {
      console.log('Cleaning up existing jobs channel...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

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
        });
    } catch (error) {
      console.error('Error setting up jobs real-time subscription:', error);
    }

    return () => {
      console.log('useJobs: Cleaning up...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
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
