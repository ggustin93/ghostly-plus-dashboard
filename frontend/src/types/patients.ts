// Patient interface
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room?: string;
  status: 'active' | 'inactive' | 'discharged';
  studyArm?: 'Intervention' | 'Control' | 'Ghostly' | string;
  admissionDate?: string;
  diagnosis?: string;
  mobility?: string;
  cognitiveStatus?: string;
  lastSession?: string;
  compliance?: string;
  progress?: string;
  avatar?: string;
}