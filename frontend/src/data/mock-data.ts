import { Patient } from '@/types/patients';
import { Session } from '@/types/sessions';
import { TreatmentPlan } from '@/types/treatments';

// Define C3DFile type
export interface C3DFile {
  id: string;
  fileName: string;
  patientId: string;
  patientName?: string; // Will be populated using getPatientName
  rehabilitationSessionId: string;
  gameSessionId: string;
  uploadDate: string;
  uploadedBy: 'API' | 'Manual';
  uploaderName?: string; // e.g., Therapist name if manual
  status: 'Uploaded' | 'Processing' | 'Processed' | 'Error' | 'Pending Analysis'; // Original detailed status
  analysisStatus?: 'Pending' | 'Completed' | 'Failed';
  overallStatus?: 'Error' | 'Processing' | 'Awaiting Analysis' | 'Analyzed'; // Simplified status for therapist view
  fileSizeKB?: number;
  gameType?: 'Maze Run' | 'Space Game' | 'Target Practice' | 'Other'; // Added based on UX specs (inferred)
  gameLevel?: number; // Added based on UX specs
  gameScore?: number; // Added based on UX specs (e.g., activation points)
}

// Mock patients data
const patients: Patient[] = [
  {
    id: 'P001',
    name: 'Eleanor Thompson',
    age: 78,
    gender: 'Female',
    room: '302',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-05-15',
    diagnosis: 'Postoperative weakness',
    mobility: 'Limited with walker',
    cognitiveStatus: 'Alert and oriented',
    lastSession: '2025-06-15',
    compliance: 'Good',
    progress: 'Improving'
  },
  {
    id: 'P002',
    name: 'Robert Chen',
    age: 82,
    gender: 'Male',
    room: '310',
    status: 'active',
    studyArm: 'Control',
    admissionDate: '2025-05-20',
    diagnosis: 'Deconditioning',
    mobility: 'Wheelchair dependent',
    cognitiveStatus: 'Mild cognitive impairment',
    lastSession: '2025-06-14',
    compliance: 'Excellent',
    progress: 'Steady'
  },
  {
    id: 'P003',
    name: 'Mildred Jackson',
    age: 75,
    gender: 'Female',
    room: '315',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-05-28',
    diagnosis: 'Post-stroke',
    mobility: 'Requires assistance',
    cognitiveStatus: 'Alert and oriented',
    lastSession: '2025-06-13',
    compliance: 'Good',
    progress: 'Improving'
  },
  {
    id: 'P004',
    name: 'Thomas Rivera',
    age: 80,
    gender: 'Male',
    room: '308',
    status: 'inactive',
    studyArm: 'Control',
    admissionDate: '2025-04-10',
    diagnosis: 'Generalized weakness',
    mobility: 'Bed bound',
    cognitiveStatus: 'Periodic confusion',
    lastSession: '2025-05-30',
    compliance: 'Fair',
    progress: 'Slow'
  },
  {
    id: 'P005',
    name: 'Sarah Wilson',
    age: 72,
    gender: 'Female',
    room: '321',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-05',
    diagnosis: 'Post-fall weakness',
    mobility: 'Ambulates with cane',
    cognitiveStatus: 'Alert and oriented',
    lastSession: '2025-06-12',
    compliance: 'Excellent',
    progress: 'Rapid improvement'
  },
  {
    id: 'P006',
    name: 'George Miller',
    age: 79,
    gender: 'Male',
    room: '401',
    status: 'active',
    studyArm: 'Control',
    admissionDate: '2025-06-01',
    diagnosis: 'Sarcopenia',
    mobility: 'Needs assistance for transfers',
    cognitiveStatus: 'Alert',
    lastSession: '2025-06-18',
    compliance: 'Good',
    progress: 'Steady'
  },
  {
    id: 'P007',
    name: 'Brenda Lee',
    age: 85,
    gender: 'Female',
    room: '402',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-03',
    diagnosis: 'Frailty',
    mobility: 'Uses walker, unsteady',
    cognitiveStatus: 'Forgetful',
    lastSession: '2025-06-19',
    compliance: 'Fair',
    progress: 'Slow improvement'
  },
  {
    id: 'P008',
    name: 'Arthur Lewis',
    age: 76,
    gender: 'Male',
    room: '405',
    status: 'inactive',
    studyArm: 'Control',
    admissionDate: '2025-05-10',
    diagnosis: 'COPD Exacerbation',
    mobility: 'Bed rest',
    cognitiveStatus: 'Alert',
    lastSession: '2025-05-25',
    compliance: 'Poor',
    progress: 'Declined'
  },
  {
    id: 'P009',
    name: 'Nancy Young',
    age: 81,
    gender: 'Female',
    room: '408',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-10',
    diagnosis: 'Hip fracture recovery',
    mobility: 'Wheelchair, non-weight bearing',
    cognitiveStatus: 'Alert and motivated',
    lastSession: '2025-06-20',
    compliance: 'Excellent',
    progress: 'Good'
  },
  {
    id: 'P010',
    name: 'Kenneth Walker',
    age: 77,
    gender: 'Male',
    room: '410',
    status: 'active',
    studyArm: 'Control',
    admissionDate: '2025-06-12',
    diagnosis: 'Pneumonia recovery',
    mobility: 'Ambulates short distances with help',
    cognitiveStatus: 'Slightly confused at times',
    lastSession: '2025-06-19',
    compliance: 'Fair',
    progress: 'Steady'
  },
  {
    id: 'P011',
    name: 'Patricia Hall',
    age: 88,
    gender: 'Female',
    room: '412',
    status: 'active',
    studyArm: 'Intervention',
    admissionDate: '2025-06-15',
    diagnosis: 'Generalized deconditioning',
    mobility: 'Requires 2-person assist',
    cognitiveStatus: 'Alert',
    lastSession: '2025-06-21',
    compliance: 'Good',
    progress: 'Improving slowly'
  }
];

// Fonction pour obtenir le nom du patient à partir de son ID
const getPatientName = (patientId: string): string => {
  const patient = patients.find(p => p.id === patientId);
  return patient ? patient.name : 'Unknown Patient';
};

// Updated mock sessions data with dates relative to current time
const sessions: Session[] = [
  {
    id: 'P001-S01',
    patientId: 'P001',
    patientName: getPatientName('P001'),
    date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    type: 'Strength', 
    isBFR: false,     
    duration: 25,     
    difficulty: 4,    
    status: 'scheduled',
  },
  {
    id: 'P001-S02',
    patientId: 'P001',
    patientName: getPatientName('P001'),
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    type: 'Strength', 
    isBFR: false,     
    duration: 25,     
    difficulty: 3,    
    status: 'completed',
    performance: '85%', 
  },
  {
    id: 'P002-S01',
    patientId: 'P002',
    patientName: getPatientName('P002'),
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    type: 'Coordination', 
    isBFR: true,      
    duration: 30,     
    difficulty: 4,    
    status: 'completed',
    performance: '92%', 
  },
  {
    id: 'P003-S01',
    patientId: 'P003',
    patientName: getPatientName('P003'),
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    type: 'Flexibility', 
    isBFR: false,      
    duration: 20,      
    difficulty: 2,     
    status: 'scheduled',
  },
  {
    id: 'P004-S01', 
    patientId: 'P004',
    patientName: getPatientName('P004'), // Thomas Rivera
    date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), // 15 days in future
    type: 'Mobility', 
    isBFR: false,      
    duration: 30,      
    difficulty: 2,     
    status: 'cancelled',
  },
  // Today's sessions
  {
    id: 'P005-S01',
    patientId: 'P005',
    patientName: getPatientName('P005'), // Sarah Wilson
    date: new Date().toISOString(), // Today
    type: 'Balance', 
    isBFR: true,      
    duration: 35,      
    difficulty: 3,     
    status: 'scheduled',
  },
  {
    id: 'P006-S01',
    patientId: 'P006',
    patientName: getPatientName('P006'), // George Miller
    date: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(), // 3 hours ago today
    type: 'Mobility', 
    isBFR: false,      
    duration: 40,      
    difficulty: 2,     
    status: 'completed',
    performance: '78%', 
  },
  // Past sessions
  {
    id: 'P007-S01',
    patientId: 'P007',
    patientName: getPatientName('P007'), // Brenda Lee
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), // 15 days ago
    type: 'Coordination', 
    isBFR: true,      
    duration: 45,      
    difficulty: 3,     
    status: 'completed',
    performance: '88%', 
  },
  {
    id: 'P008-S01',
    patientId: 'P008',
    patientName: getPatientName('P008'), // Arthur Lewis
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), // 15 days ago
    type: 'Strength', 
    isBFR: false,      
    duration: 30,      
    difficulty: 1,     
    status: 'cancelled',
  },
  // More past sessions
  {
    id: 'P009-S01',
    patientId: 'P009',
    patientName: getPatientName('P009'), // Nancy Young
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), // 20 days ago
    type: 'Balance', 
    isBFR: true,      
    duration: 35,      
    difficulty: 4,     
    status: 'completed',
    performance: '91%', 
  },
  {
    id: 'P010-S01',
    patientId: 'P010',
    patientName: getPatientName('P010'), // Kenneth Walker
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), // 20 days ago
    type: 'Flexibility', 
    isBFR: false,      
    duration: 25,      
    difficulty: 2,     
    status: 'cancelled',
  }
];

const mockC3DFilesData: Omit<C3DFile, 'patientName' | 'overallStatus'>[] = [
  {
    id: 'c3d001',
    fileName: 'P001_Session1_G1_20231026.c3d',
    patientId: 'P001',
    rehabilitationSessionId: 'P001-S02', 
    gameSessionId: 'GS001A',
    uploadDate: '2023-10-26T10:00:00Z',
    uploadedBy: 'API',
    status: 'Processed',
    analysisStatus: 'Completed',
    fileSizeKB: 1204,
    gameType: 'Maze Run',
    gameLevel: 3,
    gameScore: 1500,
  },
  {
    id: 'c3d002',
    fileName: 'P002_Session1_G1_20231027.c3d',
    patientId: 'P002',
    rehabilitationSessionId: 'P002-S01',
    gameSessionId: 'GS002B',
    uploadDate: '2023-10-27T11:30:00Z',
    uploadedBy: 'API',
    status: 'Pending Analysis',
    analysisStatus: 'Pending',
    fileSizeKB: 987,
    gameType: 'Space Game',
    gameLevel: 2,
    gameScore: 950,
  },
  {
    id: 'c3d003',
    fileName: 'P001_Session2_G1_20231028.c3d',
    patientId: 'P001',
    rehabilitationSessionId: 'P001-S01', 
    gameSessionId: 'GS003A',
    uploadDate: '2023-10-28T09:15:00Z',
    uploadedBy: 'Manual',
    uploaderName: 'Dr. Carter',
    status: 'Uploaded',
    analysisStatus: 'Pending',
    fileSizeKB: 1050,
    gameType: 'Maze Run',
    gameLevel: 4,
    gameScore: 1800,
  },
  {
    id: 'c3d004',
    fileName: 'P003_Session1_G1_20231029.c3d',
    patientId: 'P003',
    rehabilitationSessionId: 'P003-S01',
    gameSessionId: 'GS004C',
    uploadDate: '2023-10-29T14:00:00Z',
    uploadedBy: 'API',
    status: 'Error', 
    analysisStatus: undefined,
    fileSizeKB: 1120,
    gameType: 'Target Practice',
    gameLevel: 1,
    gameScore: 0, // Error, so no score
  },
  {
    id: 'c3d005',
    fileName: 'P002_Session2_G1_20231030.c3d',
    patientId: 'P002',
    rehabilitationSessionId: 'P002-S01', 
    gameSessionId: 'GS005D',
    uploadDate: '2023-10-30T16:00:00Z',
    uploadedBy: 'API',
    status: 'Processing',
    analysisStatus: 'Pending',
    fileSizeKB: 1300,
    gameType: 'Space Game',
    gameLevel: 3,
    gameScore: 1200,
  },
  {
    id: 'c3d006',
    fileName: 'P001_Session3_G1_20231031.c3d',
    patientId: 'P001',
    rehabilitationSessionId: 'P001-S01',
    gameSessionId: 'GS006E',
    uploadDate: '2023-10-31T08:00:00Z',
    uploadedBy: 'API',
    status: 'Processed',
    analysisStatus: 'Failed',
    fileSizeKB: 1150,
    gameType: 'Maze Run',
    gameLevel: 5,
    gameScore: 200, // Analysis failed, low score might reflect issue
  },
];

// Function to derive overallStatus
const deriveOverallStatus = (file: Omit<C3DFile, 'patientName' | 'overallStatus'>): C3DFile['overallStatus'] => {
  if (file.status === 'Error' || file.analysisStatus === 'Failed') return 'Error';
  if (file.status === 'Processing') return 'Processing';
  if (file.status === 'Processed' && file.analysisStatus === 'Completed') return 'Analyzed';
  return 'Awaiting Analysis'; // Covers Uploaded, Pending Analysis, Processed (but analysis not yet completed)
};

// Populate patientName and overallStatus for mockC3DFiles
const c3dFiles: C3DFile[] = mockC3DFilesData.map(file => ({
  ...file,
  patientName: getPatientName(file.patientId),
  overallStatus: deriveOverallStatus(file),
}));

export const mockData = {
  patients,
  sessions,
  c3dFiles,
  treatments: [
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
      notes: 'Starting plan for John Doe.',
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
      notes: 'Jane Smith - balloon game, with BFR.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ] as TreatmentPlan[],
};