
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useCandidates } from '@/hooks/useCandidates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const { jobs } = useJobs();
  const { addCandidate } = useCandidates();

  const selectedJob = jobs.find(job => job.id === jobId);

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

  const uploadCV = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('cvs')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading CV:', error);
      return null;
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!jobId) {
      toast.error('No se pudo identificar el puesto de trabajo');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let cvUrl: string | undefined;

      // Upload CV if provided
      if (values.curriculum) {
        cvUrl = await uploadCV(values.curriculum) || undefined;
      }

      // Add candidate to Supabase
      const result = await addCandidate({
        jobId,
        fullName: values.fullName,
        age: values.age,
        email: values.email,
        phone: values.phone,
        selectedPositions: values.selectedPositions || [],
        sectorExperience: values.sectorExperience,
        positionExperience: values.positionExperience,
        availability: values.availability,
        relevantExperience: '',
        additionalComments: values.additionalComments,
        internalStatus: 'nuevo',
        consentGiven: values.consentGiven,
        cvUrl
      });

      if (result.success) {
        toast.success('¡Solicitud enviada con éxito!');
        navigate('/empleos');
      } else {
        toast.error(result.error || 'Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Solicitud de Empleo</h1>
            <p className="text-gray-600">
              {selectedJob ? `Postulándote para: ${selectedJob.title}` : 'Completa el formulario para postularte'}
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
