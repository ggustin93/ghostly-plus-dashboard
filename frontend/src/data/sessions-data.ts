import { RehabilitationSession, GameSession } from '@/types/session';

// Mock game sessions
const createGameSessions = (patientId: string, date: string, completed: boolean): GameSession[] => {
  const baseDate = new Date(date);
  const sessions: GameSession[] = [];
  let currentTime = new Date(baseDate); // Start time for the first session

  for (let i = 1; i <= 4; i++) {
    const startTime = new Date(currentTime);
    const gameDurationMinutes = 2; // Each game session (BFR set) is 2 minutes
    const restDurationMinutes = 2; // Rest between sets is 2 minutes

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + gameDurationMinutes);

    const aop = 180; // Example AOP
    const targetPercentageBFR = 50; // From clinical trial

    const session: GameSession = {
      id: `gs-${patientId}-${i}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      gameType: i % 2 === 0 ? 'Space Game' : 'Maze Run', // Alternate game types
      muscleGroups: ['quadriceps'], // Consistent with trial focus
      parameters: {
        difficulty: 2,
        targetMVC: 75, // Assuming this is the game's target activation
        repetitions: 15, // As per clinical trial for BFR set
        sets: 1, // Each game session is one BFR set
        restIntervals: 0, // Rest is handled between GameSession objects
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
        duration: gameDurationMinutes, // Duration of BFR for this set (in minutes)
        // durationPerSet: gameDurationMinutes * 60, // Duration of BFR for this set (in seconds)
        restBetweenSets: restDurationMinutes * 60, // Rest after this set (in seconds)
        setNumber: i, // Current set number
        totalSets: 4, // Total sets in BFR protocol
        repetitionsInSet: 15, // Repetitions for this BFR set
      },
      c3dFileUrl: `/path/to/c3d-file-${patientId}-${i}.c3d`,
      sensorType: 'Delsys Trigno',
      metrics: completed ? {
        rms: 0.80 + (Math.random() * 0.1 - 0.05), // Slight variation
        mav: 0.70 + (Math.random() * 0.1 - 0.05),
        var: 0.11 + (Math.random() * 0.02 - 0.01),
        fatigueIndex: 0.60 + (Math.random() * 0.1 - 0.05),
        peakContraction: 75 + (Math.random() * 10 - 5),
        symmetryScore: 0.85 + (Math.random() * 0.1 - 0.05), // Allow some variation
        forceEstimation: 115 + (Math.random() * 10 - 5),
        muscleMassEstimation: 2.2 + (Math.random() * 0.2 - 0.1),
        // Distribute 15 total repetitions among the four contraction types
        ...(() => {
          let remainingReps = 15;
          const ll = Math.floor(Math.random() * (remainingReps / 2));
          remainingReps -= ll;
          const lr = Math.floor(Math.random() * (remainingReps / 1.5)); 
          remainingReps -= lr;
          const sl = Math.floor(Math.random() * remainingReps);
          remainingReps -= sl;
          const sr = remainingReps; // Assign whatever is left to short right
          return {
            longContractionsLeft: ll,
            longContractionsRight: lr,
            shortContractionsLeft: sl,
            shortContractionsRight: sr,
          };
        })(),
      } : undefined,
      statistics: completed ? {
        duration: gameDurationMinutes * 60, // in seconds
        levelsCompleted: 1, // Each game session is one level/set
        timePerLevel: [gameDurationMinutes * 60],
        activationPoints: Math.floor(15 * (75 + (Math.random() * 10 - 5))), // Reps * some score factor
        inactivityPeriods: Math.floor(Math.random() * 2),
        engagementScore: 80 + Math.floor(Math.random() * 11),
        adherenceScore: 90 + Math.floor(Math.random() * 11),
      } : undefined,
    };
    sessions.push(session);

    // Update currentTime for the next session (start after current game + rest)
    // No rest after the last set
    if (i < 4) {
      currentTime = new Date(endTime);
      currentTime.setMinutes(endTime.getMinutes() + restDurationMinutes);
    }
  }
  return sessions;
};

// Mock rehabilitation sessions
export const mockSessions: RehabilitationSession[] = [
  // Completed sessions for patient P001
  {
    id: 'P001-S01',
    patientId: 'P001',
    date: '2025-05-20',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P001', '2025-05-20', true),
    notes: 'Patient showed good progress in all game sessions.'
  },
  {
    id: 'P001-S02',
    patientId: 'P001',
    date: '2025-05-27',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P001', '2025-05-27', true),
    notes: 'Increased difficulty level, patient adapted well.'
  },
  {
    id: 'P001-S03',
    patientId: 'P001',
    date: '2025-06-03',
    therapistId: 'T001',
    status: 'scheduled',
    gameSessions: [],
  },
  
  // Sessions for patient P002
  {
    id: 'P002-S01',
    patientId: 'P002',
    date: '2025-05-22',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P002', '2025-05-22', true),
    notes: 'First session went well, patient enjoyed the games.'
  },
  {
    id: 'P002-S02',
    patientId: 'P002',
    date: '2025-05-29',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P002', '2025-05-29', true),
    notes: 'Patient reported slight fatigue but completed all exercises.'
  },
  {
    id: 'P002-S03',
    patientId: 'P002',
    date: '2025-06-05',
    therapistId: 'T001',
    status: 'scheduled',
    gameSessions: [],
  },
  
  // Sessions for patient P003
  {
    id: 'P003-S01',
    patientId: 'P003',
    date: '2025-05-21',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P003', '2025-05-21', true),
    notes: 'Patient showed excellent engagement with the games.',
    assessmentPoint: 'T1'
  },
  {
    id: 'P003-S02',
    patientId: 'P003',
    date: '2025-05-28',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P003', '2025-05-28', true)
  },
  {
    id: 'P003-S03',
    patientId: 'P003',
    date: '2025-06-04',
    therapistId: 'T001',
    status: 'scheduled',
    gameSessions: [],
  },
  
  // Sessions for patient P004
  {
    id: 'P004-S01',
    patientId: 'P004',
    date: '2025-05-23',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P004', '2025-05-23', true),
    notes: 'Patient needed additional guidance but completed the session.'
  },
  {
    id: 'P004-S02',
    patientId: 'P004',
    date: '2025-05-30',
    therapistId: 'T001',
    status: 'in-progress',
    gameSessions: createGameSessions('P004', '2025-05-30', false)
  },
  {
    id: 'P004-S03',
    patientId: 'P004',
    date: '2025-06-06',
    therapistId: 'T001',
    status: 'scheduled',
    gameSessions: [],
  },

  // Sessions for patient P007
  {
    id: 'P007-S01',
    patientId: 'P007',
    date: '2025-06-19',
    therapistId: 'T001',
    status: 'completed',
    gameSessions: createGameSessions('P007', '2025-06-19', true),
    notes: 'Rehabilitation session for Brenda Lee focusing on coordination.'
  }
];

// Get sessions for a specific patient
export const getSessionsByPatientId = (patientId: string): RehabilitationSession[] => {
  return mockSessions.filter(session => session.patientId === patientId);
};

// Get a specific rehabilitation session
export const getSessionById = (sessionId: string): RehabilitationSession | undefined => {
  return mockSessions.find(session => session.id === sessionId);
};

// Get a specific game session
export const getGameSessionById = (sessionId: string): GameSession | undefined => {
  for (const rehabSession of mockSessions) {
    const gameSession = rehabSession.gameSessions.find(gs => gs.id === sessionId);
    if (gameSession) {
      return gameSession;
    }
  }
  return undefined;
};

export const rehabilitationSessions: RehabilitationSession[] = [
  {
    id: 'rs-1',
    patientId: 'pat-1',
    date: '2024-07-20',
    therapistId: 'T001',
    status: 'completed',
    type: 'Strength Training (BFR)',
    clinicianNotes: 'Focused on quadriceps strengthening using BFR protocol. Patient tolerated well. Observed good muscle activation.',
    summaryMetrics: {
      totalDuration: (2 * 4 + 2 * 3) * 60, // 4 sets of 2 min game + 3 rests of 2 min
      averagePeakContraction: 78,
      averageSymmetryScore: 85,
      adherence: 92
    },
    gameSessions: createGameSessions('pat-1', '2024-07-20', true), // Uses the new 4-session BFR structure
  },
  {
    id: 'rs-2',
    patientId: 'pat-1',
    date: '2024-07-22',
    therapistId: 'T001',
    status: 'completed',
    type: 'Endurance Training',
    clinicianNotes: 'Standard endurance protocol. Patient reported slight fatigue towards the end.',
    summaryMetrics: {
      totalDuration: 30 * 60,
      averagePeakContraction: 65,
      averageSymmetryScore: 88,
      adherence: 95
    },
    // Example of game sessions for a non-BFR type session (could use a different generator or be manually defined)
    gameSessions: [
      {
        id: `gs-pat-1-nonbfr-1`,
        startTime: new Date(new Date('2024-07-22').setHours(10, 0, 0)).toISOString(),
        endTime: new Date(new Date('2024-07-22').setHours(10, 15, 0)).toISOString(),
        gameType: 'Maze Run',
        muscleGroups: ['quadriceps', 'hamstrings'],
        parameters: { difficulty: 2, targetMVC: 60, repetitions: 20, sets: 2, restIntervals: 60, ddaEnabled: true, ddaParameters: { adaptiveContractionDetection: true, adaptiveLevelProgression: true } },
        c3dFileUrl: `/path/to/c3d-file-pat-1-nonbfr-1.c3d`,
        sensorType: 'Delsys Trigno',
        metrics: { rms: 0.75, mav: 0.65, var: 0.10, fatigueIndex: 0.55, peakContraction: 68, symmetryScore: 0.88, forceEstimation: 100, muscleMassEstimation: 2.1, longContractionsLeft: 20, longContractionsRight: 18, shortContractionsLeft: 5, shortContractionsRight: 4 },
        statistics: { duration: 900, levelsCompleted: 2, timePerLevel: [400, 420], activationPoints: 700, inactivityPeriods: 1, engagementScore: 85, adherenceScore: 95 }
      },
      {
        id: `gs-pat-1-nonbfr-2`,
        startTime: new Date(new Date('2024-07-22').setHours(10, 20, 0)).toISOString(),
        endTime: new Date(new Date('2024-07-22').setHours(10, 35, 0)).toISOString(),
        gameType: 'Space Game',
        muscleGroups: ['quadriceps', 'hamstrings'],
        parameters: { difficulty: 2, targetMVC: 60, repetitions: 20, sets: 2, restIntervals: 60, ddaEnabled: true, ddaParameters: { adaptiveContractionDetection: true, adaptiveLevelProgression: true } },
        c3dFileUrl: `/path/to/c3d-file-pat-1-nonbfr-2.c3d`,
        sensorType: 'Delsys Trigno',
        metrics: { rms: 0.73, mav: 0.63, var: 0.09, fatigueIndex: 0.52, peakContraction: 66, symmetryScore: 0.87, forceEstimation: 98, muscleMassEstimation: 2.0, longContractionsLeft: 19, longContractionsRight: 20, shortContractionsLeft: 6, shortContractionsRight: 5 },
        statistics: { duration: 900, levelsCompleted: 2, timePerLevel: [410, 400], activationPoints: 680, inactivityPeriods: 2, engagementScore: 82, adherenceScore: 93 }
      }
    ],
  },
  {
    id: 'rs-3',
    patientId: 'pat-2',
    date: '2024-07-21',
    therapistId: 'T002',
    status: 'completed',
    type: 'Strength Training (BFR)',
    clinicianNotes: 'Initial BFR session. Patient experienced mild discomfort but completed all sets. Will monitor.',
    summaryMetrics: {
      totalDuration: (2 * 4 + 2 * 3) * 60,
      averagePeakContraction: 72,
      averageSymmetryScore: 80,
      adherence: 88
    },
    gameSessions: createGameSessions('pat-2', '2024-07-21', true), // Uses the new 4-session BFR structure
  },
  {
    id: 'rs-4',
    patientId: 'pat-2',
    date: '2024-07-23',
    therapistId: 'T002',
    status: 'completed',
    type: 'Functional Training',
    clinicianNotes: 'Working on sit-to-stand and balance exercises. Good progress.',
    summaryMetrics: {
      totalDuration: 25 * 60,
      averagePeakContraction: 0, // N/A for this type
      averageSymmetryScore: 0, // N/A
      adherence: 90
    },
    gameSessions: [ // Example of functional training, may not use EMG games
      {
        id: `gs-pat-2-func-1`,
        startTime: new Date(new Date('2024-07-23').setHours(11,0,0)).toISOString(),
        endTime: new Date(new Date('2024-07-23').setHours(11,25,0)).toISOString(),
        gameType: 'Functional Assessment',
        muscleGroups: ['full body'],
        parameters: { difficulty: 1, targetMVC: 0, repetitions: 5, sets: 3, restIntervals: 60, ddaEnabled: false },
        c3dFileUrl: undefined,
        sensorType: 'Observation',
        metrics: undefined, // No detailed EMG metrics for this type of session
        statistics: { duration: 1500, levelsCompleted: 3, timePerLevel: [480, 500, 520], activationPoints: 0, inactivityPeriods: 0, engagementScore: 0, adherenceScore: 90 }
      }
    ],
  },
  {
    id: 'rs-5',
    patientId: 'pat-1',
    date: '2024-07-24',
    therapistId: 'T001',
    status: 'completed',
    type: 'Strength Training (BFR)',
    clinicianNotes: 'Follow-up BFR. Patient reported less discomfort. Increased target slightly.',
    summaryMetrics: {
      totalDuration: (2 * 4 + 2 * 3) * 60,
      averagePeakContraction: 80,
      averageSymmetryScore: 86,
      adherence: 94
    },
    gameSessions: createGameSessions('pat-1', '2024-07-24', true),
  },
  {
    id: 'rs-6',
    patientId: 'pat-1',
    date: '2024-07-25',
    therapistId: 'T001',
    status: 'cancelled',
    type: 'Strength Training (BFR)',
    clinicianNotes: 'Session not completed. Patient felt unwell after first set.',
    summaryMetrics: {
      totalDuration: (2 * 1 + 0 * 0) * 60, // Only 1 set completed
      averagePeakContraction: 75,
      averageSymmetryScore: 83,
      adherence: 25 // (1/4 sets)
    },
    // Manually create sessions for incomplete scenario
    gameSessions: (() => {
      const sessions = createGameSessions('pat-1', '2024-07-25', false); // Generate all 4, mark as not completed
      // Simulate only the first one was 'done' in terms of metrics, others not started
      if (sessions[0]) {
        sessions[0].metrics = { // Metrics for the first completed set
          rms: 0.80, mav: 0.70, var: 0.11, fatigueIndex: 0.60, peakContraction: 75, symmetryScore: 0.83, forceEstimation: 115, muscleMassEstimation: 2.2,
          longContractionsLeft: 15, longContractionsRight: 0, shortContractionsLeft: 0, shortContractionsRight: 0,
        };
        sessions[0].statistics = {
          duration: 2 * 60, levelsCompleted: 1, timePerLevel: [120], activationPoints: 15 * 75, inactivityPeriods: 0, engagementScore: 80, adherenceScore: 100, // 100% for this set
        };
      }
      // For subsequent sessions that were not completed, ensure metrics and stats are undefined
      for (let i = 1; i < sessions.length; i++) {
        sessions[i].metrics = undefined;
        sessions[i].statistics = undefined;
        // Adjust start/end times if they were not even started
        sessions[i].startTime = sessions[0].endTime; // Or some other logic for unstarted sessions
        sessions[i].endTime = sessions[0].endTime;
      }
      return sessions.slice(0,1); // Only return the one that was attempted/partially done. Or return all 4 but only first has data.
                                  // For simplicity here, let's say only the first one is relevant to show.
                                  // A better approach might be to have a status on GameSession itself.
    })()
  }
];

export const getAllSessions = (): RehabilitationSession[] => rehabilitationSessions;