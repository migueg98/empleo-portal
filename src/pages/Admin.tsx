
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import KanbanBoard from '@/components/admin/KanbanBoard';
import VacancyManagement from '@/components/admin/VacancyManagement';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { useJobs } from '@/hooks/useJobs';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedSectorExperience, setSelectedSectorExperience] = useState<string>('all');
  const [selectedPositionExperience, setSelectedPositionExperience] = useState<string>('all');
  
  const { candidates, loading: candidatesLoading, updateCandidateStatus } = useCandidates();
  const { jobs, loading: jobsLoading } = useJobs();

  const filteredApplications = useMemo(() => {
    return candidates.filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      
      const matchesSearch = !searchTerm || 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job?.title.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
      const matchesSectorExperience = selectedSectorExperience === 'all' || app.sectorExperience === selectedSectorExperience;
      const matchesPositionExperience = selectedPositionExperience === 'all' || app.positionExperience === selectedPositionExperience;
      
      return matchesSearch && matchesJob && matchesSectorExperience && matchesPositionExperience;
    });
  }, [candidates, jobs, searchTerm, selectedJob, selectedSectorExperience, selectedPositionExperience]);

  const statistics = useMemo(() => {
    const total = candidates.length;
    const received = candidates.filter(app => app.status === 'received').length;
    const reviewing = candidates.filter(app => app.status === 'reviewing').length;
    const contacted = candidates.filter(app => app.status === 'contacted').length;
    const closed = candidates.filter(app => app.status === 'closed').length;
    
    return { total, received, reviewing, contacted, closed };
  }, [candidates]);

  if (candidatesLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Cargando datos...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Panel de Administración - RRHH</h1>
          <p className="text-gray-600">
            Gestiona las postulaciones recibidas y las vacantes disponibles
          </p>
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
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock size={16} />
                    Recibidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{statistics.received}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{statistics.reviewing}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle size={16} />
                    Contactados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{statistics.contacted}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <XCircle size={16} />
                    Cerrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{statistics.closed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                <CardDescription>
                  Utiliza los filtros para encontrar postulaciones específicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Buscar por nombre, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger>
                      <SelectValue placeholder="Puesto" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="all">Todos los puestos</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedSectorExperience} onValueChange={setSelectedSectorExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Experiencia en el sector" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Sí">Sí</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedPositionExperience} onValueChange={setSelectedPositionExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Experiencia en el puesto" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Sí">Sí</SelectItem>
                      <SelectItem value="No">No</SelectItem>
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

            {/* Kanban Board */}
            <KanbanBoard 
              applications={filteredApplications}
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

export default Admin;
