// Session interface
export interface Session {
  id: string;
  patientId: string;
  patientName?: string; // Added for displaying in lists
  date: string;
  type: 'Strength' | 'Endurance' | 'Coordination';
  duration: number;  // in minutes
  difficulty: number; // 1-10 scale
  status: 'scheduled' | 'completed' | 'cancelled';
  performance?: string; // percentage completion
  linkState?: { from: string }; // For navigation state tracking
}