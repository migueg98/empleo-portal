
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Mail, Phone, Calendar, Download } from 'lucide-react';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (applicationId: string, newStatus: JobApplication['internalStatus']) => Promise<void>;
}

const internalStatusLabels = {
  nuevo: 'Nuevo',
  no_valido: 'No válido',
  posible: 'Posible',
  buen_candidato: 'Buen candidato'
};

const internalStatusColors = {
  nuevo: 'bg-blue-100 text-blue-800',
  no_valido: 'bg-red-100 text-red-800',
  posible: 'bg-orange-100 text-orange-800',
  buen_candidato: 'bg-green-100 text-green-800'
};

const statusOrder: JobApplication['internalStatus'][] = ['nuevo', 'no_valido', 'posible', 'buen_candidato'];

const ApplicationCard = ({ 
  application, 
  onCardClick,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight
}: { 
  application: JobApplication; 
  onCardClick: (app: JobApplication) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}) => {
  const { jobs } = useJobs();
  
  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Puesto no encontrado';
  };

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (application.cvUrl) {
      window.open(application.cvUrl, '_blank');
    } else {
      const blob = new Blob(['CV no disponible para ' + application.fullName], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${application.fullName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onCardClick(application)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">
            {application.fullName}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`text-xs ${internalStatusColors[application.internalStatus]}`}
          >
            {internalStatusLabels[application.internalStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-xs text-gray-600">
          <p className="font-medium text-primary">{getJobTitle(application.jobId)}</p>
          <div className="flex items-center gap-1">
            <Mail size={12} />
            <span className="truncate">{application.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone size={12} />
            <span>{application.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(application.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-6"
              onClick={handleDownloadCV}
            >
              <Download size={10} className="mr-1" />
              {application.cvUrl ? 'Descargar CV' : 'Sin CV'}
            </Button>
          </div>
          
          <div className="flex justify-center gap-2 mt-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onMoveLeft();
              }}
              disabled={!canMoveLeft}
            >
              <ChevronLeft size={12} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onMoveRight();
              }}
              disabled={!canMoveRight}
            >
              <ChevronRight size={12} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Column = ({ 
  status, 
  children, 
  count 
}: { 
  status: JobApplication['internalStatus']; 
  children: React.ReactNode; 
  count: number;
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{internalStatusLabels[status]}</h3>
        <Badge variant="secondary">{count}</Badge>
      </div>
      
      <div className="space-y-2 min-h-96 p-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50">
        {children}
      </div>
    </div>
  );
};

const KanbanBoard = ({ applications, onStatusChange }: KanbanBoardProps) => {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const { jobs } = useJobs();
  const { toast } = useToast();

  const groupedApplications = applications.reduce((acc, app) => {
    if (!acc[app.internalStatus]) {
      acc[app.internalStatus] = [];
    }
    acc[app.internalStatus].push(app);
    return acc;
  }, {} as Record<JobApplication['internalStatus'], JobApplication[]>);

  const moveApplication = async (applicationId: string, direction: 'left' | 'right') => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const currentIndex = statusOrder.indexOf(application.internalStatus);
    let newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= statusOrder.length) return;
    
    const newStatus = statusOrder[newIndex];
    
    try {
      await onStatusChange(applicationId, newStatus);
      toast({
        title: "Estado actualizado",
        description: `La candidatura de ${application.fullName} ha sido movida a ${internalStatusLabels[newStatus]}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la candidatura. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Puesto no encontrado';
  };

  const handleDownloadCV = (application: JobApplication, e: React.MouseEvent) => {
    e.stopPropagation();
    if (application.cvUrl) {
      window.open(application.cvUrl, '_blank');
    } else {
      const blob = new Blob(['CV no disponible para ' + application.fullName], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${application.fullName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusOrder.map((status) => (
          <Column 
            key={status} 
            status={status} 
            count={groupedApplications[status]?.length || 0}
          >
            {(groupedApplications[status] || []).map((application) => {
              const currentIndex = statusOrder.indexOf(application.internalStatus);
              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onCardClick={setSelectedApplication}
                  onMoveLeft={() => moveApplication(application.id, 'left')}
                  onMoveRight={() => moveApplication(application.id, 'right')}
                  canMoveLeft={currentIndex > 0}
                  canMoveRight={currentIndex < statusOrder.length - 1}
                />
              );
            })}
          </Column>
        ))}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-96 overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedApplication.fullName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {getJobTitle(selectedApplication.jobId)}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Badge className={internalStatusColors[selectedApplication.internalStatus]}>
                  {internalStatusLabels[selectedApplication.internalStatus]}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm text-gray-600">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Teléfono:</p>
                  <p className="text-sm text-gray-600">{selectedApplication.phone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Disponibilidad:</p>
                <p className="text-sm text-gray-600">{selectedApplication.availability}</p>
              </div>
              
              {selectedApplication.additionalComments && (
                <div>
                  <p className="text-sm font-medium mb-1">Comentarios Adicionales:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {selectedApplication.additionalComments}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button
                  onClick={(e) => handleDownloadCV(selectedApplication, e)}
                  className="flex items-center gap-2"
                  disabled={!selectedApplication.cvUrl}
                >
                  <Download size={16} />
                  {selectedApplication.cvUrl ? 'Descargar CV' : 'Sin CV disponible'}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 pt-2 border-t">
                <p>Postulación recibida: {new Date(selectedApplication.createdAt).toLocaleString('es-ES')}</p>
                <p>Última actualización: {new Date(selectedApplication.updatedAt).toLocaleString('es-ES')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
