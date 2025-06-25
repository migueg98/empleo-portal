
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchCandidates = async () => {
    try {
      console.log('Fetching candidates from Supabase...');
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw candidates data:', data);

      const transformedCandidates: JobApplication[] = (data || []).map(candidate => ({
        id: candidate.id,
        jobId: candidate.job_id,
        fullName: candidate.full_name,
        age: candidate.age,
        email: candidate.email,
        phone: candidate.phone,
        selectedPositions: candidate.selected_positions || [],
        sectorExperience: candidate.sector_experience as 'Sí' | 'No',
        positionExperience: candidate.position_experience as 'Sí' | 'No',
        availability: candidate.availability as 'Inmediata' | '< 1 mes' | '1-3 meses' | '> 3 meses',
        relevantExperience: '',
        additionalComments: candidate.additional_comments || '',
        curriculum: undefined,
        status: candidate.estado as 'received' | 'reviewing' | 'contacted' | 'closed',
        createdAt: new Date(candidate.created_at),
        updatedAt: new Date(candidate.updated_at),
        consentGiven: candidate.consent_given,
        cvUrl: candidate.cv_url
      }));

      console.log('Transformed candidates:', transformedCandidates);
      setCandidates(transformedCandidates);
      setError(null);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Error loading candidates. Please try again.');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateId: string, newStatus: JobApplication['status']) => {
    try {
      console.log(`Updating candidate ${candidateId} status to ${newStatus}`);
      const { error } = await supabase
        .from('candidates')
        .update({ 
          estado: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId);

      if (error) throw error;
      await fetchCandidates(); // Refresh the list
    } catch (error) {
      console.error('Error updating candidate status:', error);
      setError('Error updating candidate status. Please try again.');
    }
  };

  const addCandidate = async (candidateData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding new candidate:', candidateData);
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
          full_name: candidateData.fullName,
          age: candidateData.age,
          email: candidateData.email,
          phone: candidateData.phone,
          job_id: candidateData.jobId,
          selected_positions: candidateData.selectedPositions,
          sector_experience: candidateData.sectorExperience,
          position_experience: candidateData.positionExperience,
          availability: candidateData.availability,
          additional_comments: candidateData.additionalComments,
          cv_url: candidateData.cvUrl,
          estado: candidateData.status,
          consent_given: candidateData.consentGiven
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Successfully added candidate:', data);
      await fetchCandidates(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError('Error adding candidate. Please try again.');
      throw error;
    }
  };

  useEffect(() => {
    console.log('useCandidates: Setting up subscription...');
    fetchCandidates();

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing channel...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time subscription with unique channel name
    const channelName = `candidates-changes-${Math.random().toString(36).substring(7)}`;
    console.log('Creating new channel:', channelName);
    
    try {
      channelRef.current = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'candidates'
        }, (payload) => {
          console.log('Real-time update received:', payload);
          fetchCandidates();
        })
        .subscribe((status) => {
          console.log('Channel subscription status:', status);
        });
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
    }

    return () => {
      console.log('useCandidates: Cleaning up...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return { 
    candidates, 
    loading, 
    error,
    updateCandidateStatus, 
    addCandidate,
    refreshCandidates: fetchCandidates 
  };
};
