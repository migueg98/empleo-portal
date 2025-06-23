
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
import { JobApplication } from '@/types/job';
import { mockJobs } from '@/data/mockJobs';
import { Search, Users, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';

// Mock data for applications
const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    fullName: 'Ana García López',
    age: 28,
    email: 'ana.garcia@email.com',
    phone: '+34 612 345 678',
    selectedPositions: ['1'],
    sectorExperience: 'Sí',
    positionExperience: 'Sí',
    relevantExperience: 'Camarera con 6 años de experiencia en hostelería. He trabajado en varios restaurantes y tabancos.',
    availability: 'Inmediata',
    additionalComments: 'Me interesa especialmente trabajar en tabancos tradicionales.',
    status: 'received',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    consentGiven: true
  },
  {
    id: '2',
    jobId: '2',
    fullName: 'Carlos Martínez Ruiz',
    age: 35,
    email: 'carlos.martinez@email.com',
    phone: '+34 698 765 432',
    selectedPositions: ['2'],
    sectorExperience: 'Sí',
    positionExperience: 'No',
    relevantExperience: 'Cocinero con 4 años de experiencia en restaurantes. Especializado en cocina andaluza.',
    availability: '< 1 mes',
    additionalComments: '',
    status: 'reviewing',
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-16'),
    consentGiven: true
  },
  {
    id: '3',
    jobId: '3',
    fullName: 'María José Fernández',
    age: 24,
    email: 'mj.fernandez@email.com',
    phone: '+34 654 987 321',
    selectedPositions: ['3'],
    sectorExperience: 'No',
    positionExperience: 'No',
    relevantExperience: 'Recién graduada en Administración y Finanzas. Busco mi primera oportunidad en el sector.',
    availability: '1-3 meses',
    additionalComments: 'Disponible para relocalizarme si es necesario.',
    status: 'contacted',
    createdAt: new Date('2024-02-13'),
    updatedAt: new Date('2024-02-17'),
    consentGiven: true
  },
  {
    id: '4',
    jobId: '1',
    fullName: 'Roberto Silva Vega',
    age: 30,
    email: 'roberto.silva@email.com',
    phone: '+34 611 222 333',
    selectedPositions: ['1'],
    sectorExperience: 'Sí',
    positionExperience: 'Sí',
    relevantExperience: 'Camarero con experiencia en bares y tabernas. Conozco bien los vinos de Jerez.',
    availability: 'Inmediata',
    additionalComments: 'Busco nuevos desafíos profesionales.',
    status: 'closed',
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-18'),
    consentGiven: true
  }
];

const Admin = () => {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const job = mockJobs.find(j => j.id === app.jobId);
      
      const matchesSearch = !searchTerm || 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job?.title.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
      const matchesBusiness = selectedBusiness === 'all' || job?.business === selectedBusiness;
      const matchesCity = selectedCity === 'all' || job?.city === selectedCity;
      
      return matchesSearch && matchesJob && matchesBusiness && matchesCity;
    });
  }, [applications, searchTerm, selectedJob, selectedBusiness, selectedCity]);

  const handleStatusChange = (applicationId: string, newStatus: JobApplication['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, updatedAt: new Date() }
          : app
      )
    );
  };

  const statistics = useMemo(() => {
    const total = applications.length;
    const received = applications.filter(app => app.status === 'received').length;
    const reviewing = applications.filter(app => app.status === 'reviewing').length;
    const contacted = applications.filter(app => app.status === 'contacted').length;
    const closed = applications.filter(app => app.status === 'closed').length;
    
    return { total, received, reviewing, contacted, closed };
  }, [applications]);

  const businesses = ['Tabanco Las Banderillas', 'Taberna Jerez', 'Tabanco San Pablo', 'Restaurante Mareal', 'Licojerez'];
  const cities = [...new Set(mockJobs.map(job => job.city))].sort();

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
                      placeholder="Buscar por nombre, email o puesto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los puestos" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="all">Todos los puestos</SelectItem>
                      {mockJobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los negocios" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="all">Todos los negocios</SelectItem>
                      {businesses.map((business) => (
                        <SelectItem key={business} value={business}>{business}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las ciudades" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-md">
                      <SelectItem value="all">Todas las ciudades</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
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
              onStatusChange={handleStatusChange}
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
