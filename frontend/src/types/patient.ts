export interface ClinicalAssessment {
    id: string;
    type: 'MicroFET' | 'Ultrasound' | 'SitToStand' | 'MMSE' | 'Other';
    value: number;
    date: string;
    notes?: string;
    assessmentPoint: 'T0' | 'T1' | 'T2';
  }
  
  export interface PatientNote {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }
  
export interface Patient {
  // Core fields
  id: string;
  name: string;

  // Demographics
  age: number; // From patients.ts (used in mock data and profile)
  dateOfBirth?: string; // From patient.ts (made optional as age is primary in mock)
  gender: string; // Widened to string to match mock data ("Male", "Female") and patients.ts
  height?: string; // Height in cm (e.g., "165 cm")
  weight?: string; // Weight in kg (e.g., "58 kg")

  // Clinical/Study Info
  room?: string; // From patients.ts
  status: 'active' | 'inactive' | 'discharged'; // From patients.ts (used in mock data & UI)
  admissionDate: string; // Made optional; consistent with patients.ts and UI handling
  dischargeDate?: string; // Made optional; consistent with patients.ts and UI handling
  diagnosis: string; // From patients.ts
  mobility?: string; // From patients.ts
  mmseScore?: number; // From patient.ts (made optional as not in mock)
  bmi?: string; // Body Mass Index (e.g., "21.3")

  // Functional Status
  cognitiveStatus?: string; // From patients.ts

  // Activity/Engagement
  lastSession?: string; // From patients.ts (used in mock data)
  nextSession?: string; // Made optional; consistent with patients.ts and UI handling
  therapistId: string; // Made optional; consistent with patients.ts and UI handling

  // App-specific / Detailed clinical data (from patient.ts, made optional as not in current mock data)
  assignedTherapist?: string;
  assessments?: ClinicalAssessment[];
  notes?: PatientNote[];
  alerts?: string[];
  avatar?: string; // From patients.ts
  adherence?: number; // Example: 95
  progress?: 'Improving' | 'Declining' | 'Steady' | 'Mixed';

  // Add history arrays for the new charts
  adherenceHistory?: { date: string; value: number }[];
  gamePerformanceHistory?: { date: string; value: number }[];
  fatigueHistory?: { date: string; value: number }[];
  rpeHistory?: { date: string; value: number }[];
}