
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, Calendar, FileText, ExternalLink } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';

const CandidatePortalContent = () => {
  const [email, setEmail] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { candidates, loading } = useCandidates();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
  };

  // Safe filtering with null checks
  const userApplications = (candidates || []).filter(app => 
    searchPerformed && email && app.email.toLowerCase() === email.toLowerCase()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'bg-blue-100 text-blue-800';
      case 'no_valido':
        return 'bg-red-100 text-red-800';
      case 'posible':
        return 'bg-yellow-100 text-yellow-800';
      case 'buen_candidato':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'En revisión';
      case 'no_valido':
        return 'No válido';
      case 'posible':
        return 'Candidato posible';
      case 'buen_candidato':
        return 'Buen candidato';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Portal del Candidato
            </h1>
            <p className="text-lg text-text/70 mb-6">
              Consulta el estado de tus postulaciones
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                Buscar mis candidaturas
              </CardTitle>
              <CardDescription>
                Introduce tu email para ver el estado de tus postulaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  type="email"
                  placeholder="tu-email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searchPerformed && (
            <div>
              {userApplications.length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-primary mb-4">
                    Tus candidaturas ({userApplications.length})
                  </h2>
                  
                  {userApplications.map((application) => (
                    <Card key={application.id} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              Postulación - {application.jobId}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {application.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={14} />
                                {application.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(application.createdAt).toLocaleDateString()}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(application.internalStatus)}>
                            {getStatusText(application.internalStatus)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Edad:</strong> {application.age} años</p>
                            <p><strong>Disponibilidad:</strong> {application.availability}</p>
                            <p><strong>Experiencia en el sector:</strong> {application.sectorExperience}</p>
                            <p><strong>Experiencia en el puesto:</strong> {application.positionExperience}</p>
                          </div>
                          <div>
                            {application.selectedPositions.length > 0 && (
                              <div className="mb-2">
                                <strong>Posiciones seleccionadas:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {application.selectedPositions.map((position, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {position}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {application.cvUrl && (
                              <div className="mt-2">
                                <Button variant="outline" size="sm" asChild>
                                  <a 
                                    href={application.cvUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <FileText size={14} />
                                    Ver CV
                                    <ExternalLink size={12} />
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {application.relevantExperience && (
                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <strong className="block mb-1">Experiencia relevante:</strong>
                            <p className="text-sm text-gray-700">{application.relevantExperience}</p>
                          </div>
                        )}
                        
                        {application.additionalComments && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <strong className="block mb-1">Comentarios adicionales:</strong>
                            <p className="text-sm text-blue-700">{application.additionalComments}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-text/70 text-lg mb-4">
                      No se encontraron candidaturas para este email.
                    </p>
                    <p className="text-text/50 mb-6">
                      Verifica que hayas introducido el email correcto o 
                    </p>
                    <Link to="/empleos">
                      <Button variant="outline">
                        Ver empleos disponibles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const CandidatePortal = () => {
  return (
    <ErrorBoundary>
      <CandidatePortalContent />
    </ErrorBoundary>
  );
};

export default CandidatePortal;
