
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobPosition } from '@/types/job';

export const useJobs = () => {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedJobs: JobPosition[] = data.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        business: job.business,
        city: job.city,
        isActive: job.is_active,
        createdAt: new Date(job.created_at)
      }));

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData: Omit<JobPosition, 'id' | 'createdAt'>) => {
    try {
      // Generate a unique ID for the new job
      const newId = Math.random().toString(36).substring(2, 15);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          id: newId,
          title: jobData.title,
          description: jobData.description,
          business: jobData.business,
          city: jobData.city,
          sector: jobData.title, // Using title as sector for now
          is_active: jobData.isActive
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchJobs(); // Refresh the list
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  useEffect(() => {
    fetchJobs();

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up real-time subscription with unique channel name
    const channelName = `jobs-changes-${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs'
      }, () => {
        fetchJobs();
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return { jobs, loading, addJob, refreshJobs: fetchJobs };
};
