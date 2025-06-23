
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/job';
import { mockJobs } from '@/data/mockJobs';
import { ChevronRight, Mail, Phone, Calendar, MessageSquare } from 'lucide-react';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (applicationId: string, newStatus: JobApplication['status']) => void;
}

const statusLabels = {
  received: 'Recibido',
  reviewing: 'En Revisión',
  contacted: 'Contactado',
  closed: 'Cerrado'
};

const statusColors = {
  received: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const KanbanBoard = ({ applications, onStatusChange }: KanbanBoardProps) => {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const getJobTitle = (jobId: string) => {
    const job = mockJobs.find(j => j.id === jobId);
    return job?.title || 'Puesto no encontrado';
  };

  const getNextStatus = (currentStatus: JobApplication['status']): JobApplication['status'] | null => {
    const statusFlow = ['received', 'reviewing', 'contacted', 'closed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] as JobApplication['status'] : null;
  };

  const groupedApplications = applications.reduce((acc, app) => {
    if (!acc[app.status]) {
      acc[app.status] = [];
    }
    acc[app.status].push(app);
    return acc;
  }, {} as Record<JobApplication['status'], JobApplication[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(statusLabels).map(([status, label]) => (
        <div key={status} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">{label}</h3>
            <Badge variant="secondary">
              {groupedApplications[status as JobApplication['status']]?.length || 0}
            </Badge>
          </div>
          
          <div className="space-y-2 min-h-96">
            {(groupedApplications[status as JobApplication['status']] || []).map((application) => {
              const nextStatus = getNextStatus(application.status);
              
              return (
                <Card 
                  key={application.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedApplication(application)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium">
                        {application.fullName}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${statusColors[application.status]}`}
                      >
                        {statusLabels[application.status]}
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
                    </div>
                    
                    {nextStatus && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(application.id, nextStatus);
                        }}
                      >
                        Mover a {statusLabels[nextStatus]}
                        <ChevronRight size={12} className="ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Application Detail Modal/Panel */}
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
                <p className="text-sm font-medium mb-1">Experiencia Relevante:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {selectedApplication.relevantExperience}
                </p>
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
