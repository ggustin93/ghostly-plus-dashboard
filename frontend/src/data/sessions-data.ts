import { RehabilitationSession, GameSession } from '@/types/session';

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

// Generate session dates based on patient admission dates and status
/*
const generateSessionDates = (patientId: string, admissionDate: string, status: string): string[] => {
  const admission = new Date(admissionDate);
  const today = new Date('2025-05-22'); // Current date from your system
  const dates: string[] = [];
  
  // Start sessions 2-3 days after admission
  const firstSession = new Date(admission);
  firstSession.setDate(admission.getDate() + 2);
  
  // Generate weekly sessions
  const currentSession = new Date(firstSession);
  let sessionCount = 0;
  const maxSessions = status === 'active' ? 4 : 2; // Active patients have more sessions
  
  while (currentSession <= today && sessionCount < maxSessions) {
    dates.push(currentSession.toISOString().split('T')[0]);
    currentSession.setDate(currentSession.getDate() + 7); // Weekly sessions
    sessionCount++;
  }
  
  // Add one future session for active patients
  if (status === 'active' && currentSession <= new Date('2025-06-30')) {
    dates.push(currentSession.toISOString().split('T')[0]);
  }
  
  return dates;
};
*/

// Complete session data for all patients
export const mockSessions: RehabilitationSession[] = [
  // Existing sessions (P001-P004, P007)
  {
    id: 'P001-S01',
    patientId: 'P001',
    date: '2025-05-20',
    therapistId: 'T001',
    gameSessions: createGameSessions('P001', '2025-05-20', true),
    notes: 'Patient showed good progress in all game sessions.',
    duration: 32
  },
  {
    id: 'P001-S02',
    patientId: 'P001',
    date: '2025-05-27',
    therapistId: 'T001',
    gameSessions: createGameSessions('P001', '2025-05-27', true),
    notes: 'Increased difficulty level, patient adapted well.',
    duration: 32
  },
  {
    id: 'P001-S03',
    patientId: 'P001',
    date: '2025-06-03',
    therapistId: 'T001',
    gameSessions: createGameSessions('P001', '2025-06-03', true),
    duration: 32
  },
  {
    id: 'P002-S01',
    patientId: 'P002',
    date: '2025-05-22',
    therapistId: 'T001',
    gameSessions: createGameSessions('P002', '2025-05-22', true),
    notes: 'First session went well, patient enjoyed the games.',
    duration: 32
  },
  {
    id: 'P002-S02',
    patientId: 'P002',
    date: '2025-05-29',
    therapistId: 'T001',
    gameSessions: createGameSessions('P002', '2025-05-29', true),
    notes: 'Patient reported slight fatigue but completed all exercises.',
    duration: 32
  },
  {
    id: 'P002-S03',
    patientId: 'P002',
    date: '2025-06-05',
    therapistId: 'T001',
    gameSessions: createGameSessions('P002', '2025-06-05', true),
    duration: 32
  },
  {
    id: 'P003-S01',
    patientId: 'P003',
    date: '2025-05-30',
    therapistId: 'T001',
    gameSessions: createGameSessions('P003', '2025-05-30', true),
    notes: 'Patient showed excellent engagement with the games.',
    assessmentPoint: 'T1',
    duration: 32
  },
  {
    id: 'P003-S02',
    patientId: 'P003',
    date: '2025-06-06',
    therapistId: 'T001',
    gameSessions: createGameSessions('P003', '2025-06-06', true),
    duration: 32
  },
  {
    id: 'P003-S03',
    patientId: 'P003',
    date: '2025-06-13',
    therapistId: 'T001',
    gameSessions: createGameSessions('P003', '2025-06-13', true),
    duration: 32
  },
  {
    id: 'P004-S01',
    patientId: 'P004',
    date: '2025-04-12',
    therapistId: 'T001',
    gameSessions: createGameSessions('P004', '2025-04-12', true),
    notes: 'Patient needed additional guidance but completed the session.',
    duration: 32
  },
  {
    id: 'P004-S02',
    patientId: 'P004',
    date: '2025-04-19',
    therapistId: 'T001',
    gameSessions: createGameSessions('P004', '2025-04-19', true),
    duration: 32
  },
  {
    id: 'P007-S01',
    patientId: 'P007',
    date: '2025-06-19',
    therapistId: 'T001',
    gameSessions: createGameSessions('P007', '2025-06-19', true),
    notes: 'Rehabilitation session for Brenda Lee focusing on coordination.',
    duration: 32
  },

  // New sessions for missing patients (P005, P006, P008, P009, P010, P011)
  
  // P005 - Sarah Wilson (active, admitted 2025-06-05)
  {
    id: 'P005-S01',
    patientId: 'P005',
    date: '2025-06-07',
    therapistId: 'T001',
    gameSessions: createGameSessions('P005', '2025-06-07', true),
    notes: 'First session post-fall. Patient demonstrated good motivation and compliance.',
    duration: 32
  },
  {
    id: 'P005-S02',
    patientId: 'P005',
    date: '2025-06-14',
    therapistId: 'T001',
    gameSessions: createGameSessions('P005', '2025-06-14', true),
    notes: 'Excellent progress with cane mobility. Increased game difficulty.',
    duration: 32
  },
  {
    id: 'P005-S03',
    patientId: 'P005',
    date: '2025-06-21',
    therapistId: 'T001',
    gameSessions: createGameSessions('P005', '2025-06-21', true),
    notes: 'Patient can now walk 10 feet with minimal assistance. Progress is good.',
    duration: 32
  },

  // P006 - George Miller (active, admitted 2025-06-01)
  {
    id: 'P006-S01',
    patientId: 'P006',
    date: '2025-06-03',
    therapistId: 'T002',
    gameSessions: createGameSessions('P006', '2025-06-03', true),
    notes: 'Initial session for sarcopenia treatment. Patient required assistance with transfers.',
    duration: 32
  },
  {
    id: 'P006-S02',
    patientId: 'P006',
    date: '2025-06-10',
    therapistId: 'T002',
    gameSessions: createGameSessions('P006', '2025-06-10', true),
    notes: 'Steady improvement in muscle activation patterns.',
    duration: 32
  },
  {
    id: 'P006-S03',
    patientId: 'P006',
    date: '2025-06-17',
    therapistId: 'T002',
    gameSessions: createGameSessions('P006', '2025-06-17', true),
    notes: 'Patient showing consistent progress with transfer assistance.',
    duration: 32
  },
  {
    id: 'P006-S04',
    patientId: 'P006',
    date: '2025-06-24',
    therapistId: 'T002',
    gameSessions: createGameSessions('P006', '2025-06-24', true),
    duration: 32
  },

  // P008 - Arthur Lewis (inactive, admitted 2025-05-10)
  {
    id: 'P008-S01',
    patientId: 'P008',
    date: '2025-05-12',
    therapistId: 'T002',
    gameSessions: createGameSessions('P008', '2025-05-12', true),
    notes: 'Initial session post-COPD exacerbation. Limited activity due to respiratory concerns.',
    duration: 32
  },
  {
    id: 'P008-S02',
    patientId: 'P008',
    date: '2025-05-19',
    therapistId: 'T002',
    gameSessions: createGameSessions('P008', '2025-05-19', true),
    notes: 'Session cancelled due to patient declining health status.',
    duration: 32
  },

  // P009 - Nancy Young (active, admitted 2025-06-10)
  {
    id: 'P009-S01',
    patientId: 'P009',
    date: '2025-06-12',
    therapistId: 'T003',
    gameSessions: createGameSessions('P009', '2025-06-12', true),
    notes: 'Hip fracture recovery session. Patient highly motivated and compliant.',
    duration: 32
  },
  {
    id: 'P009-S02',
    patientId: 'P009',
    date: '2025-06-19',
    therapistId: 'T003',
    gameSessions: createGameSessions('P009', '2025-06-19', true),
    notes: 'Excellent engagement with wheelchair-based exercises. Good progress.',
    duration: 32
  },
  {
    id: 'P009-S03',
    patientId: 'P009',
    date: '2025-06-26',
    therapistId: 'T003',
    gameSessions: createGameSessions('P009', '2025-06-26', true),
    duration: 32
  },

  // P010 - Kenneth Walker (active, admitted 2025-06-12)
  {
    id: 'P010-S01',
    patientId: 'P010',
    date: '2025-06-14',
    therapistId: 'T002',
    gameSessions: createGameSessions('P010', '2025-06-14', true),
    notes: 'Pneumonia recovery session. Patient occasionally confused but participated well.',
    duration: 32
  },
  {
    id: 'P010-S02',
    patientId: 'P010',
    date: '2025-06-21',
    therapistId: 'T002',
    gameSessions: createGameSessions('P010', '2025-06-21', true),
    duration: 32
  },

  // P011 - Patricia Hall (active, admitted 2025-06-15)
  {
    id: 'P011-S01',
    patientId: 'P011',
    date: '2025-06-17',
    therapistId: 'T003',
    gameSessions: createGameSessions('P011', '2025-06-17', true),
    notes: 'Generalized deconditioning treatment. Required 2-person assist but engaged well.',
    duration: 32
  },
  {
    id: 'P011-S02',
    patientId: 'P011',
    date: '2025-06-24',
    therapistId: 'T003',
    gameSessions: createGameSessions('P011', '2025-06-24', true),
    duration: 32
  },
];

// Dynamically calculate dates for the next 7 days for demo sessions
const today = new Date();

const todayPlus1 = new Date(today);
todayPlus1.setDate(today.getDate() + 1);

const todayPlus3 = new Date(today);
todayPlus3.setDate(today.getDate() + 3);

const todayPlus5 = new Date(today);
todayPlus5.setDate(today.getDate() + 5);

const formatDate = (dateObj: Date): string => dateObj.toISOString().split('T')[0];

const nextWeekSessionsDemo: RehabilitationSession[] = [
  {
    id: 'P001-S04',
    patientId: 'P001',
    date: formatDate(todayPlus1), // Scheduled for tomorrow
    therapistId: 'T001',
    gameSessions: createGameSessions('P001', formatDate(todayPlus1), true),
    notes: 'Dynamically scheduled demo session for tomorrow.',
    duration: 32
  },
  {
    id: 'P002-S04',
    patientId: 'P002',
    date: formatDate(todayPlus3), // Scheduled for 3 days from today
    therapistId: 'T001',
    gameSessions: createGameSessions('P002', formatDate(todayPlus3), true),
    notes: 'Dynamically scheduled demo session for 3 days from today.',
    duration: 32
  },
  {
    id: 'P005-S04',
    patientId: 'P005',
    date: formatDate(todayPlus5), // Scheduled for 5 days from today
    therapistId: 'T001',
    gameSessions: createGameSessions('P005', formatDate(todayPlus5), true),
    notes: 'Upcoming session to focus on balance and coordination exercises.',
    duration: 32
  },
];

mockSessions.push(...nextWeekSessionsDemo);

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
  const patientIds = ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009', 'P010', 'P011'];
  
  return patientIds.map(patientId => ({
    patientId,
    sessionCount: getSessionsByPatientId(patientId).length
  }));
};

export const getAllSessions = (): RehabilitationSession[] => mockSessions;