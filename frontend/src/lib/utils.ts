import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GameSession } from "@/types/session";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Color palette - using hex codes for direct style application
const avatarColorPalette = [
  { backgroundColor: '#ef4444', color: '#ffffff' }, // red-500
  { backgroundColor: '#f97316', color: '#ffffff' }, // orange-500
  { backgroundColor: '#f59e0b', color: '#000000' }, // amber-500
  { backgroundColor: '#eab308', color: '#000000' }, // yellow-500
  { backgroundColor: '#84cc16', color: '#000000' }, // lime-500
  { backgroundColor: '#22c55e', color: '#ffffff' }, // green-500
  { backgroundColor: '#10b981', color: '#ffffff' }, // emerald-500
  { backgroundColor: '#14b8a6', color: '#ffffff' }, // teal-500
  { backgroundColor: '#06b6d4', color: '#000000' }, // cyan-500
  { backgroundColor: '#0ea5e9', color: '#ffffff' }, // sky-500
  { backgroundColor: '#3b82f6', color: '#ffffff' }, // blue-500
  { backgroundColor: '#6366f1', color: '#ffffff' }, // indigo-500
  { backgroundColor: '#8b5cf6', color: '#ffffff' }, // violet-500
  { backgroundColor: '#a855f7', color: '#ffffff' }, // purple-500
  { backgroundColor: '#d946ef', color: '#ffffff' }, // fuchsia-500
  { backgroundColor: '#ec4899', color: '#ffffff' }, // pink-500
  { backgroundColor: '#f43f5e', color: '#ffffff' }, // rose-500
];

// Helper function to get initials
export const getInitials = (name: string) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
};

// Helper function to get a color based on patient ID for random, distinct colors
export const getAvatarColor = (id: string) => {
  if (!id) { 
    return avatarColorPalette[0]; // Default color if id is not provided
  }
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % avatarColorPalette.length;
  return avatarColorPalette[index];
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const calculateAveragePerformance = (gameSessions: GameSession[]): number => {
  const completedSessions = gameSessions.filter(gs => gs.statistics && gs.statistics.adherenceScore > 0);
  if (completedSessions.length === 0) return 0;

  const totalScore = completedSessions.reduce((acc, curr) => {
    return acc + (curr.statistics?.adherenceScore || 0);
  }, 0);
  
  return Math.round(totalScore / completedSessions.length);
};
