
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobVacancy } from '@/types/job';

interface VacancyFormProps {
  vacancy?: JobVacancy;
  onSave: (vacancy: Omit<JobVacancy, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  sectors: { id: number; name: string; }[];
}

const VacancyForm = ({ vacancy, onSave, onCancel, sectors }: VacancyFormProps) => {
  const [formData, setFormData] = useState({
    sector: vacancy?.sector || '',
    sectorId: vacancy?.sectorId || (sectors.length > 0 ? sectors[0].id : undefined),
    puesto: vacancy?.puesto || '',
    descripcion: vacancy?.descripcion || '',
    isActive: vacancy?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the sector name based on selected sectorId
    const selectedSector = sectors.find(s => s.id === formData.sectorId);
    
    onSave({
      ...formData,
      sector: selectedSector?.name || formData.sector,
      sectorId: formData.sectorId
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{vacancy ? 'Editar Vacante' : 'Nueva Vacante'}</CardTitle>
        <CardDescription>
          {vacancy ? 'Modifica los datos de la vacante' : 'Completa los datos para crear una nueva vacante'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Select 
              value={formData.sectorId?.toString()} 
              onValueChange={(value) => setFormData({ ...formData, sectorId: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-md z-50">
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
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Vacante activa</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {vacancy ? 'Actualizar' : 'Crear'} Vacante
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VacancyForm;
