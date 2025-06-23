
export interface JobPosition {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  age: number;
  email: string;
  phone: string;
  selectedPositions: string[];
  sectorExperience: 'Sí' | 'No';
  positionExperience: 'Sí' | 'No';
  availability: 'Inmediata' | '< 1 mes' | '1-3 meses' | '> 3 meses';
  curriculum?: File;
  status: 'received' | 'reviewing' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  consentGiven: boolean;
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
}
