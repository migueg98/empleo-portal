import { JobPosition, Business, JobVacancy } from '@/types/job';
import banderillas from '@/assets/Banderillas.jpg';
import tabernajerez from '@/assets/Tabernajerez.jpg';
import sanpablo from '@/assets/SanPablo.jpg';
import mareal from '@/assets/Mareal.jpg';
import licojerez from '@/assets/Licojerez.jpg';

export const businesses: Business[] = [
  {
    id: '1',
    name: 'Tabanco Las Banderillas',
    address: 'Calle Caballeros, 12, Jerez de la Frontera',
    description: 'Tabanco tradicional en el corazón del casco histórico, especializado en vinos de Jerez y tapas auténticas.',
    imageUrl: banderillas,
    imagePlaceholder: 'Sube imagen'
  },
  {
    id: '2',
    name: 'Taberna Jerez',
    address: 'Plaza del Arenal, 6, Jerez de la Frontera',
    description: 'Taberna con más de un siglo de historia, referente en la cultura del vino y la gastronomía jerezana.',
    imageUrl: tabernajerez,
    imagePlaceholder: 'Sube imagen'
  },
  {
    id: '3',
    name: 'Tabanco San Pablo',
    address: 'Calle San Pablo, 12, Jerez de la Frontera',
    description: 'Espacio tradicional donde se respira la esencia del flamenco y los vinos generosos.',
    imageUrl: sanpablo,
    imagePlaceholder: 'Sube imagen'
  },
  {
    id: '4',
    name: 'Restaurante Mareal',
    address: 'Plaza del Arenal, 2, Jerez de la Frontera',
    description: 'Restaurante de alta cocina marinera con productos frescos del golfo de Cádiz.',
    imageUrl: mareal,
    imagePlaceholder: 'Sube imagen'
  },
  {
    id: '5',
    name: 'Licojerez',
    address: 'Calle Cordoba, 22, Jerez de la Frontera',
    description: 'Distribuidora especializada en vinos de Jerez, licores y bebidas premium para hostelería.',
    imageUrl: licojerez,
    imagePlaceholder: 'Sube imagen'
  }
];

export const mockJobs: JobPosition[] = [
  {
    id: '1',
    title: 'Camarero/a de Sala',
    description: 'Atención al cliente en tabanco tradicional. Conocimiento de vinos de Jerez valorado.',
    business: 'Tabanco Las Banderillas',
    city: 'Jerez de la Frontera',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Cocinero/a',
    description: 'Preparación de tapas tradicionales y platos de la casa. Experiencia en cocina andaluza.',
    business: 'Taberna Jerez',
    city: 'Jerez de la Frontera',
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Ayudante de Cocina',
    description: 'Apoyo en cocina, preparación de ingredientes y mantenimiento del área de trabajo.',
    business: 'Tabanco San Pablo',
    city: 'Jerez de la Frontera',
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    title: 'Barman/Barmaid',
    description: 'Preparación de cócteles y bebidas. Conocimiento en vinos y licores de la zona.',
    business: 'Restaurante Mareal',
    city: 'Jerez de la Frontera',
    isActive: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    title: 'Administrativo/a',
    description: 'Gestión administrativa, facturación y atención telefónica. Conocimientos de informática.',
    business: 'Licojerez',
    city: 'Jerez de la Frontera',
    isActive: true,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '6',
    title: 'Repartidor/a',
    description: 'Distribución de productos a clientes. Carnet de conducir y vehículo propio necesarios.',
    business: 'Licojerez',
    city: 'Jerez de la Frontera',
    isActive: true,
    createdAt: new Date('2024-01-08')
  }
];

export const mockVacancies: JobVacancy[] = [
  {
    id: '1',
    sector: 'Hostelería',
    puesto: 'Camarero/a de Sala',
    descripcion: 'Atención al cliente en tabanco tradicional. Conocimiento de vinos de Jerez valorado.',
    isActive: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    sector: 'Cocina',
    puesto: 'Cocinero/a',
    descripcion: 'Preparación de tapas tradicionales y platos de la casa. Experiencia en cocina andaluza.',
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    sector: 'Cocina',
    puesto: 'Ayudante de Cocina',
    descripcion: 'Apoyo en cocina, preparación de ingredientes y mantenimiento del área de trabajo.',
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '4',
    sector: 'Bar',
    puesto: 'Barman/Barmaid',
    descripcion: 'Preparación de cócteles y bebidas. Conocimiento en vinos y licores de la zona.',
    isActive: true,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    sector: 'Administración',
    puesto: 'Administrativo/a',
    descripcion: 'Gestión administrativa, facturación y atención telefónica. Conocimientos de informática.',
    isActive: true,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '6',
    sector: 'Logística',
    puesto: 'Repartidor/a',
    descripcion: 'Distribución de productos a clientes. Carnet de conducir y vehículo propio necesarios.',
    isActive: true,
    createdAt: new Date('2024-01-08')
  }
];
