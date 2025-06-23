
import { Utensils } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Utensils size={32} />
            <span className="text-xl font-bold">Bolsa de Trabajo</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-accent transition-colors ${
                location.pathname === '/' ? 'text-accent' : ''
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/empleos" 
              className={`text-sm font-medium hover:text-accent transition-colors ${
                location.pathname === '/empleos' ? 'text-accent' : ''
              }`}
            >
              Empleos
            </Link>
            <Link 
              to="/mis-candidaturas" 
              className={`text-sm font-medium hover:text-accent transition-colors ${
                location.pathname === '/mis-candidaturas' ? 'text-accent' : ''
              }`}
            >
              Mis Candidaturas
            </Link>
            <Link 
              to="/admin" 
              className={`text-sm font-medium hover:text-accent transition-colors ${
                location.pathname === '/admin' ? 'text-accent' : ''
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
