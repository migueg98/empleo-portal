
import { Link } from 'react-router-dom';
import { Settings, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-line mt-20">
      <div className="container mx-auto px-6 py-10">
        <div className="text-center text-primary relative">
          <div className="mb-4">
            <p className="text-sm font-medium">
              Portal de Empleo – Grupo Tabancos & Licojerez
            </p>
          </div>
          <div className="mb-6">
            <p className="text-sm text-primary/70">
              © 2024 Todos los derechos reservados.
            </p>
            <p className="text-xs mt-2 text-primary/50">
              Portal de empleo accesible y conforme con RGPD
            </p>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-4">
            <a 
              href="#" 
              className="text-primary/40 hover:text-accent transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="#" 
              className="text-primary/40 hover:text-accent transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
          
          {/* Hidden admin link */}
          <Link 
            to="/admin-login" 
            className="absolute right-0 bottom-0 opacity-20 hover:opacity-50 transition-opacity duration-200"
            aria-label="Admin"
          >
            <Settings size={16} className="text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
