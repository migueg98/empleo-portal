import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { mockJobs, mockVacancies } from '@/data/mockJobs';
import { JobPosition, JobVacancy } from '@/types/job';
import { ArrowLeft, Upload } from 'lucide-react';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosition | null>(null);
  const [vacancy, setVacancy] = useState<JobVacancy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    phone: '',
    selectedPositions: [jobId || ''],
    sectorExperience: '',
    positionExperience: '',
    availability: '',
    curriculum: null as File | null,
    consentGiven: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availabilityOptions = [
    'Inmediata',
    '< 1 mes',
    '1-3 meses',
    '> 3 meses'
  ];

  useEffect(() => {
    // First try to find a job position
    const foundJob = mockJobs.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      setVacancy(null);
    } else {
      // If not found, try to find a vacancy
      const foundVacancy = mockVacancies.find(v => v.id === jobId);
      if (foundVacancy) {
        setVacancy(foundVacancy);
        setJob(null);
      } else {
        navigate('/empleos');
      }
    }
  }, [jobId, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'La edad es obligatoria';
    } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 65) {
      newErrors.age = 'La edad debe estar entre 16 y 65 años';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor, introduce un email válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.sectorExperience) {
      newErrors.sectorExperience = 'Debes indicar tu experiencia en el sector';
    }

    if (!formData.positionExperience) {
      newErrors.positionExperience = 'Debes indicar tu experiencia en el puesto';
    }

    if (!formData.availability) {
      newErrors.availability = 'La disponibilidad es obligatoria';
    }

    if (!formData.curriculum) {
      newErrors.curriculum = 'Debes adjuntar tu currículum';
    }

    if (!formData.consentGiven) {
      newErrors.consentGiven = 'Debes aceptar el tratamiento de datos personales';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío de formulario
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "¡Postulación enviada correctamente!",
        description: "Te hemos enviado un email de confirmación con un enlace para gestionar tus candidaturas.",
        duration: 6000,
      });

      console.log('Creando cuenta passwordless para:', formData.email);
      console.log('Enviando magic-link a:', formData.email);
      console.log('Enviando notificación a RR.HH.');

      navigate('/empleos');
      
    } catch (error) {
      toast({
        title: "Error al enviar la postulación",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, curriculum: 'Solo se permiten archivos PDF o DOCX' }));
        return;
      }
      
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, curriculum: 'El archivo no puede superar los 5MB' }));
        return;
      }
      
      handleInputChange('curriculum', file);
    }
  };

  if (!job && !vacancy) {
    return <div>Cargando...</div>;
  }

  const currentPosition = job || vacancy;
  const positionTitle = job ? job.title : vacancy?.puesto || '';
  const positionDescription = job ? job.description : vacancy?.descripcion || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/empleos')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver a empleos
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-primary">{positionTitle}</CardTitle>
                  {vacancy && (
                    <div className="text-sm text-gray-600 font-medium">
                      {vacancy.sector}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {positionDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Formulario de Postulación</CardTitle>
                  <CardDescription>
                    Completa todos los campos obligatorios para postularte a esta posición.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Datos Personales */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-primary">Datos Personales</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Nombre Completo *</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className={errors.fullName ? 'border-red-500' : ''}
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="age">Edad *</Label>
                          <Input
                            id="age"
                            type="number"
                            min="16"
                            max="65"
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            className={errors.age ? 'border-red-500' : ''}
                          />
                          {errors.age && (
                            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Experiencia */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-primary">Experiencia</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sectorExperience">¿Tienes experiencia en el sector hostelero? *</Label>
                          <Select value={formData.sectorExperience} onValueChange={(value) => handleInputChange('sectorExperience', value)}>
                            <SelectTrigger className={errors.sectorExperience ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                              <SelectItem value="Sí">Sí</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.sectorExperience && (
                            <p className="text-red-500 text-sm mt-1">{errors.sectorExperience}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="positionExperience">¿Tienes experiencia en este puesto? *</Label>
                          <Select value={formData.positionExperience} onValueChange={(value) => handleInputChange('positionExperience', value)}>
                            <SelectTrigger className={errors.positionExperience ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-md">
                              <SelectItem value="Sí">Sí</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.positionExperience && (
                            <p className="text-red-500 text-sm mt-1">{errors.positionExperience}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="availability">Disponibilidad *</Label>
                        <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                          <SelectTrigger className={errors.availability ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Selecciona tu disponibilidad" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-md">
                            {availabilityOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.availability && (
                          <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
                        )}
                      </div>
                    </div>

                    {/* Currículum */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-primary">Documentación</h3>
                      
                      <div>
                        <Label htmlFor="curriculum">Adjuntar Currículum * (PDF/DOCX máx. 5 MB)</Label>
                        <div className="mt-2">
                          <label htmlFor="curriculum" className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${errors.curriculum ? 'border-red-500' : 'border-gray-300'}`}>
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">
                                {formData.curriculum ? formData.curriculum.name : 'Haz clic para seleccionar tu CV'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Recomendamos incluir foto en tu CV
                              </p>
                            </div>
                          </label>
                          <input
                            id="curriculum"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                        {errors.curriculum && (
                          <p className="text-red-500 text-sm mt-1">{errors.curriculum}</p>
                        )}
                      </div>
                    </div>

                    {/* RGPD */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-medium text-primary">Protección de Datos</h3>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="consent"
                          checked={formData.consentGiven}
                          onCheckedChange={(checked) => 
                            handleInputChange('consentGiven', checked as boolean)
                          }
                          className={errors.consentGiven ? 'border-red-500' : ''}
                        />
                        <Label htmlFor="consent" className="text-sm leading-5">
                          Acepto que mis datos personales sean tratados por el grupo hostelero 
                          para gestionar mi postulación y comunicarme el estado del proceso de selección. 
                          Mis datos serán conservados durante el tiempo necesario para estos fines 
                          y tengo derecho a acceder, rectificar, suprimir y portar mis datos. *
                        </Label>
                      </div>
                      {errors.consentGiven && (
                        <p className="text-red-500 text-sm">{errors.consentGiven}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Postulación'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobApplication;
