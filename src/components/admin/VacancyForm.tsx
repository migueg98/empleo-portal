
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JobVacancy } from '@/types/job';

interface VacancyFormProps {
  vacancy?: JobVacancy;
  onSave: (vacancy: Omit<JobVacancy, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const VacancyForm = ({ vacancy, onSave, onCancel }: VacancyFormProps) => {
  const [formData, setFormData] = useState({
    sector: vacancy?.sector || '',
    puesto: vacancy?.puesto || '',
    descripcion: vacancy?.descripcion || '',
    isActive: vacancy?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              required
            />
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
