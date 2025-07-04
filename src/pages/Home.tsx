import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessCard from '@/components/BusinessCard';
import VacancyCard from '@/components/VacancyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { businesses } from '@/data/mockJobs';
import { Users, Heart, Wine, ArrowRight } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Home = () => {
  const { jobs, loading } = useJobs();
  
  // Get the 4 most recent active jobs for desktop
  const featuredJobs = jobs
    .filter(job => job.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Convert jobs to vacancy format for VacancyCard
  const featuredVacancies = featuredJobs.map(job => ({
    id: job.id,
    sector: job.sector || 'Sin sector',
    puesto: job.title,
    descripcion: job.description,
    isActive: job.isActive,
    createdAt: job.createdAt,
    sectorId: job.sectorId
  }));

  const getSectorBadgeColor = (sector: string) => {
    if (sector.toLowerCase().includes('hostelería') || sector.toLowerCase().includes('tabanco') || sector.toLowerCase().includes('restaurante')) {
      return 'bg-accent text-white border-accent';
    }
    if (sector.toLowerCase().includes('distribuidora') || sector.toLowerCase().includes('licojerez')) {
      return 'bg-primary text-white border-primary';
    }
    return 'bg-primary text-white border-primary';
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 animate-fade-in relative">
            Únete a Nuestro Equipo
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-accent"></span>
          </h1>
          <p className="text-lg xs:text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed mt-6">
            Forma parte de la tradición hostelera de Jerez de la Frontera
          </p>
          <Link to="/empleos">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent hover:brightness-110 text-white text-lg px-10 py-4 h-12 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Ver Empleos Disponibles
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-section" id="quienes-somos">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
              Quiénes Somos
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-text mb-8 leading-relaxed">
                Somos un grupo hostelero nacido en Jerez de la Frontera. Gestionamos cuatro tabancos 
                de tradición centenaria y una distribuidora de bebidas:
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-primary font-medium mb-8">
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
              <p className="text-lg text-text leading-relaxed">
                Nuestra misión es ofrecer auténtica gastronomía jerezana y un servicio cercano, 
                tanto en sala como en distribución.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Nuestros Negocios
            </h2>
            <p className="text-lg text-text/70 leading-relaxed">
              Conoce los establecimientos que forman nuestro grupo hostelero
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-section" id="oportunidades">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Últimas Oportunidades
            </h2>
            <p className="text-lg text-text/70 leading-relaxed">
              Descubre las posiciones abiertas en nuestro grupo
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-lg text-text/70">Cargando oportunidades...</p>
            </div>
          ) : featuredVacancies.length > 0 ? (
            <>
              {/* Desktop View - 4 cards */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 2xl:gap-10 gap-8">
                {featuredVacancies.map((vacancy) => (
                  <div key={vacancy.id} className="relative">
                    <Badge 
                      className={`absolute top-4 right-4 z-10 text-xs font-medium ${getSectorBadgeColor(vacancy.sector)}`}
                    >
                      {vacancy.sector}
                    </Badge>
                    <VacancyCard vacancy={vacancy} />
                  </div>
                ))}
              </div>

              {/* Mobile View - Carousel */}
              <div className="md:hidden">
                <Carousel className="w-full max-w-sm mx-auto">
                  <CarouselContent>
                    {featuredVacancies.map((vacancy) => (
                      <CarouselItem key={vacancy.id}>
                        <div className="relative">
                          <Badge 
                            className={`absolute top-4 right-4 z-10 text-xs font-medium ${getSectorBadgeColor(vacancy.sector)}`}
                          >
                            {vacancy.sector}
                          </Badge>
                          <VacancyCard vacancy={vacancy} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              <div className="text-center mt-12">
                <Link to="/empleos">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-primary border-primary hover:bg-accent/10 hover:border-accent hover:text-accent transition-all duration-200 active:scale-95 min-h-[48px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Ver Todas las Posiciones
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-text/70 text-lg mb-4">
                No hay oportunidades disponibles en este momento.
              </p>
              <p className="text-text/50">
                ¡Vuelve pronto para ver nuevas posiciones!
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
