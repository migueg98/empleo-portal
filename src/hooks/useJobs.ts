
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobPosition } from '@/types/job';

export const useJobs = () => {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs from Supabase...');
      const { data, error } = await supabase
        .from('jobs')
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
        createdAt: new Date(job.created_at)
      }));

      console.log('Transformed jobs:', transformedJobs);
      setJobs(transformedJobs);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Error loading jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (jobData: Omit<JobPosition, 'id' | 'createdAt'>) => {
    try {
      console.log('Adding new job:', jobData);
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
      console.log('Successfully added job:', data);
      await fetchJobs(); // Refresh the list
    } catch (error) {
      console.error('Error adding job:', error);
      setError('Error adding job. Please try again.');
    }
  };

  useEffect(() => {
    console.log('useJobs: Setting up subscription...');
    fetchJobs();

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing jobs channel...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time subscription with unique channel name
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
          fetchJobs();
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

  return { jobs, loading, error, addJob, refreshJobs: fetchJobs };
};
