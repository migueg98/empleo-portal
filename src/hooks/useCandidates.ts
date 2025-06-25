
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedCandidates: JobApplication[] = data.map(candidate => ({
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

      setCandidates(transformedCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateId: string, newStatus: JobApplication['status']) => {
    try {
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
    }
  };

  const addCandidate = async (candidateData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
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
      await fetchCandidates(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error adding candidate:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCandidates();

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Set up real-time subscription with unique channel name
    const channelName = `candidates-changes-${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'candidates'
      }, () => {
        fetchCandidates();
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return { 
    candidates, 
    loading, 
    updateCandidateStatus, 
    addCandidate,
    refreshCandidates: fetchCandidates 
  };
};
