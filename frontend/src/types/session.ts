// Types related to Rehabilitation Sessions and Game Sessions

export interface BFRParameters {
    aop: number; // Arterial Occlusion Pressure measured in mmHg
    targetPercentage: number; // Target percentage of AOP (e.g., 40%)
    cuffPressure: number; // Actual pressure applied in mmHg
    duration: number; // Duration in minutes
    durationPerSet?: number; // Duration per set in seconds
    restBetweenSets?: number; // Rest between sets in seconds
    setNumber?: number; // Current set number in a BFR protocol
    totalSets?: number; // Total sets planned in the BFR protocol
    repetitionsInSet?: number; // Number of repetitions in the current BFR set
  }
  
  export interface GameParameters {
    difficulty: number;
    targetMVC: number; // Target percentage of Maximum Voluntary Contraction
    repetitions: number;
    sets: number;
    restIntervals: number; // Rest intervals in seconds
    ddaEnabled: boolean;
    ddaParameters?: {
      adaptiveContractionDetection: boolean;
      adaptiveLevelProgression: boolean;
      // Add other DDA parameters as needed
    };
  }
  
  export interface EMGMetrics {
    rms: number; // Root Mean Square
    mav: number; // Mean Absolute Value
    var: number; // Variance
    fatigueIndex: number; // Dimitrov's fatigue index
    peakContraction: number; // Peak contraction as % of MVC
    symmetryScore?: number; // For comparing left/right
    forceEstimation?: number; // Estimated force
    muscleMassEstimation?: number; // Estimated muscle mass
    rmsAvg?: number; // Average RMS value across the session
    rmsStd?: number; // Standard deviation of RMS values
    mavAvg?: number; // Average MAV value across the session
    mavStd?: number; // Standard deviation of MAV values
    longContractionsLeft?: number; // Count of long contractions for left muscle
    longContractionsRight?: number; // Count of long contractions for right muscle
    shortContractionsLeft?: number; // Count of short contractions for left muscle
    shortContractionsRight?: number; // Count of short contractions for right muscle
    // Add other EMG metrics as needed
  }
  
  export interface GameSessionStatistics {
    duration: number; // in seconds
    levelsCompleted: number;
    timePerLevel: number[];
    activationPoints: number;
    inactivityPeriods: number;
    engagementScore: number;
    adherenceScore: number;
  }
  
  // Individual game play session (typically generates one C3D file)
  export interface GameSession {
    id: string;
    startTime: string;
    endTime: string;
    gameType: string;
    muscleGroups: string[];
    parameters: GameParameters;
    bfrParameters?: BFRParameters; // May not be used in all sessions
    c3dFileUrl?: string;
    sensorType?: string; // If multiple sensor types are supported
    metrics?: EMGMetrics;
    statistics?: GameSessionStatistics;
    notes?: string;
  }
  
  // Overall therapy session that may contain multiple game sessions
  export interface RehabilitationSession {
    id: string;
    patientId: string;
    date: string;
    therapistId: string;
    type?: string; // Type of rehabilitation session, e.g., 'Strength Training (BFR)', 'Endurance Training'
    gameSessions: GameSession[];
    notes?: string;
    assessmentPoint?: 'T0' | 'T1' | 'T2'; // If this session includes clinical assessments
    clinicianNotes?: string; // Notes from the clinician for this session
    summaryMetrics?: { // High-level summary metrics for the entire rehabilitation session
      totalDuration?: number; // Total duration of the session in seconds
      averagePeakContraction?: number;
      averageSymmetryScore?: number;
      adherence?: number; // Overall adherence to the prescribed session
      // Add other summary metrics as needed
    };
    duration: number; // in minutes
    status?: 'scheduled' | 'completed' | 'cancelled'; // Add status to RehabilitationSession
  }

  // Interface for session items, typically used in lists (from former sessions.ts)
  export interface SessionListItem {
    id: string;
    patientId: string;
    patientName?: string; // Added for displaying in lists
    date: string;
    type: string; // Simplified to generic string, or could be more specific like 'Rehab' | 'Training'
    isBFR?: boolean; // New property for BFR status
    duration: number;  // in minutes
    difficulty?: number; // Kept for now, though not displayed in schedule
    performance?: string; // percentage completion
    linkState?: { from: string }; // For navigation state tracking
    status?: 'scheduled' | 'completed' | 'cancelled'; // Add status to SessionListItem
  }