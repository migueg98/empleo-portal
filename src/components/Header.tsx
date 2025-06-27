
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
      className={`text-sm font-medium text-primary hover:text-accent transition-colors ${
        location.pathname === to ? 'text-accent' : ''
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-white border-b border-line shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-primary hover:opacity-80 transition-opacity">
            Bolsa de Trabajo
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary hover:text-accent">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <NavLink 
                      key={item.to} 
                      to={item.to} 
                      label={item.label} 
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
