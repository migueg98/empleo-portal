
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 relative">
          <p className="text-sm">
            © 2024 [NOMBRE DE EMPRESA]. Todos los derechos reservados.
          </p>
          <p className="text-xs mt-2">
            Portal de empleo accesible y conforme con RGPD
          </p>
          
          {/* Hidden admin link */}
          <Link 
            to="/admin-login" 
            className="absolute right-0 bottom-0 opacity-20 hover:opacity-50 transition-opacity"
            aria-label="Admin"
          >
            <Settings size={16} className="text-gray-400" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
