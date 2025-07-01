
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { JobVacancy } from '@/types/job';
import VacancyForm from './VacancyForm';
import VacancyEditDialog from './VacancyEditDialog';
import VacancyDeleteDialog from './VacancyDeleteDialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';

const VacancyManagement = () => {
  const { jobs, sectors, addJob, updateJob, deleteJob, refreshJobs } = useJobs();
  const [showForm, setShowForm] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<JobVacancy | null>(null);
  const [deletingVacancy, setDeletingVacancy] = useState<JobVacancy | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  // Convert jobs to vacancy format
  const vacancies: JobVacancy[] = jobs.map(job => ({
    id: job.id,
    sector: job.sector || 'Sin sector',
    puesto: job.title,
    descripcion: job.description,
    isActive: job.isActive,
    createdAt: job.createdAt,
    sectorId: job.sectorId
  }));

  const handleCreateVacancy = async (vacancyData: Omit<JobVacancy, 'id' | 'createdAt'>) => {
    try {
      console.log('Creating vacancy:', vacancyData);
      
      const jobData = {
        title: vacancyData.puesto,
        description: vacancyData.descripcion,
        business: 'Empresa Principal',
        city: 'Jerez de la Frontera',
        isActive: vacancyData.isActive,
        sector: vacancyData.sector,
        sectorId: vacancyData.sectorId
      };

      await addJob(jobData);
      
      toast({
        title: "Vacante creada",
        description: "La nueva vacante se ha creado exitosamente.",
      });
      
      setShowForm(false);
      await refreshJobs();
    } catch (error) {
      console.error('Error creating vacancy:', error);
      toast({
        title: "Error",
        description: "Hubo un error al crear la vacante. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleEditVacancy = async (id: string, data: { title: string; description: string; sectorId: number }) => {
    try {
      console.log('Updating vacancy:', id, data);
      
      await updateJob(id, {
        title: data.title,
        description: data.description,
        sectorId: data.sectorId
      });
      
      toast({
        title: "Vacante actualizada",
        description: "Los cambios se han guardado exitosamente.",
      });
      
      await refreshJobs();
    } catch (error) {
      console.error('Error updating vacancy:', error);
      toast({
        title: "Error",
        description: "Hubo un error al actualizar la vacante. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    try {
      await deleteJob(id);
      
      toast({
        title: "Vacante eliminada",
        description: "La vacante se ha eliminado exitosamente.",
      });
      
      await refreshJobs();
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la vacante. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const startEdit = (vacancy: JobVacancy) => {
    setEditingVacancy(vacancy);
    setShowEditDialog(true);
  };

  const startDelete = (vacancy: JobVacancy) => {
    setDeletingVacancy(vacancy);
    setShowDeleteDialog(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVacancy(null);
  };

  if (showForm) {
    return (
      <VacancyForm
        onSave={handleCreateVacancy}
        onCancel={handleCancel}
        sectors={sectors}
      />
    );
  }

  return (
    <>
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
                            title="Editar vacante"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startDelete(vacancy)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Eliminar vacante"
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

      <VacancyEditDialog
        vacancy={editingVacancy}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleEditVacancy}
        sectors={sectors}
      />

      <VacancyDeleteDialog
        vacancy={deletingVacancy}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteVacancy}
      />
    </>
  );
};

export default VacancyManagement;
