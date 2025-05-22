import { SessionListItem } from '@/types/session';
// Removed Patient import, will come from patients-data
// Removed TreatmentPlan import, will come from treatment-plans-data

import { mockPatients } from './patients-data';
import { mockSessions as mockRehabilitationSessions } from './sessions-data'; // Renaming to avoid conflict
import { c3dFiles as mockC3DFiles } from './c3d-files-data'; // Renaming for clarity
import { mockTreatmentPlans } from './treatment-plans-data';

// C3DFile interface is now in c3d-files-data.ts, no longer needed here

// getPatientName now uses imported mockPatients
const getPatientName = (patientId: string): string => {
  const patient = mockPatients.find(p => p.id === patientId);
  return patient ? patient.name : 'Unknown Patient';
};

// The existing 'sessions' array is for SessionListItem, renaming for clarity
const mockSessionListItems: SessionListItem[] = [
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
    patientName: getPatientName('P004'),
    date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    type: 'Mobility', 
    isBFR: false,      
    duration: 30,      
    difficulty: 2,     
    status: 'cancelled',
  },
  {
    id: 'P005-S01',
    patientId: 'P005',
    patientName: getPatientName('P005'),
    date: new Date().toISOString(), 
    type: 'Balance', 
    isBFR: true,      
    duration: 35,      
    difficulty: 3,     
    status: 'scheduled',
  },
  {
    id: 'P006-S01',
    patientId: 'P006',
    patientName: getPatientName('P006'),
    date: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
    type: 'Mobility', 
    isBFR: false,      
    duration: 40,      
    difficulty: 2,     
    status: 'completed',
    performance: '78%', 
  },
  {
    id: 'P007-S01',
    patientId: 'P007',
    patientName: getPatientName('P007'),
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
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
    patientName: getPatientName('P008'),
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), 
    type: 'Strength', 
    isBFR: false,      
    duration: 30,      
    difficulty: 1,     
    status: 'cancelled',
  },
  {
    id: 'P009-S01',
    patientId: 'P009',
    patientName: getPatientName('P009'),
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
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
    patientName: getPatientName('P010'),
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    type: 'Flexibility', 
    isBFR: false,      
    duration: 25,      
    difficulty: 2,     
    status: 'cancelled',
  }
];

// Removed local patients, c3dFilesData, deriveOverallStatus, and treatments array

export const mockData = {
  patients: mockPatients, // From ./patients-data
  sessions: mockSessionListItems, // Renamed, this is SessionListItem[]
  rehabilitationSessions: mockRehabilitationSessions, // From ./sessions-data
  c3dFiles: mockC3DFiles, // From ./c3d-files-data
  treatments: mockTreatmentPlans, // From ./treatment-plans-data
};