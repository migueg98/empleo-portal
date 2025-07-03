import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication } from '@/types/job';
import { toast } from '@/hooks/use-toast';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

  const fetchCandidates = async () => {
    try {
      console.log('Fetching candidates from Supabase...');
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Candidates fetch error:', error);
        throw error;
      }

      console.log('Raw candidates data:', data);

      // Fetch job information for all candidates
      const jobIds = [...new Set((data || []).map(candidate => candidate.job_id))];
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs_with_sectors')
        .select('id, title, sector_name')
        .in('id', jobIds);

      if (jobsError) {
        console.error('Jobs fetch error:', jobsError);
        // Don't throw here, just log - we can still show candidates without job details
      }

      // Create a map of job information
      const jobsMap = new Map();
      (jobsData || []).forEach(job => {
        jobsMap.set(job.id, {
          title: job.title,
          sector: job.sector_name
        });
      });

      const transformedCandidates: JobApplication[] = (data || []).map(candidate => {
        const jobInfo = jobsMap.get(candidate.job_id);
        return {
          id: candidate.id,
          jobId: candidate.job_id || '',
          jobTitle: jobInfo?.title || 'Trabajo no encontrado',
          jobSector: jobInfo?.sector || 'Sector no encontrado',
          fullName: candidate.full_name || 'Sin nombre',
          age: candidate.age || 0,
          email: candidate.email || '',
          phone: candidate.phone || '',
          selectedPositions: candidate.selected_positions || [],
          sectorExperience: (candidate.sector_experience as 'Sí' | 'No') || 'No',
          positionExperience: (candidate.position_experience as 'Sí' | 'No') || 'No',
          availability: (candidate.availability as 'Inmediata' | '< 1 mes' | '1-3 meses' | '> 3 meses') || 'Inmediata',
          relevantExperience: '',
          additionalComments: candidate.additional_comments || '',
          curriculum: undefined,
          internalStatus: (candidate.estado_interno as 'nuevo' | 'no_valido' | 'posible' | 'buen_candidato') || 'nuevo',
          createdAt: new Date(candidate.created_at),
          updatedAt: new Date(candidate.updated_at),
          consentGiven: candidate.consent_given || false,
          cvUrl: candidate.cv_url
        };
      });

      console.log('Transformed candidates:', transformedCandidates);
      setCandidates(transformedCandidates);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setError(`Error loading candidates: ${errorMessage}`);
      setCandidates([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateId: string, newInternalStatus: JobApplication['internalStatus']): Promise<void> => {
    try {
      console.log(`Updating candidate ${candidateId} internal status to ${newInternalStatus}`);
      
      const { error } = await supabase
        .from('candidates')
        .update({ 
          estado_interno: newInternalStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateId);

      if (error) {
        console.error('Candidate status update error:', error);
        throw error;
      }

      console.log(`Successfully updated candidate ${candidateId} internal status to ${newInternalStatus}`);
      
      // Update local state immediately for better UX
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => 
          candidate.id === candidateId 
            ? { 
                ...candidate, 
                internalStatus: newInternalStatus,
                updatedAt: new Date() 
              }
            : candidate
        )
      );
    } catch (error: any) {
      console.error('Error updating candidate status:', error);
      const errorMessage = error.message || 'Error desconocido';
      throw new Error(`No se pudo actualizar el estado del candidato: ${errorMessage}`);
    }
  };

  const addCandidate = async (candidateData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Adding new candidate:', candidateData);
      
      // Check for duplicate application
      const { data: existingCandidate, error: checkError } = await supabase
        .from('candidates')
        .select('id')
        .eq('email', candidateData.email)
        .eq('job_id', candidateData.jobId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking duplicate candidate:', checkError);
        throw checkError;
      }

      if (existingCandidate) {
        return { 
          success: false, 
          error: 'Ya te has inscrito en esta oferta con este correo.' 
        };
      }

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
          estado_interno: candidateData.internalStatus || 'nuevo',
          consent_given: candidateData.consentGiven
        }])
        .select()
        .single();

      if (error) {
        console.error('Candidate creation error:', error);
        throw error;
      }
      
      console.log('Successfully added candidate:', data);
      await fetchCandidates(); // Refresh the list
      return { success: true };
    } catch (error: any) {
      console.error('Error adding candidate:', error);
      const errorMessage = error.message || 'Error desconocido';
      return { 
        success: false, 
        error: `No se pudo añadir el candidato: ${errorMessage}` 
      };
    }
  };

  const deleteCandidate = async (candidateId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`Deleting candidate ${candidateId}`);
      
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId);

      if (error) {
        console.error('Candidate deletion error:', error);
        throw error;
      }

      console.log(`Successfully deleted candidate ${candidateId}`);
      
      // Update local state immediately for better UX
      setCandidates(prevCandidates => 
        prevCandidates.filter(candidate => candidate.id !== candidateId)
      );

      toast({
        title: "Datos eliminados",
        description: "Tus datos han sido eliminados correctamente.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting candidate:', error);
      const errorMessage = error.message || 'Error desconocido';
      
      toast({
        title: "Error",
        description: `No se pudieron eliminar los datos: ${errorMessage}`,
        variant: "destructive",
      });

      return { 
        success: false, 
        error: `No se pudieron eliminar los datos: ${errorMessage}` 
      };
    }
  };

  useEffect(() => {
    console.log('useCandidates: Setting up subscription...');
    fetchCandidates();

    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing candidates channel...');
      try {
        supabase.removeChannel(channelRef.current);
      } catch (cleanupError) {
        console.warn('Error cleaning up existing channel:', cleanupError);
      }
      channelRef.current = null;
    }

    // Set up real-time subscription with unique channel name
    const channelName = `candidates-changes-${Math.random().toString(36).substring(7)}`;
    console.log('Creating new candidates channel:', channelName);
    
    try {
      channelRef.current = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'candidates'
        }, (payload) => {
          console.log('Candidates real-time update received:', payload);
          fetchCandidates();
        })
        .subscribe((status) => {
          console.log('Candidates channel subscription status:', status);
          if (status === 'CHANNEL_ERROR') {
            console.error('Failed to subscribe to candidates channel - real-time updates may not work');
            // Don't set error state for subscription failures, just log
          }
        });
    } catch (error) {
      console.error('Error setting up candidates real-time subscription:', error);
      // Don't set error state for subscription failures, just log
    }

    return () => {
      console.log('useCandidates: Cleaning up...');
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
    candidates, 
    loading, 
    error,
    updateCandidateStatus, 
    addCandidate,
    deleteCandidate,
    refreshCandidates: fetchCandidates 
  };
};
