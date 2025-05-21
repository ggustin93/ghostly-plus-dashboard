// Session interface
export interface Session {
  id: string;
  patientId: string;
  patientName?: string; // Added for displaying in lists
  date: string;
  type: string; // Simplified to generic string, or could be more specific like 'Rehab' | 'Training'
  isBFR?: boolean; // New property for BFR status
  duration: number;  // in minutes
  difficulty?: number; // Kept for now, though not displayed in schedule
  status: 'scheduled' | 'completed' | 'cancelled';
  performance?: string; // percentage completion
  linkState?: { from: string }; // For navigation state tracking
}