declare module '@/utils/emgDataGenerator' {
  export interface EMGDataPoint {
    time: number;
    leftQuadriceps: number;
    rightQuadriceps: number;
  }

  export function generateGameSpecificEMGData(gameType: string, numContractions?: number): EMGDataPoint[];
} 