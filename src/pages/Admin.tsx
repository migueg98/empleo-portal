
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KanbanBoard from '@/components/admin/KanbanBoard';
import VacancyManagement from '@/components/admin/VacancyManagement';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Search, Users, Briefcase, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { useJobs } from '@/hooks/useJobs';

const AdminContent = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedSectorExperience, setSelectedSectorExperience] = useState<string>('all');
  const [selectedPositionExperience, setSelectedPositionExperience] = useState<string>('all');
  
  const { candidates, loading: candidatesLoading, error: candidatesError, updateCandidateStatus, refreshCandidates } = useCandidates();
  const { jobs, sectors, loading: jobsLoading, error: jobsError, refreshJobs } = useJobs();

  useEffect(() => {
    const checkAuth = () => {
      const adminFlag = localStorage.getItem('isAdmin');
      if (adminFlag === 'true') {
        setIsAuthorized(true);
      } else {
        navigate('/admin-login');
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  // Safe data filtering with null checks
  const filteredApplications = useMemo(() => {
    if (!candidates || !Array.isArray(candidates)) return [];
    
    return candidates.filter(app => {
      const job = jobs?.find(j => j.id === app.jobId);
      
      const matchesSearch = !searchTerm || 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job?.title.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
      const matchesSector = selectedSector === 'all' || (job && job.sector === selectedSector);
      const matchesSectorExperience = selectedSectorExperience === 'all' || app.sectorExperience === selectedSectorExperience;
      const matchesPositionExperience = selectedPositionExperience === 'all' || app.positionExperience === selectedPositionExperience;
      
      return matchesSearch && matchesJob && matchesSector && matchesSectorExperience && matchesPositionExperience;
    });
  }, [candidates, jobs, searchTerm, selectedJob, selectedSector, selectedSectorExperience, selectedPositionExperience]);

  const statistics = useMemo(() => {
    if (!candidates || !Array.isArray(candidates)) {
      return { total: 0, nuevo: 0, no_valido: 0, posible: 0, buen_candidato: 0 };
    }
    
    const total = candidates.length;
    const nuevo = candidates.filter(app => app.internalStatus === 'nuevo').length;
    const no_valido = candidates.filter(app => app.internalStatus === 'no_valido').length;
    const posible = candidates.filter(app => app.internalStatus === 'posible').length;
    const buen_candidato = candidates.filter(app => app.internalStatus === 'buen_candidato').length;
    
    return { total, nuevo, no_valido, posible, buen_candidato };
  }, [candidates]);

  const handleRetry = () => {
    refreshCandidates();
    refreshJobs();
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (candidatesLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg text-gray-600">Cargando datos del panel de administración...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (candidatesError || jobsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al cargar el panel de administración</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">{candidatesError || jobsError}</p>
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Panel de Administración - RRHH</h1>
            <p className="text-gray-600">
              Gestiona las postulaciones recibidas y las vacantes disponibles
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600"
          >
            <LogOut size={16} />
            Log out
          </Button>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Users size={16} />
              Postulaciones
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="flex items-center gap-2">
              <Briefcase size={16} />
              Gestión de Vacantes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users size={16} />
                    Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{statistics.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Nuevo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{statistics.nuevo}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">No válido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{statistics.no_valido}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Posible</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{statistics.posible}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Buen candidato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{statistics.buen_candidato}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters with clear labels - using sectors data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                <CardDescription>
                  Utiliza los filtros para encontrar postulaciones específicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Buscar por nombre, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md z-50">
                      <SelectItem value="all">Todos los sectores</SelectItem>
                      {sectors && sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>{sector.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar puesto" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md z-50">
                      <SelectItem value="all">Todos los puestos</SelectItem>
                      {jobs && jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSectorExperience} onValueChange={setSelectedSectorExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Experiencia en el sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md z-50">
                      <SelectItem value="all">Experiencia en el sector - Todos</SelectItem>
                      <SelectItem value="Sí">Experiencia en el sector - Sí</SelectItem>
                      <SelectItem value="No">Experiencia en el sector - No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedPositionExperience} onValueChange={setSelectedPositionExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Experiencia en el puesto" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md z-50">
                      <SelectItem value="all">Experiencia en el puesto - Todos</SelectItem>
                      <SelectItem value="Sí">Experiencia en el puesto - Sí</SelectItem>
                      <SelectItem value="No">Experiencia en el puesto - No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center">
                    <Badge variant="secondary">
                      {filteredApplications.length} resultado{filteredApplications.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kanban Board with safe data */}
            <KanbanBoard 
              applications={filteredApplications || []}
              onStatusChange={updateCandidateStatus}
            />
          </TabsContent>

          <TabsContent value="vacancies">
            <VacancyManagement />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

const Admin = () => {
  return (
    <ErrorBoundary>
      <AdminContent />
    </ErrorBoundary>
  );
};

export default Admin;
