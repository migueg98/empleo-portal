
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JobVacancy } from '@/types/job';
import { Loader2 } from 'lucide-react';

interface VacancyEditDialogProps {
  vacancy: JobVacancy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, data: { title: string; description: string; sectorId: number }) => Promise<void>;
  sectors: {id: number, name: string}[];
}

const VacancyEditDialog = ({ vacancy, open, onOpenChange, onSave, sectors }: VacancyEditDialogProps) => {
  const [formData, setFormData] = useState({
    sectorId: 0,
    puesto: '',
    descripcion: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when vacancy changes
  useEffect(() => {
    if (vacancy && open) {
      setFormData({
        sectorId: vacancy.sectorId || 0,
        puesto: vacancy.puesto,
        descripcion: vacancy.descripcion
      });
    }
  }, [vacancy, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vacancy) return;
    
    // Validate inputs
    if (!formData.sectorId || !formData.puesto.trim() || !formData.descripcion.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSave(vacancy.id, {
        title: formData.puesto,
        description: formData.descripcion,
        sectorId: formData.sectorId
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving vacancy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (vacancy) {
      setFormData({
        sectorId: vacancy.sectorId || 0,
        puesto: vacancy.puesto,
        descripcion: vacancy.descripcion
      });
    }
    onOpenChange(false);
  };

  const selectedSector = sectors.find(s => s.id === formData.sectorId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Vacante</DialogTitle>
          <DialogDescription>
            Modifica los datos de la vacante. Todos los campos son obligatorios.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Select 
              value={formData.sectorId.toString()} 
              onValueChange={(value) => setFormData({ ...formData, sectorId: parseInt(value) })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id.toString()}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="puesto">Puesto</Label>
            <Input
              id="puesto"
              value={formData.puesto}
              onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
              placeholder="Ej: Camarero/a"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe las responsabilidades del puesto..."
              rows={4}
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.sectorId || !formData.puesto.trim() || !formData.descripcion.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyEditDialog;
