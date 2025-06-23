
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { mockJobs } from '@/data/mockJobs';
import { JobPosition } from '@/types/job';
import { MapPin, Building, ArrowLeft } from 'lucide-react';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    relevantExperience: '',
    availability: '',
    additionalComments: '',
    consentGiven: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const foundJob = mockJobs.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
    } else {
      navigate('/empleos');
    }
  }, [jobId, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor, introduce un email válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.relevantExperience.trim()) {
      newErrors.relevantExperience = 'La experiencia relevante es obligatoria';
    } else if (formData.relevantExperience.length > 300) {
      newErrors.relevantExperience = 'La experiencia relevante no puede exceder los 300 caracteres';
    }

    if (!formData.availability.trim()) {
      newErrors.availability = 'La disponibilidad es obligatoria';
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
        description: "Te hemos enviado un email de confirmación. Pronto recibirás un magic-link para gestionar tu postulación.",
        duration: 6000,
      });

      // Simular creación de cuenta silenciosa y envío de magic-link
      console.log('Creando cuenta silenciosa para:', formData.email);
      console.log('Enviando magic-link a:', formData.email);
      console.log('Enviando notificación a RRHH');

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!job) {
    return <div>Cargando...</div>;
  }

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
                  <CardTitle className="text-primary">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building size={14} />
                      <span>{job.area}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{job.city}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {job.business}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {job.description}
                  </CardDescription>
                  {job.requirements && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Requisitos:</h4>
                      <p className="text-sm text-gray-600">{job.requirements}</p>
                    </div>
                  )}
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
                    {/* Datos Obligatorios */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-primary">Datos Personales</h3>
                      
                      <div>
                        <Label htmlFor="fullName">Nombre Completo *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className={errors.fullName ? 'border-red-500' : ''}
                          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                        />
                        {errors.fullName && (
                          <p id="fullName-error" className="text-red-500 text-sm mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-red-500' : ''}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                          <p id="email-error" className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </p>
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
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                        {errors.phone && (
                          <p id="phone-error" className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preguntas Breves */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-primary">Información Adicional</h3>
                      
                      <div>
                        <Label htmlFor="experience">
                          Experiencia Relevante * 
                          <span className="text-sm text-gray-500 ml-1">
                            ({formData.relevantExperience.length}/300 caracteres)
                          </span>
                        </Label>
                        <Textarea
                          id="experience"
                          placeholder="Describe brevemente tu experiencia relevante para este puesto..."
                          value={formData.relevantExperience}
                          onChange={(e) => handleInputChange('relevantExperience', e.target.value)}
                          maxLength={300}
                          className={errors.relevantExperience ? 'border-red-500' : ''}
                          aria-describedby={errors.relevantExperience ? 'experience-error' : undefined}
                        />
                        {errors.relevantExperience && (
                          <p id="experience-error" className="text-red-500 text-sm mt-1">
                            {errors.relevantExperience}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="availability">Disponibilidad *</Label>
                        <Input
                          id="availability"
                          placeholder="Ej: Inmediata, A partir del 15 de marzo, etc."
                          value={formData.availability}
                          onChange={(e) => handleInputChange('availability', e.target.value)}
                          className={errors.availability ? 'border-red-500' : ''}
                          aria-describedby={errors.availability ? 'availability-error' : undefined}
                        />
                        {errors.availability && (
                          <p id="availability-error" className="text-red-500 text-sm mt-1">
                            {errors.availability}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="comments">Comentarios Adicionales</Label>
                        <Textarea
                          id="comments"
                          placeholder="¿Hay algo más que te gustaría que sepamos?"
                          value={formData.additionalComments}
                          onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* RGPD Consent */}
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-medium text-primary">Protección de Datos</h3>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="consent"
                          checked={formData.consentGiven}
                          onCheckedChange={(checked) => 
                            handleInputChange('consentGiven', checked as boolean ? 'true' : 'false')
                          }
                          className={errors.consentGiven ? 'border-red-500' : ''}
                          aria-describedby={errors.consentGiven ? 'consent-error' : undefined}
                        />
                        <Label htmlFor="consent" className="text-sm leading-5">
                          Acepto que mis datos personales sean tratados por [NOMBRE DE EMPRESA] 
                          para gestionar mi postulación y comunicarme el estado del proceso de selección. 
                          Mis datos serán conservados durante el tiempo necesario para estos fines 
                          y tengo derecho a acceder, rectificar, suprimir y portar mis datos. *
                        </Label>
                      </div>
                      {errors.consentGiven && (
                        <p id="consent-error" className="text-red-500 text-sm">
                          {errors.consentGiven}
                        </p>
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
