import { RehabilitationSession, GameSession } from '@/types/session';
import { mockPatients } from './patients-data';

// Mock game sessions (keeping your existing function)
const createGameSessions = (patientId: string, date: string, completed: boolean): GameSession[] => {
  const baseDate = new Date(date);
  const sessions: GameSession[] = [];
  let currentTime = new Date(baseDate);

  for (let i = 1; i <= 4; i++) {
    const startTime = new Date(currentTime);
    const gameDurationMinutes = 2;
    const restDurationMinutes = 2;

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + gameDurationMinutes);

    const aop = 180;
    const targetPercentageBFR = 50;

    const engagementScore = Math.floor(Math.random() * (95 - 30 + 1)) + 30;

    const session: GameSession = {
      id: `gs-${patientId}-${date}-${i}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      gameType: i % 2 === 0 ? 'Space Game' : 'Maze Run',
      muscleGroups: ['quadriceps'],
      parameters: {
        difficulty: 2,
        targetMVC: 75,
        repetitions: 15,
        sets: 1,
        restIntervals: Math.floor(Math.random() * 10),
        ddaEnabled: true,
        ddaParameters: {
          adaptiveContractionDetection: true,
          adaptiveLevelProgression: true,
        },
      },
      bfrParameters: {
        aop: aop,
        targetPercentage: targetPercentageBFR,
        cuffPressure: Math.round(aop * (targetPercentageBFR / 100)),
        duration: gameDurationMinutes,
        restBetweenSets: restDurationMinutes * 60,
        setNumber: i,
        totalSets: 4,
        repetitionsInSet: 15,
      },
      c3dFileUrl: `/path/to/c3d-file-${patientId}-${date}-${i}.c3d`,
      sensorType: 'Delsys Trigno',
      metrics: completed ? {
        rms: 0.80 + (Math.random() * 0.1 - 0.05),
        mav: 0.70 + (Math.random() * 0.1 - 0.05),
        var: 0.11 + (Math.random() * 0.02 - 0.01),
        fatigueIndex: 0.60 + (Math.random() * 0.1 - 0.05),
        peakContraction: 75 + (Math.random() * 10 - 5),
        symmetryScore: 0.85 + (Math.random() * 0.1 - 0.05),
        forceEstimation: 115 + (Math.random() * 10 - 5),
        muscleMassEstimation: 2.2 + (Math.random() * 0.2 - 0.1),
        ...(() => {
          let remainingReps = 15;
          const ll = Math.floor(Math.random() * (remainingReps / 2));
          remainingReps -= ll;
          const lr = Math.floor(Math.random() * (remainingReps / 1.5)); 
          remainingReps -= lr;
          const sl = Math.floor(Math.random() * remainingReps);
          remainingReps -= sl;
          const sr = remainingReps;
          return {
            longContractionsLeft: ll,
            longContractionsRight: lr,
            shortContractionsLeft: sl,
            shortContractionsRight: sr,
          };
        })(),
      } : undefined,
      statistics: completed ? {
        duration: gameDurationMinutes * 60,
        levelsCompleted: 1,
        timePerLevel: [gameDurationMinutes * 60],
        activationPoints: Math.floor(15 * (75 + (Math.random() * 10 - 5))),
        inactivityPeriods: Math.floor(Math.random() * 2),
        engagementScore: engagementScore,
        adherenceScore: 90 + Math.floor(Math.random() * 11),
      } : undefined,
    };
    sessions.push(session);

    if (i < 4) {
      currentTime = new Date(endTime);
      currentTime.setMinutes(endTime.getMinutes() + restDurationMinutes);
    }
  }
  return sessions;
};

// Helper to generate sessions based on the clinical protocol
const generateProtocolSessions = (
  patientId: string,
  therapistId: string,
  admissionDate: string,
  completedSessions: number
): RehabilitationSession[] => {
  const sessions: RehabilitationSession[] = [];
  const start = new Date(admissionDate);
  start.setDate(start.getDate() + 1); // Start therapy the day after admission

  let addedSessions = 0;
  let daysElapsed = 0;
  // Only create records for sessions that were actually performed.
  while (addedSessions < completedSessions) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + daysElapsed);

    // Skip weekends (Saturday: 6, Sunday: 0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const dateStr = currentDate.toISOString().split('T')[0];

      sessions.push({
        id: `${patientId}-S${String(addedSessions + 1).padStart(2, '0')}`,
        patientId,
        date: dateStr,
        therapistId,
        // Every session created is now marked as complete and gets performance data.
        gameSessions: createGameSessions(patientId, dateStr, true),
        notes: `Protocol session ${addedSessions + 1} completed successfully.`,
        duration: 32, // Completed sessions have a duration.
        assessmentPoint: addedSessions === completedSessions - 1 ? 'T1' : undefined,
      });
      addedSessions++;
    }
    daysElapsed++;
  }
  return sessions;
};

// Map patient adherence percentages to a number of completed sessions (out of 10)
const getCompletedSessions = (adherence: number | undefined): number => {
  if (adherence === undefined) return Math.floor(Math.random() * 5); // Default for safety
  // Ensure adherence is between 0 and 100 before calculating
  const safeAdherence = Math.max(0, Math.min(100, adherence));
  return Math.round((safeAdherence / 100) * 10);
}

// Generate protocol-compliant sessions for all patients
const allPatientSessions = mockPatients.flatMap(patient => 
  generateProtocolSessions(
    patient.id,
    patient.therapistId,
    patient.admissionDate,
    getCompletedSessions(patient.adherence)
  )
);

// Complete session data for all patients
export const mockSessions: RehabilitationSession[] = allPatientSessions;

// Helper functions
export const getSessionsByPatientId = (patientId: string): RehabilitationSession[] => {
  return mockSessions.filter(session => session.patientId === patientId);
};

export const getSessionById = (sessionId: string): RehabilitationSession | undefined => {
  return mockSessions.find(session => session.id === sessionId);
};

export const getGameSessionById = (sessionId: string): GameSession | undefined => {
  for (const rehabSession of mockSessions) {
    const gameSession = rehabSession.gameSessions.find(gs => gs.id === sessionId);
    if (gameSession) {
      return gameSession;
    }
  }
  return undefined;
};

// Verification function to ensure all patients have sessions
export const verifyPatientSessions = (): { patientId: string; sessionCount: number }[] => {
  const patientIds = mockPatients.map(p => p.id);
  
  return patientIds.map(patientId => ({
    patientId,
    sessionCount: getSessionsByPatientId(patientId).length
  }));
};

export const getAllSessions = (): RehabilitationSession[] => mockSessions;