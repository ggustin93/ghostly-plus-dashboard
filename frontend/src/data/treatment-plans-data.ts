import { TreatmentPlan } from '@/types/treatments';

export const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: 'T001',
    patientId: 'P001',
    name: 'Initial Strength Program',
    gameType: 'maze',
    difficulty: 3,
    duration: 20,
    restInterval: 30,
    maxIntensity: 70,
    useBloodFlowRestriction: false,
    muscleTargets: ['biceps', 'deltoid'],
    notes: 'Starting plan for Eleanor Thompson.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'T002',
    patientId: 'P002',
    name: 'Coordination Focus',
    gameType: 'space',
    difficulty: 4,
    duration: 25,
    restInterval: 45,
    maxIntensity: 60,
    useBloodFlowRestriction: true,
    bfrPressure: 110,
    muscleTargets: ['forearm'],
    notes: 'Robert Chen - balloon game, with BFR.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  // Add more mock treatment plans as needed
]; 