
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Phone, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useJobs } from '@/hooks/useJobs';

interface CandidateApplication {
  id: string;
  jobId: string;
  appliedDate: string;
  status: 'received' | 'reviewing' | 'contacted' | 'closed';
  lastUpdate: string;
  email: string;
}

const statusConfig = {
  received: { label: 'Recibido', color: 'bg-blue-100 text-blue-800' },
  reviewing: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-800' },
  contacted: { label: 'Contactado', color: 'bg-green-100 text-green-800' },
  closed: { label: 'Cerrado', color: 'bg-gray-100 text-gray-800' }
};

const CandidatePortal = () => {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const { jobs } = useJobs();

  const fetchApplications = async (email: string) => {
    if (!email) return;
    
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedApplications: CandidateApplication[] = data.map(candidate => ({
        id: candidate.id,
        jobId: candidate.job_id,
        appliedDate: candidate.created_at,
        status: candidate.estado as 'received' | 'reviewing' | 'contacted' | 'closed',
        lastUpdate: candidate.updated_at,
        email: candidate.email
      }));

      setApplications(transformedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Puesto no encontrado';
  };

  useEffect(() => {
    // For demonstration, we'll use a simple email input
    // In a real app, this would come from authentication
    const email = localStorage.getItem('candidateEmail');
    if (email) {
      setCandidateEmail(email);
      fetchApplications(email);
    } else {
      setLoading(false);
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    if (email) {
      localStorage.setItem('candidateEmail', email);
      setCandidateEmail(email);
      setLoading(true);
      fetchApplications(email);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Cargando candidaturas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Mis Candidaturas
            </h1>
            <p className="text-lg text-gray-600">
              Consulta el estado de tus postulaciones
            </p>
          </div>

          {!candidateEmail ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Acceder a mis candidaturas</CardTitle>
                <CardDescription>
                  Introduce tu email para ver tus postulaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Ver mis candidaturas
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Mostrando candidaturas para: <strong>{candidateEmail}</strong>
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    localStorage.removeItem('candidateEmail');
                    setCandidateEmail('');
                    setApplications([]);
                  }}
                  className="mt-2"
                >
                  Cambiar email
                </Button>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-6">
                  {applications.map((application) => (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-primary mb-2">
                              {getJobTitle(application.jobId)}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                Postulado: {new Date(application.appliedDate).toLocaleDateString('es-ES')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                Actualizado: {new Date(application.lastUpdate).toLocaleDateString('es-ES')}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge className={statusConfig[application.status].color}>
                            {statusConfig[application.status].label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={14} />
                          <span>ID de candidatura: {application.id}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-800 text-lg">
                        Protección de Datos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-700 text-sm mb-4">
                        Si deseas eliminar todos tus datos personales de nuestro sistema, 
                        puedes ejercer tu derecho al olvido.
                      </p>
                      <Button variant="destructive" size="sm">
                        Eliminar mis datos
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                      No tienes candidaturas activas
                    </p>
                    <p className="text-gray-400 mb-6">
                      Explora nuestras ofertas de empleo y postúlate a las que más te interesen
                    </p>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Ver empleos disponibles
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CandidatePortal;
