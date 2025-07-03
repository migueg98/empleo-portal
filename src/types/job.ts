export interface JobPosition {
  id: string;
  title: string;
  description: string;
  business: string;
  city: string;
  isActive: boolean;
  createdAt: Date;
  sector?: string;
  sectorId?: number;
}

export interface JobVacancy {
  id: string;
  sector: string;
  puesto: string;
  descripcion: string;
  isActive: boolean;
  createdAt: Date;
  sectorId?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  jobSector?: string;
  fullName: string;
  age: number;
  email: string;
  phone: string;
  selectedPositions: string[];
  sectorExperience: 'Sí' | 'No';
  positionExperience: 'Sí' | 'No';
  availability: 'Inmediata' | '< 1 mes' | '1-3 meses' | '> 3 meses';
  relevantExperience: string;
  additionalComments?: string;
  curriculum?: File;
  internalStatus: 'nuevo' | 'no_valido' | 'posible' | 'buen_candidato';
  createdAt: Date;
  updatedAt: Date;
  consentGiven: boolean;
  cvUrl?: string;
}

export interface Candidate {
  id: string;
  email: string;
  fullName: string;
  applications: JobApplication[];
  createdAt: Date;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl?: string;
  imagePlaceholder: string;
}
