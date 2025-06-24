
import { useState, useEffect } from 'react';
import { JobVacancy } from '@/types/job';
import { mockVacancies } from '@/data/mockJobs';

// Simple in-memory store for vacancies
class VacancyStore {
  private vacancies: JobVacancy[] = [...mockVacancies];
  private listeners: Set<() => void> = new Set();

  getVacancies(): JobVacancy[] {
    return [...this.vacancies];
  }

  addVacancy(vacancy: JobVacancy): void {
    this.vacancies.push(vacancy);
    this.notifyListeners();
  }

  updateVacancy(id: string, updates: Partial<JobVacancy>): void {
    const index = this.vacancies.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vacancies[index] = { ...this.vacancies[index], ...updates };
      this.notifyListeners();
    }
  }

  deleteVacancy(id: string): void {
    this.vacancies = this.vacancies.filter(v => v.id !== id);
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

const vacancyStore = new VacancyStore();

export const useVacancies = () => {
  const [vacancies, setVacancies] = useState<JobVacancy[]>(() => vacancyStore.getVacancies());

  useEffect(() => {
    const unsubscribe = vacancyStore.subscribe(() => {
      setVacancies(vacancyStore.getVacancies());
    });

    return unsubscribe;
  }, []);

  const addVacancy = (vacancyData: Omit<JobVacancy, 'id' | 'createdAt'>) => {
    const newVacancy: JobVacancy = {
      ...vacancyData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    vacancyStore.addVacancy(newVacancy);
  };

  const updateVacancy = (id: string, updates: Partial<JobVacancy>) => {
    vacancyStore.updateVacancy(id, updates);
  };

  const deleteVacancy = (id: string) => {
    vacancyStore.deleteVacancy(id);
  };

  return {
    vacancies,
    addVacancy,
    updateVacancy,
    deleteVacancy,
  };
};
