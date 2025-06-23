
export interface JobPosition {
  id: string;
  title: string;
  area: string;
  business: 'Negocio A' | 'Negocio B' | 'Negocio C';
  city: string;
  description: string;
  requirements?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  relevantExperience: string;
  availability: string;
  additionalComments: string;
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
