
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { JobPosition, JobVacancy } from '@/types/job';
import { mockJobs } from '@/data/mockJobs';
import { useVacancies } from '@/hooks/useVacancies';
import { useParams, useNavigate } from 'react-router-dom';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  age: z.number().min(18, {
    message: 'Debes ser mayor de 18 años.',
  }),
  email: z.string().email({
    message: 'Por favor, introduce un email válido.',
  }),
  phone: z.string().min(9, {
    message: 'Por favor, introduce un número de teléfono válido.',
  }),
  selectedPositions: z.array(z.string()).optional(),
  sectorExperience: z.enum(['Sí', 'No']),
  positionExperience: z.enum(['Sí', 'No']),
  availability: z.enum(['Inmediata', '< 1 mes', '1-3 meses', '> 3 meses']),
  additionalComments: z.string().optional(),
  curriculum: z.any().optional(),
  consentGiven: z.boolean().refine((value) => value === true, {
    message: 'Debes aceptar el tratamiento de tus datos personales.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const JobApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { vacancies } = useVacancies();

  const selectedJob: JobPosition | JobVacancy | undefined = mockJobs.find(job => job.id === jobId) || vacancies.find(vacancy => vacancy.id === jobId);

  // Helper function to get the job title regardless of type
  const getJobTitle = (job: JobPosition | JobVacancy) => {
    if ('title' in job) {
      return job.title; // JobPosition
    } else {
      return job.puesto; // JobVacancy
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      age: 18,
      email: '',
      phone: '',
      sectorExperience: 'No',
      positionExperience: 'No',
      availability: 'Inmediata',
      additionalComments: '',
      consentGiven: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Form values submitted:', values);
    alert('¡Formulario enviado con éxito!');
    navigate('/mis-candidaturas');

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Solicitud de Empleo</h1>
            <p className="text-gray-600">
              {selectedJob ? `Postulándote para: ${getJobTitle(selectedJob)}` : 'Completa el formulario para postularte'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edad *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Tu edad" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input placeholder="+34 123 456 789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Experience Section */}
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Experiencia</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="sectorExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Tienes experiencia en el sector? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sí">Sí</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="positionExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>¿Tienes experiencia en este puesto específico? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sí">Sí</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Availability Section */}
                  <Separator />
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilidad para incorporarte *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu disponibilidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Inmediata">Inmediata</SelectItem>
                            <SelectItem value="< 1 mes">Menos de 1 mes</SelectItem>
                            <SelectItem value="1-3 meses">1-3 meses</SelectItem>
                            <SelectItem value="> 3 meses">Más de 3 meses</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CV Upload Section */}
                  <Separator />
                  <FormField
                    control={form.control}
                    name="curriculum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adjuntar CV</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                          />
                        </FormControl>
                        <FormDescription>
                          Formato: PDF, DOC o DOCX (máximo 5MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Comments */}
                  <FormField
                    control={form.control}
                    name="additionalComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentarios adicionales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cualquier información adicional que quieras compartir..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Consent */}
                  <FormField
                    control={form.control}
                    name="consentGiven"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Acepto el tratamiento de mis datos personales *
                          </FormLabel>
                          <FormDescription>
                            Consiento el tratamiento de mis datos personales para procesos de selección.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobApplication;
