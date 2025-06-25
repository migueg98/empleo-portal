
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JobApplication } from '@/types/job';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Mail, Phone, Calendar, Download } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (applicationId: string, newStatus: JobApplication['status']) => Promise<void>;
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

const statusOrder: JobApplication['status'][] = ['received', 'reviewing', 'contacted', 'closed'];

const SortableApplicationCard = ({ 
  application, 
  onCardClick 
}: { 
  application: JobApplication; 
  onCardClick: (app: JobApplication) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
      // Fallback for applications without CV
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
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
      onClick={() => onCardClick(application)}
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
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 text-xs h-6"
            onClick={handleDownloadCV}
          >
            <Download size={10} className="mr-1" />
            {application.cvUrl ? 'Descargar CV' : 'Sin CV'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DroppableColumn = ({ 
  status, 
  children, 
  count 
}: { 
  status: JobApplication['status']; 
  children: React.ReactNode; 
  count: number;
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{statusLabels[status]}</h3>
        <Badge variant="secondary">{count}</Badge>
      </div>
      
      <div 
        id={status}
        className="space-y-2 min-h-96 p-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50"
      >
        {children}
      </div>
    </div>
  );
};

const KanbanBoard = ({ applications, onStatusChange }: KanbanBoardProps) => {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { jobs } = useJobs();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const groupedApplications = applications.reduce((acc, app) => {
    if (!acc[app.status]) {
      acc[app.status] = [];
    }
    acc[app.status].push(app);
    return acc;
  }, {} as Record<JobApplication['status'], JobApplication[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setIsDragging(false);
    
    if (!over) {
      console.log('Drag ended without valid drop target');
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    console.log('Drag ended:', { activeId, overId });
    
    // Check if we're dropping over a status container
    if (statusOrder.includes(overId as JobApplication['status'])) {
      const newStatus = overId as JobApplication['status'];
      const activeApplication = applications.find(app => app.id === activeId);
      
      if (activeApplication && activeApplication.status !== newStatus) {
        console.log(`Moving application ${activeId} from ${activeApplication.status} to ${newStatus}`);
        
        try {
          await onStatusChange(activeId, newStatus);
          toast({
            title: "Estado actualizado",
            description: `La candidatura de ${activeApplication.fullName} ha sido movida a ${statusLabels[newStatus]}.`,
          });
        } catch (error) {
          console.error('Error updating status:', error);
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado de la candidatura. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          });
        }
      }
    } else {
      // If dropping over another card, find which status column it belongs to
      const targetApp = applications.find(app => app.id === overId);
      if (targetApp) {
        const activeApplication = applications.find(app => app.id === activeId);
        if (activeApplication && activeApplication.status !== targetApp.status) {
          console.log(`Moving application ${activeId} from ${activeApplication.status} to ${targetApp.status}`);
          
          try {
            await onStatusChange(activeId, targetApp.status);
            toast({
              title: "Estado actualizado",
              description: `La candidatura de ${activeApplication.fullName} ha sido movida a ${statusLabels[targetApp.status]}.`,
            });
          } catch (error) {
            console.error('Error updating status:', error);
            toast({
              title: "Error",
              description: "No se pudo actualizar el estado de la candidatura. Por favor, inténtalo de nuevo.",
              variant: "destructive",
            });
          }
        }
      }
    }
  };

  const activeApplication = activeId ? applications.find(app => app.id === activeId) : null;

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Puesto no encontrado';
  };

  const handleDownloadCV = (application: JobApplication, e: React.MouseEvent) => {
    e.stopPropagation();
    if (application.cvUrl) {
      window.open(application.cvUrl, '_blank');
    } else {
      // Fallback for applications without CV
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
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusOrder.map((status) => (
          <DroppableColumn 
            key={status} 
            status={status} 
            count={groupedApplications[status]?.length || 0}
          >
            <SortableContext 
              items={groupedApplications[status]?.map(app => app.id) || []}
              strategy={verticalListSortingStrategy}
            >
              {(groupedApplications[status] || []).map((application) => (
                <SortableApplicationCard
                  key={application.id}
                  application={application}
                  onCardClick={setSelectedApplication}
                />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <Card className="cursor-grabbing opacity-80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {activeApplication.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-xs text-gray-600">
                <p className="font-medium text-primary">
                  {getJobTitle(activeApplication.jobId)}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>

      {/* Application Detail Modal */}
      {selectedApplication && !isDragging && (
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
    </DndContext>
  );
};

export default KanbanBoard;
