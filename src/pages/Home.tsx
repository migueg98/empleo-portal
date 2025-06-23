
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessFilter from '@/components/BusinessFilter';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { mockJobs } from '@/data/mockJobs';
import { Users, Target, TrendingUp, ArrowRight } from 'lucide-react';

const Home = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const filteredJobs = selectedBusiness 
    ? mockJobs.filter(job => job.business === selectedBusiness).slice(0, 3)
    : mockJobs.slice(0, 3);

  const businessDescriptions = {
    'Negocio A': 'Innovación tecnológica y desarrollo de software de vanguardia.',
    'Negocio B': 'Estrategias de marketing digital y experiencia del cliente.',
    'Negocio C': 'Consultoría empresarial y optimización de procesos.'
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Únete a Nuestro Equipo
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Descubre oportunidades profesionales en una empresa líder en innovación y crecimiento
          </p>
          <Link to="/empleos">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-3"
            >
              Ver Empleos Disponibles
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50" id="quienes-somos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Quiénes Somos
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Somos una empresa comprometida con la excelencia, la innovación y el desarrollo 
              profesional de nuestros colaboradores. Nuestras tres líneas de negocio nos 
              posicionan como líderes en el mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Negocio A</h3>
              <p className="text-gray-600">{businessDescriptions['Negocio A']}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Negocio B</h3>
              <p className="text-gray-600">{businessDescriptions['Negocio B']}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Negocio C</h3>
              <p className="text-gray-600">{businessDescriptions['Negocio C']}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              Explora Oportunidades por Área de Negocio
            </h2>
            <p className="text-gray-600 mb-6">
              Filtra las posiciones según la línea de negocio que más te interese
            </p>
            <BusinessFilter 
              selectedBusiness={selectedBusiness}
              onBusinessChange={setSelectedBusiness}
            />
          </div>

          {/* Featured Jobs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/empleos">
              <Button variant="outline" size="lg">
                Ver Todas las Posiciones
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
