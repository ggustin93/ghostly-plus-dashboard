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

  // Clinical/Study Info
  room?: string; // From patients.ts
  status: 'active' | 'inactive' | 'discharged'; // From patients.ts (used in mock data & UI)
  studyArm?: 'Intervention' | 'Control' | 'Ghostly' | string; // From patients.ts (used in mock data & UI)
  admissionDate?: string; // Made optional; consistent with patients.ts and UI handling
  diagnosis?: string; // From patients.ts
  medicalHistory?: string; // From patient.ts (made optional as not in mock)
  mmseScore?: number; // From patient.ts (made optional as not in mock)

  // Functional Status
  mobility?: string; // From patients.ts
  cognitiveStatus?: string; // From patients.ts

  // Activity/Engagement
  lastSession?: string; // From patients.ts (used in mock data)
  compliance?: string; // From patients.ts
  progress?: string; // From patients.ts

  // App-specific / Detailed clinical data (from patient.ts, made optional as not in current mock data)
  assignedTherapist?: string;
  assessments?: ClinicalAssessment[];
  notes?: PatientNote[];
  alerts?: string[];
  avatar?: string; // From patients.ts
}