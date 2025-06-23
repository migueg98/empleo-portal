
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessCard from '@/components/BusinessCard';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { mockJobs, businesses } from '@/data/mockJobs';
import { Users, Heart, Wine, ArrowRight } from 'lucide-react';

const Home = () => {
  const featuredJobs = mockJobs.slice(0, 3);

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
            Forma parte de la tradición hostelera de Jerez de la Frontera
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Quiénes Somos
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Somos un grupo hostelero nacido en Jerez de la Frontera. Gestionamos cuatro tabancos 
                de tradición centenaria y una distribuidora de bebidas:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-primary font-medium mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Wine size={20} />
                  <span>Tabanco Las Banderillas</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Wine size={20} />
                  <span>Taberna Jerez</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Wine size={20} />
                  <span>Tabanco San Pablo</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  <span>Restaurante Mareal</span>
                </div>
                <div className="flex items-center justify-center gap-2 md:col-span-2">
                  <Heart size={20} />
                  <span>Licojerez (distribuidora de vinos y licores)</span>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Nuestra misión es ofrecer auténtica gastronomía jerezana y un servicio cercano, 
                tanto en sala como en distribución.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Nuestros Negocios
            </h2>
            <p className="text-lg text-gray-600">
              Conoce los establecimientos que forman nuestro grupo hostelero
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Últimas Oportunidades
            </h2>
            <p className="text-lg text-gray-600">
              Descubre las posiciones abiertas en nuestro grupo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
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
