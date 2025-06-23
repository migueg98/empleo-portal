
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Phone, User } from 'lucide-react';

// Mock data - en una aplicación real esto vendría de la API
const mockApplications = [
  {
    id: '1',
    jobTitle: 'Camarero/a de Sala',
    appliedDate: '2024-01-20',
    status: 'reviewing' as const,
    lastUpdate: '2024-01-22'
  },
  {
    id: '2',
    jobTitle: 'Cocinero/a',
    appliedDate: '2024-01-15',
    status: 'contacted' as const,
    lastUpdate: '2024-01-23'
  }
];

const statusConfig = {
  received: { label: 'Recibido', color: 'bg-blue-100 text-blue-800' },
  reviewing: { label: 'En revisión', color: 'bg-yellow-100 text-yellow-800' },
  contacted: { label: 'Contactado', color: 'bg-green-100 text-green-800' },
  closed: { label: 'Cerrado', color: 'bg-gray-100 text-gray-800' }
};

const CandidatePortal = () => {
  const [applications] = useState(mockApplications);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Mis Candidaturas
            </h1>
            <p className="text-lg text-gray-600">
              Consulta el estado de tus postulaciones
            </p>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-6">
              {applications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary mb-2">
                          {application.jobTitle}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Postulado: {new Date(application.appliedDate).toLocaleDateString('es-ES')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Actualizado: {new Date(application.lastUpdate).toLocaleDateString('es-ES')}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={statusConfig[application.status].color}>
                        {statusConfig[application.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={14} />
                      <span>ID de candidatura: {application.id}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 text-lg">
                    Protección de Datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 text-sm mb-4">
                    Si deseas eliminar todos tus datos personales de nuestro sistema, 
                    puedes ejercer tu derecho al olvido.
                  </p>
                  <Button variant="destructive" size="sm">
                    Eliminar mis datos
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No tienes candidaturas activas
                </p>
                <p className="text-gray-400 mb-6">
                  Explora nuestras ofertas de empleo y postúlate a las que más te interesen
                </p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Ver empleos disponibles
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CandidatePortal;
