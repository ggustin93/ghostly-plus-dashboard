import { Patient } from '@/types/patients';
import { Session } from '@/types/sessions';
import { TreatmentPlan } from '@/types/treatments';

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

// Updated mock sessions data with proper statuses based on dates
const sessions: Session[] = [
  {
    id: 'P001-S01',
    patientId: 'P001',
    patientName: getPatientName('P001'), // Eleanor Thompson
    date: '2025-06-17T14:30:00', // Future date
    type: 'Strength', 
    isBFR: false,     
    duration: 25,     
    difficulty: 4,    
    status: 'scheduled', // Correct: future date is scheduled
  },
  {
    id: 'P001-S02',
    patientId: 'P001',
    patientName: getPatientName('P001'), // Eleanor Thompson
    date: '2025-06-10T14:30:00', // Past date
    type: 'Strength', 
    isBFR: false,     
    duration: 25,     
    difficulty: 3,    
    status: 'completed', // Correct: past date is completed
    performance: '85%', 
  },
  {
    id: 'P002-S01',
    patientId: 'P002',
    patientName: getPatientName('P002'), // Robert Chen
    date: '2025-06-05T11:00:00', // Past date
    type: 'Coordination', 
    isBFR: true,      
    duration: 30,     
    difficulty: 4,    
    status: 'completed', // Correct: past date is completed
    performance: '92%', 
  },
  {
    id: 'P003-S01',
    patientId: 'P003',
    patientName: getPatientName('P003'), // Mildred Jackson
    date: '2025-06-18T15:56:00', // Future date
    type: 'Flexibility', 
    isBFR: false,      
    duration: 20,      
    difficulty: 2,     
    status: 'scheduled', // Correct: future date is scheduled
  },
  {
    id: 'P004-S01', 
    patientId: 'P004',
    patientName: getPatientName('P004'), // Thomas Rivera
    date: '2025-06-20T10:00:00', // Future date
    type: 'Mobility', 
    isBFR: false,      
    duration: 30,      
    difficulty: 2,     
    status: 'cancelled', // Although future, this specific one is cancelled
  },
  // Today's sessions
  {
    id: 'P005-S01',
    patientId: 'P005',
    patientName: getPatientName('P005'), // Sarah Wilson
    date: new Date().toISOString(), // Today's date
    type: 'Balance', 
    isBFR: true,      
    duration: 35,      
    difficulty: 3,     
    status: 'scheduled', // Today's session can be scheduled
  },
  {
    id: 'P006-S01',
    patientId: 'P006',
    patientName: getPatientName('P006'), // George Miller
    date: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(), // Earlier today
    type: 'Mobility', 
    isBFR: false,      
    duration: 40,      
    difficulty: 2,     
    status: 'completed', // An earlier session today could be completed
    performance: '78%', 
  },
  // Sessions for May 22, 2025 - These should be completed or cancelled since they're in the past
  {
    id: 'P007-S01',
    patientId: 'P007',
    patientName: getPatientName('P007'), // Brenda Lee
    date: '2025-05-22T09:30:00', // Past date
    type: 'Coordination', 
    isBFR: true,      
    duration: 45,      
    difficulty: 3,     
    status: 'completed', // Correct: past date is completed
    performance: '88%', 
  },
  {
    id: 'P008-S01',
    patientId: 'P008',
    patientName: getPatientName('P008'), // Arthur Lewis
    date: '2025-05-22T11:15:00', // Past date
    type: 'Strength', 
    isBFR: false,      
    duration: 30,      
    difficulty: 1,     
    status: 'cancelled', // Past date can be cancelled (patient didn't show up)
  },
  // Sessions for May 23, 2025 - These should be completed or cancelled since they're in the past
  {
    id: 'P009-S01',
    patientId: 'P009',
    patientName: getPatientName('P009'), // Nancy Young
    date: '2025-05-23T14:00:00', // Past date
    type: 'Balance', 
    isBFR: true,      
    duration: 35,      
    difficulty: 4,     
    status: 'completed', // Correct: past date is completed
    performance: '91%', 
  },
  {
    id: 'P010-S01',
    patientId: 'P010',
    patientName: getPatientName('P010'), // Kenneth Walker
    date: '2025-05-23T16:45:00', // Past date
    type: 'Flexibility', 
    isBFR: false,      
    duration: 25,      
    difficulty: 2,     
    status: 'cancelled', // Past date can be cancelled (patient didn't show up)
  }
];

export const mockData = {
  patients,
  sessions,
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