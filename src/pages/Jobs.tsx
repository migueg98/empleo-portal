
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VacancyCard from '@/components/VacancyCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { jobs, loading } = useJobs();

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.business.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Convert jobs to vacancy format for VacancyCard
  const vacancies = filteredJobs.map(job => ({
    id: job.id,
    sector: job.title,
    puesto: job.title,
    descripcion: job.description,
    isActive: job.isActive,
    createdAt: job.createdAt
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Cargando empleos...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Empleos Disponibles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Encuentra tu próxima oportunidad profesional en nuestro grupo hostelero
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
            <p className="text-gray-500 text-lg">
              No se encontraron empleos que coincidan con tu búsqueda.
            </p>
            <p className="text-gray-400 mt-2">
              Intenta con otras palabras clave.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;
