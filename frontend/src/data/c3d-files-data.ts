import { mockPatients } from './patients-data';
import { mockSessions } from './sessions-data';

// Define C3DFile type
export interface C3DFile {
  id: string;
  fileName: string;
  patientId: string;
  patientName?: string;
  rehabilitationSessionId: string;
  gameSessionId: string;
  uploadDate: string;
  uploadedBy: 'API' | 'Manual';
  uploaderName?: string;
  status: 'Uploaded' | 'Processing' | 'Processed' | 'Error' | 'Pending Analysis';
  analysisStatus?: 'Pending' | 'Completed' | 'Failed';
  overallStatus?: 'Error' | 'Processing' | 'Awaiting Analysis' | 'Analyzed';
  fileSizeKB?: number;
  gameType?: 'Maze Run' | 'Space Game' | 'Target Practice' | 'Other';
  gameLevel?: number;
  gameScore?: number;
}

// Helper function to get patient name
const getPatientName = (patientId: string): string => {
  const patient = mockPatients.find(p => p.id === patientId);
  return patient ? patient.name : 'Unknown Patient';
};

// Helper function to generate C3D files based on actual session data
const generateC3DFilesFromSessions = (): Omit<C3DFile, 'patientName' | 'overallStatus'>[] => {
  const c3dFiles: Omit<C3DFile, 'patientName' | 'overallStatus'>[] = [];
  let fileCounter = 1;

  mockSessions.forEach(session => {
    // Only generate C3D files for completed sessions with game sessions
    if (session.status === 'completed' && session.gameSessions.length > 0) {
      session.gameSessions.forEach((gameSession, gameIndex) => {
        // Only create C3D files for game sessions that have metrics (were actually completed)
        if (gameSession.metrics) {
          const sessionDate = new Date(session.date);
          const uploadDate = new Date(gameSession.endTime);
          // Add small delay after game session end for upload
          uploadDate.setMinutes(uploadDate.getMinutes() + Math.floor(Math.random() * 30) + 5);

          const fileId = `c3d${String(fileCounter).padStart(3, '0')}`;
          const fileName = `${session.patientId}_${session.id.split('-')[1]}_G${gameIndex + 1}_${sessionDate.toISOString().split('T')[0].replace(/-/g, '')}.c3d`;
          
          // Determine status and analysis status with some variation
          const statusOptions: Array<'Processed' | 'Pending Analysis' | 'Processing' | 'Error'> = ['Processed', 'Pending Analysis', 'Processing', 'Error'];
          const weights = [0.6, 0.2, 0.15, 0.05]; // Most files are processed
          const randomValue = Math.random();
          let cumulativeWeight = 0;
          let selectedStatus: 'Processed' | 'Pending Analysis' | 'Processing' | 'Error' = 'Processed';
          
          for (let i = 0; i < statusOptions.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue <= cumulativeWeight) {
              selectedStatus = statusOptions[i];
              break;
            }
          }

          let analysisStatus: 'Pending' | 'Completed' | 'Failed' | undefined;
          if (selectedStatus === 'Processed') {
            analysisStatus = Math.random() > 0.1 ? 'Completed' : 'Failed';
          } else if (selectedStatus === 'Pending Analysis' || selectedStatus === 'Processing') {
            analysisStatus = 'Pending';
          } else {
            analysisStatus = undefined; // Error status
          }

          // Calculate game score based on metrics
          let gameScore = 0;
          if (selectedStatus !== 'Error' && gameSession.metrics) {
            const baseScore = (gameSession.metrics.peakContraction ?? 0) * 10;
            const symmetryBonus = (gameSession.metrics.symmetryScore ?? 0) * 500;
            const fatigueReduction = (1 - (gameSession.metrics.fatigueIndex ?? 0)) * 300;
            gameScore = Math.round(baseScore + symmetryBonus + fatigueReduction);
          }

          const c3dFile: Omit<C3DFile, 'patientName' | 'overallStatus'> = {
            id: fileId,
            fileName: fileName,
            patientId: session.patientId,
            rehabilitationSessionId: session.id,
            gameSessionId: gameSession.id,
            uploadDate: uploadDate.toISOString(),
            uploadedBy: Math.random() > 0.8 ? 'Manual' : 'API',
            uploaderName: Math.random() > 0.8 ? ['Dr. Carter', 'Dr. Johnson', 'Therapist Smith'][Math.floor(Math.random() * 3)] : undefined,
            status: selectedStatus,
            analysisStatus: analysisStatus,
            fileSizeKB: Math.floor(Math.random() * 500) + 800, // 800-1300 KB
            gameType: gameSession.gameType as 'Maze Run' | 'Space Game',
            gameLevel: gameSession.parameters.difficulty,
            gameScore: gameScore,
          };

          c3dFiles.push(c3dFile);
          fileCounter++;
        }
      });
    }
  });

  return c3dFiles;
};

// Generate the mock C3D files data
const mockC3DFilesData = generateC3DFilesFromSessions();

// Function to derive overallStatus
const deriveOverallStatus = (file: Omit<C3DFile, 'patientName' | 'overallStatus'>): C3DFile['overallStatus'] => {
  if (file.status === 'Error' || file.analysisStatus === 'Failed') return 'Error';
  if (file.status === 'Processing') return 'Processing';
  if (file.status === 'Processed' && file.analysisStatus === 'Completed') return 'Analyzed';
  return 'Awaiting Analysis';
};

// Populate patientName and overallStatus for mockC3DFiles
export const c3dFiles: C3DFile[] = mockC3DFilesData.map(file => ({
  ...file,
  patientName: getPatientName(file.patientId),
  overallStatus: deriveOverallStatus(file),
}));

// Helper functions for querying C3D files
export const getC3DFilesByPatientId = (patientId: string): C3DFile[] => {
  return c3dFiles.filter(file => file.patientId === patientId);
};

export const getC3DFilesBySessionId = (sessionId: string): C3DFile[] => {
  return c3dFiles.filter(file => file.rehabilitationSessionId === sessionId);
};

export const getC3DFileByGameSessionId = (gameSessionId: string): C3DFile | undefined => {
  return c3dFiles.find(file => file.gameSessionId === gameSessionId);
};

export const getC3DFileById = (fileId: string): C3DFile | undefined => {
  return c3dFiles.find(file => file.id === fileId);
};

// Summary statistics
export const getC3DFileSummary = () => {
  const totalFiles = c3dFiles.length;
  const statusCounts = c3dFiles.reduce((acc, file) => {
    acc[file.overallStatus || 'Unknown'] = (acc[file.overallStatus || 'Unknown'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const patientFileCounts = c3dFiles.reduce((acc, file) => {
    acc[file.patientId] = (acc[file.patientId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalFiles,
    statusCounts,
    patientFileCounts,
    averageFileSize: totalFiles > 0 ? Math.round(c3dFiles.reduce((sum, file) => sum + (file.fileSizeKB || 0), 0) / totalFiles) : 0,
  };
};