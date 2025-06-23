
import { JobPosition } from '@/types/job';

export const mockJobs: JobPosition[] = [
  {
    id: '1',
    title: 'Desarrollador Frontend Senior',
    area: 'Tecnología',
    business: 'Negocio A',
    city: 'Madrid',
    description: 'Buscamos un desarrollador frontend con experiencia en React y TypeScript para liderar proyectos innovadores.',
    requirements: 'Experiencia mínima de 5 años en desarrollo frontend, conocimiento avanzado de React, TypeScript, y metodologías ágiles.',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Especialista en Marketing Digital',
    area: 'Marketing',
    business: 'Negocio B',
    city: 'Barcelona',
    description: 'Profesional creativo para gestionar campañas digitales y estrategias de marketing online.',
    requirements: 'Titulación en Marketing o similar, experiencia en Google Ads, Facebook Ads, y analítica digital.',
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'Analista de Datos',
    area: 'Análisis',
    business: 'Negocio C',
    city: 'Valencia',
    description: 'Analista para trabajar con grandes volúmenes de datos y generar insights estratégicos.',
    requirements: 'Conocimientos en SQL, Python, Power BI y estadística aplicada.',
    isActive: true,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '4',
    title: 'Gerente de Ventas',
    area: 'Ventas',
    business: 'Negocio A',
    city: 'Sevilla',
    description: 'Liderazgo del equipo comercial y desarrollo de estrategias de ventas B2B.',
    requirements: 'Experiencia mínima de 7 años en ventas B2B, habilidades de liderazgo y gestión de equipos.',
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '5',
    title: 'Diseñador UX/UI',
    area: 'Diseño',
    business: 'Negocio B',
    city: 'Bilbao',
    description: 'Diseñador para crear experiencias de usuario excepcionales en productos digitales.',
    requirements: 'Portfolio sólido, experiencia con Figma, conocimientos de investigación UX y diseño de sistemas.',
    isActive: true,
    createdAt: new Date('2024-02-05')
  },
  {
    id: '6',
    title: 'Consultor de Procesos',
    area: 'Consultoría',
    business: 'Negocio C',
    city: 'Zaragoza',
    description: 'Optimización de procesos empresariales y implementación de mejoras operativas.',
    requirements: 'Formación en ingeniería o administración, certificaciones Lean Six Sigma preferibles.',
    isActive: true,
    createdAt: new Date('2024-02-10')
  }
];
