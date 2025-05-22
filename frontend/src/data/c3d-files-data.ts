import { mockPatients } from './patients-data'; // Import the true mockPatients

// Define C3DFile type (moved from mock-data.ts)
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
  status: 'Uploaded' | 'Processing' | 'Processed' | 'Error' | 'Pending Analysis';
  analysisStatus?: 'Pending' | 'Completed' | 'Failed';
  overallStatus?: 'Error' | 'Processing' | 'Awaiting Analysis' | 'Analyzed';
  fileSizeKB?: number;
  gameType?: 'Maze Run' | 'Space Game' | 'Target Practice' | 'Other';
  gameLevel?: number;
  gameScore?: number;
}

// getPatientName now uses the imported mockPatients
const getPatientName = (patientId: string): string => {
  const patient = mockPatients.find(p => p.id === patientId);
  return patient ? patient.name : 'Unknown Patient';
};

const mockC3DFilesData: Omit<C3DFile, 'patientName' | 'overallStatus'>[] = [
  {
    id: 'c3d001',
    fileName: 'P001_Session1_G1_20231026.c3d',
    patientId: 'P001',
    rehabilitationSessionId: 'P001-S02-Rehab',
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
    rehabilitationSessionId: 'P002-S01-Rehab',
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
    rehabilitationSessionId: 'P001-S01-Rehab',
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
    rehabilitationSessionId: 'P003-S01-Rehab',
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
    rehabilitationSessionId: 'P002-S01-Rehab',
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
    rehabilitationSessionId: 'P001-S01-Rehab',
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

// Function to derive overallStatus (moved from mock-data.ts)
const deriveOverallStatus = (file: Omit<C3DFile, 'patientName' | 'overallStatus'>): C3DFile['overallStatus'] => {
  if (file.status === 'Error' || file.analysisStatus === 'Failed') return 'Error';
  if (file.status === 'Processing') return 'Processing';
  if (file.status === 'Processed' && file.analysisStatus === 'Completed') return 'Analyzed';
  return 'Awaiting Analysis';
};

// Populate patientName and overallStatus for mockC3DFiles (moved from mock-data.ts)
export const c3dFiles: C3DFile[] = mockC3DFilesData.map(file => ({
  ...file,
  patientName: getPatientName(file.patientId),
  overallStatus: deriveOverallStatus(file),
})); 

