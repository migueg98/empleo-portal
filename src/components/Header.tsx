
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { to: '/', label: 'Inicio' },
    { to: '/empleos', label: 'Empleos' },
    { to: '/mis-candidaturas', label: 'Mis Candidaturas' },
    { to: '/admin', label: 'Admin' },
  ];

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors duration-200 relative group ${
        location.pathname === to 
          ? 'text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent' 
          : 'text-primary hover:text-accent'
      }`}
      onClick={onClick}
    >
      {label}
      {location.pathname !== to && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
      )}
    </Link>
  );

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-line shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-base font-bold text-primary hover:opacity-80 transition-opacity duration-200">
            Bolsa de Trabajo
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-accent min-h-[48px] min-w-[48px] transition-colors duration-200 active:scale-95"
                >
                  <Menu size={20} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="w-full">
                <nav className="flex flex-col space-y-6 p-8">
                  {navigationItems.map((item) => (
                    <NavLink 
                      key={item.to} 
                      to={item.to} 
                      label={item.label} 
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
