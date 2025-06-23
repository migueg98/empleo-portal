
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessFilter from '@/components/BusinessFilter';
import JobCard from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockJobs } from '@/data/mockJobs';
import { Search } from 'lucide-react';

const Jobs = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(mockJobs.map(job => job.city))];
    return uniqueCities.sort();
  }, []);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      const matchesBusiness = !selectedBusiness || job.business === selectedBusiness;
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || job.city === selectedCity;
      
      return matchesBusiness && matchesSearch && matchesCity;
    });
  }, [selectedBusiness, searchTerm, selectedCity]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Empleos Disponibles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra la oportunidad profesional perfecta para ti. 
            Explora todas nuestras posiciones abiertas.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar por título, área o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Buscar empleos"
              />
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger aria-label="Filtrar por ciudad">
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
              <span className="text-sm text-gray-600 mr-2">
                {filteredJobs.length} posición{filteredJobs.length !== 1 ? 'es' : ''} encontrada{filteredJobs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por línea de negocio:
            </label>
            <BusinessFilter 
              selectedBusiness={selectedBusiness}
              onBusinessChange={setSelectedBusiness}
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron empleos que coincidan con los filtros seleccionados.
            </p>
            <p className="text-gray-400 mt-2">
              Intenta ajustar tus criterios de búsqueda.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;
