
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { JobVacancy } from '@/types/job';
import VacancyForm from './VacancyForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';

const VacancyManagement = () => {
  const { jobs, addJob, refreshJobs } = useJobs();
  const [showForm, setShowForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
  const { toast } = useToast();

  // Convert jobs to vacancy format
  const vacancies: JobVacancy[] = jobs.map(job => ({
    id: job.id,
    sector: job.title,
    puesto: job.title,
    descripcion: job.description,
    isActive: job.isActive,
    createdAt: job.createdAt
  }));

  const handleCreateVacancy = async (vacancyData: Omit<JobVacancy, 'id' | 'createdAt'>) => {
    try {
      console.log('Creating vacancy:', vacancyData);
      
      // Transform vacancy data to job format
      const jobData = {
        title: vacancyData.puesto,
        description: vacancyData.descripcion,
        business: 'Empresa Principal', // Default business name
        city: 'Jerez de la Frontera', // Default city
        isActive: vacancyData.isActive
      };

      await addJob(jobData);
      
      toast({
        title: "Vacante creada",
        description: "La nueva vacante se ha creado exitosamente.",
      });
      
      setShowForm(false);
      await refreshJobs(); // Refresh the list to show the new vacancy
    } catch (error) {
      console.error('Error creating vacancy:', error);
      toast({
        title: "Error",
        description: "Hubo un error al crear la vacante. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleEditVacancy = async (vacancyData: Omit<JobVacancy, 'id' | 'createdAt'>) => {
    if (!editingVacancy) return;
    
    try {
      console.log('Editing vacancy:', vacancyData);
      
      // This would need to be implemented with the actual job update logic
      // For now, just show a message that it's not implemented
      toast({
        title: "Función no disponible",
        description: "La edición de vacantes será implementada próximamente.",
        variant: "destructive",
      });
      
      setEditingVacancy(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error editing vacancy:', error);
      toast({
        title: "Error",
        description: "Hubo un error al editar la vacante.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta vacante?')) {
      try {
        // This would need to be implemented with the actual job deletion logic
        console.log('Delete vacancy:', id);
        toast({
          title: "Función no disponible",
          description: "La eliminación de vacantes será implementada próximamente.",
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error deleting vacancy:', error);
        toast({
          title: "Error",
          description: "Hubo un error al eliminar la vacante.",
          variant: "destructive",
        });
      }
    }
  };

  const startEdit = (vacancy: JobVacancy) => {
    setEditingVacancy(vacancy);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVacancy(null);
  };

  if (showForm) {
    return (
      <VacancyForm
        vacancy={editingVacancy || undefined}
        onSave={editingVacancy ? handleEditVacancy : handleCreateVacancy}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Vacantes</CardTitle>
            <CardDescription>
              Administra las vacantes disponibles en el portal de empleo
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Nueva Vacante
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No hay vacantes disponibles. Haz clic en "Nueva Vacante" para crear una.
                  </TableCell>
                </TableRow>
              ) : (
                vacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell>
                      <Badge variant="outline">{vacancy.sector}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{vacancy.puesto}</TableCell>
                    <TableCell className="max-w-xs truncate">{vacancy.descripcion}</TableCell>
                    <TableCell>
                      <Badge variant={vacancy.isActive ? "default" : "secondary"}>
                        {vacancy.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell>{vacancy.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(vacancy)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteVacancy(vacancy.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyManagement;
