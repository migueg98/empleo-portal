
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VacancyCard from '@/components/VacancyCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';

const JobsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { jobs, loading } = useJobs();

  // Safe filtering with null checks
  const filteredJobs = (jobs || []).filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.sector && job.sector.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Convert jobs to vacancy format for VacancyCard with null safety
  const vacancies = filteredJobs.map(job => ({
    id: job.id,
    sector: job.sector || 'Sin sector',
    puesto: job.title,
    descripcion: job.description,
    isActive: job.isActive,
    createdAt: job.createdAt,
    sectorId: job.sectorId
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-text/70">Cargando empleos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Empleos Disponibles
          </h1>
          <p className="text-lg text-text/70 max-w-2xl mx-auto mb-6">
            Encuentra tu próxima oportunidad profesional en nuestro grupo hostelero
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50" size={18} />
            <Input
              placeholder="Buscar por puesto, sector o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Buscar empleos"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {vacancies.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {vacancies.map((vacancy) => (
                <VacancyCard key={vacancy.id} vacancy={vacancy} />
              ))}
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-amber-800 font-medium">
                💼 Te contactaremos desde el negocio que necesite tu perfil
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-text/70 text-lg">
              No se encontraron empleos que coincidan con tu búsqueda.
            </p>
            <p className="text-text/50 mt-2">
              Intenta con otras palabras clave.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const Jobs = () => {
  return (
    <ErrorBoundary>
      <JobsContent />
    </ErrorBoundary>
  );
};

export default Jobs;
