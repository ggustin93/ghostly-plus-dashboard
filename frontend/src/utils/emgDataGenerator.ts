// utils/emgDataGenerator.ts

export interface EMGDataPoint {
  time: number;
  leftQuadriceps: number;
  rightQuadriceps: number;
}

export interface EMGGeneratorOptions {
  durationSeconds?: number;
  samplingRate?: number;
  downsampleFactor?: number;
  targetContractions?: number; // Retiré | null
  includePauses?: boolean;
}

interface PausePeriod {
  start: number;
  end: number;
}

interface ContractionState {
  active: boolean;
  side: 'none' | 'left' | 'right';
  duration: number;
  lastSide: 'none' | 'left' | 'right';
  amplitude: number;
  remainingDuration: number;
  isLongContraction: boolean;
  timeSinceLastContraction: number;
  contractionCount: number;
}

/**
 * Generates realistic EMG time series data for rehabilitation gaming sessions
 * Simulates quadriceps muscle activation during maze navigation with BFR protocol
 */
export const generateEMGTimeSeriesData = (options: EMGGeneratorOptions = {}): EMGDataPoint[] => {
  const {
    durationSeconds = 120,
    samplingRate = 1000,
    downsampleFactor = 100,
    targetContractions = 15, // Changé: valeur par défaut à 15 au lieu de null
    includePauses = true
  } = options;

  const data: EMGDataPoint[] = [];
  const totalSamples = samplingRate * durationSeconds;
  
  // Generate pause periods (obstacles in game) if enabled
  let pausePeriods: PausePeriod[] = [];
  if (includePauses) {
    const numPauses = 2 + Math.floor(Math.random() * 2); // 2-3 pauses
    for (let p = 0; p < numPauses; p++) {
      const pauseStart = (p + 1) * Math.floor(totalSamples / (numPauses + 1)) + Math.floor(Math.random() * 10000) - 5000;
      const pauseDuration = Math.floor(Math.random() * 10000) + 10000; // 10-20 second pauses
      pausePeriods.push({
        start: Math.max(5000, pauseStart),
        end: Math.min(totalSamples - 5000, pauseStart + pauseDuration)
      });
    }
  }
  
  let contractionState: ContractionState = {
    active: false,
    side: 'none',
    duration: 0,
    lastSide: 'none',
    amplitude: 0,
    remainingDuration: 0,
    isLongContraction: true,
    timeSinceLastContraction: 0,
    contractionCount: 0
  };

  // Target contractions (use the value passed in or fall back to random range)
  const finalTargetContractions = targetContractions ?? (10 + Math.floor(Math.random() * 3)); // 10-12
  console.log(`EMG Generator: Target=${targetContractions}, Final=${finalTargetContractions}`);
  
  // Pre-calculate contraction timings to ensure we hit the target
  const contractionTimings: Array<{start: number, duration: number, side: 'left' | 'right', isLong: boolean}> = [];
  
  // First, create time slots avoiding pauses
  const availableSlots: Array<{start: number, end: number}> = [];
  let slotStart = 5000; // Start after 5 seconds
  
  for (let i = slotStart; i < totalSamples - 5000; i += 1000) { // Check every second
    const slotEnd = i + 3000; // 3-second slots
    
    // Check if this slot conflicts with any pause
    const conflictsWithPause = pausePeriods.some(pause => 
      (i >= pause.start && i <= pause.end) ||
      (slotEnd >= pause.start && slotEnd <= pause.end) ||
      (i <= pause.start && slotEnd >= pause.end)
    );
    
    if (!conflictsWithPause && slotEnd < totalSamples - 5000) {
      availableSlots.push({ start: i, end: slotEnd });
    }
  }
  
  console.log(`Found ${availableSlots.length} available time slots`);
  
  // Now distribute contractions with natural randomization across available slots
  if (availableSlots.length >= finalTargetContractions) {
    // Create base distribution with some randomness
    const selectedSlots: number[] = [];
    const totalSlots = availableSlots.length;
    const idealSpacing = totalSlots / finalTargetContractions;
    
    for (let c = 0; c < finalTargetContractions; c++) {
      // Base position with randomization (±30% variation)
      const basePosition = c * idealSpacing;
      const randomVariation = (Math.random() - 0.5) * idealSpacing * 0.6; // ±30% of ideal spacing
      const randomizedPosition = Math.max(0, Math.min(totalSlots - 1, basePosition + randomVariation));
      
      selectedSlots.push(Math.floor(randomizedPosition));
    }
    
    // Remove duplicates and sort
    const uniqueSlots = [...new Set(selectedSlots)].sort((a, b) => a - b);
    
    // If we lost slots due to duplicates, add random ones
    while (uniqueSlots.length < finalTargetContractions) {
      const availableIndices = Array.from({length: totalSlots}, (_, i) => i)
        .filter(i => !uniqueSlots.includes(i));
      
      if (availableIndices.length === 0) break;
      
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      uniqueSlots.push(randomIndex);
      uniqueSlots.sort((a, b) => a - b);
    }
    
    let isLongContraction = true;
    let lastSide: 'left' | 'right' = 'left';
    
    uniqueSlots.slice(0, finalTargetContractions).forEach((slotIndex, contractionIndex) => {
      const slot = availableSlots[slotIndex];
      
      // Alternate sides with 75% probability for natural variation
      let side: 'left' | 'right';
      if (Math.random() < 0.75) {
        side = lastSide === 'left' ? 'right' : 'left';
      } else {
        side = Math.random() < 0.5 ? 'left' : 'right';
      }
      lastSide = side;
      
      // Determine duration based on long/short pattern with more variation
      let duration: number;
      if (isLongContraction) {
        duration = Math.floor(Math.random() * 1000) + 1000; // 1.0-2.0 seconds (more variation)
      } else {
        duration = Math.floor(Math.random() * 400) + 300; // 0.3-0.7 seconds (more variation)
      }
      
      // Place contraction randomly within the slot
      const slotDuration = slot.end - slot.start;
      const maxStartInSlot = Math.max(slot.start, slot.end - duration);
      const randomPositionInSlot = Math.random() * Math.max(100, maxStartInSlot - slot.start);
      const startTime = slot.start + randomPositionInSlot;
      
      contractionTimings.push({
        start: Math.floor(startTime),
        duration: duration,
        side: side,
        isLong: isLongContraction
      });
      
      // Add some randomness to long/short alternation (80% chance to alternate)
      if (Math.random() < 0.8) {
        isLongContraction = !isLongContraction;
      }
    });
  } else {
    // Fallback: Force contractions with natural spacing variation
    console.warn(`Not enough slots (${availableSlots.length}), forcing ${finalTargetContractions} contractions`);
    
    const totalAvailableTime = totalSamples - 10000; // Exclude first and last 5 seconds
    const baseTimePerContraction = totalAvailableTime / finalTargetContractions;
    
    let isLongContraction = true;
    let lastSide: 'left' | 'right' = 'left';
    let currentTime = 5000;
    
    for (let c = 0; c < finalTargetContractions; c++) {
      // Add randomness to spacing (±40% variation)
      const spacingVariation = (Math.random() - 0.5) * baseTimePerContraction * 0.8;
      const nextTime = currentTime + baseTimePerContraction + spacingVariation;
      const startTime = Math.max(5000, Math.min(totalSamples - 5000, nextTime));
      
      // Alternate sides with natural variation
      const side: 'left' | 'right' = Math.random() < 0.25 ? 
        (Math.random() < 0.5 ? 'left' : 'right') : // 25% completely random
        (lastSide === 'left' ? 'right' : 'left');   // 75% alternating
      lastSide = side;
      
      // Determine duration with more natural variation
      const duration = isLongContraction ? 
        Math.floor(Math.random() * 1000) + 1000 : // 1.0-2.0 seconds
        Math.floor(Math.random() * 400) + 300;    // 0.3-0.7 seconds
      
      contractionTimings.push({
        start: Math.floor(startTime),
        duration: duration,
        side: side,
        isLong: isLongContraction
      });
      
      currentTime = startTime;
      
      // Natural alternation pattern with some randomness
      if (Math.random() < 0.85) {
        isLongContraction = !isLongContraction;
      }
    }
  }
  
  // Sort contractions by start time
  contractionTimings.sort((a, b) => a.start - b.start);
  
  console.log(`Generated ${contractionTimings.length} contraction timings out of ${finalTargetContractions} requested`);
  console.log('Contraction timings:', contractionTimings.map(ct => `${(ct.start/1000).toFixed(1)}s (${ct.side})`));
  
  for (let i = 0; i < totalSamples; i++) {
    // Check if we're in a pause period (obstacle)
    const inPause = pausePeriods.some(pause => i >= pause.start && i <= pause.end);
    
    // Pre-processed EMG baseline: very low, clean signal when not contracting
    let left = 0.01 + Math.random() * 0.02; // 0.01-0.03: very low baseline
    let right = 0.01 + Math.random() * 0.02; // 0.01-0.03: very low baseline

    // Check if we should start a contraction based on pre-calculated timings
    const activeContraction = contractionTimings.find(ct => 
      i >= ct.start && i < ct.start + ct.duration
    );

    if (activeContraction) { // Supprimé "&& !inPause" - les contractions ne sont plus supprimées pendant les pauses
      const progress = (i - activeContraction.start) / activeContraction.duration;
      
      // Create bell-shaped envelope for more realistic contraction
      let envelope: number;
      if (progress < 0.3) {
        // Rising phase (quick rise)
        envelope = Math.pow(progress / 0.3, 2);
      } else if (progress < 0.7) {
        // Plateau phase
        envelope = 1.0;
      } else {
        // Falling phase (gradual decline)
        envelope = Math.pow((1 - progress) / 0.3, 1.5);
      }

      // Amplitude based on contraction type
      const amplitude = activeContraction.isLong ? 
        (0.9 + Math.random() * 0.3) : // Higher amplitude for long contractions
        (0.6 + Math.random() * 0.2);  // Lower amplitude for short contractions
      
      // Pre-processed EMG: smoother signal with minimal noise during contraction
      const contraction = amplitude * envelope * (0.98 + Math.random() * 0.04); // Very little sample-to-sample variation

      if (activeContraction.side === 'left') {
        left = contraction;
      } else {
        right = contraction;
      }
    }

    // Only keep every Nth sample for visualization performance
    if (i % downsampleFactor === 0) {
      data.push({
        time: i / samplingRate, // Convert to seconds for time axis
        leftQuadriceps: left,
        rightQuadriceps: right,
      });
    }
  }
  
  return data;
};

/**
 * Generate EMG data specifically for BFR (Blood Flow Restriction) protocols
 * Includes 4 sets of 2 minutes each with 2-minute rest periods
 */
export const generateBFREMGData = (setNumber: number = 1): EMGDataPoint[] => {
  const options: EMGGeneratorOptions = {
    durationSeconds: 120, // 2 minutes per set
    targetContractions: 10 + Math.floor(Math.random() * 3), // 10-12 per set
    includePauses: true, // Obstacles in game
  };
  
  // Adjust fatigue based on set number (later sets show more fatigue)
  if (setNumber > 2) {
    options.targetContractions = Math.max(8, (options.targetContractions || 10) - (setNumber - 2));
  }
  
  return generateEMGTimeSeriesData(options);
};

export type GameType = 'Maze Run' | 'Space Game';

/**
 * Generate EMG data for different game types
 */
export const generateGameSpecificEMGData = (gameType: GameType | string = 'Maze Run', targetContractions?: number): EMGDataPoint[] => {
  let options: EMGGeneratorOptions = {
    durationSeconds: 120,
    downsampleFactor: 100,
  };
  
  // If targetContractions is specified, use it; otherwise use game-specific defaults
  if (targetContractions) {
    options.targetContractions = targetContractions;
    options.includePauses = true; // Default to including pauses when target is specified
  } else {
    switch (gameType) {
      case 'Maze Run':
        options.targetContractions = 12 + Math.floor(Math.random() * 4); // 12-15 (more navigation)
        options.includePauses = true; // Obstacles/dead ends
        break;
        
      case 'Space Game':
        options.targetContractions = 8 + Math.floor(Math.random() * 3); // 8-10 (fewer but sustained)
        options.includePauses = false; // Continuous movement
        break;
        
      default:
        options.targetContractions = 10 + Math.floor(Math.random() * 3); // 10-12 (default)
        options.includePauses = true;
    }
  }
  
  return generateEMGTimeSeriesData(options);
};