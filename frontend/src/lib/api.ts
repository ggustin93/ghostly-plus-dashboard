// API service for interacting with the GHOSTLY+ EMG Analysis API

// Base URL for the API - can be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

// Types based on the FastAPI models
export interface Contraction {
  start_time_ms: number;
  end_time_ms: number;
  duration_ms: number;
  mean_amplitude: number;
  max_amplitude: number;
}

export interface ChannelAnalytics {
  contraction_count: number;
  avg_duration_ms: number;
  total_duration_ms: number;
  max_duration_ms: number;
  min_duration_ms: number;
  avg_amplitude: number;
  max_amplitude: number;
}

export interface GameMetadata {
  game_name?: string;
  level?: string;
  duration?: number;
  therapist_id?: string;
  group_id?: string;
  time?: string;
  player_name?: string;
  score?: number;
}

export interface EMGAnalysisResult {
  file_id: string;
  timestamp: string;
  metadata: GameMetadata;
  analytics: Record<string, ChannelAnalytics>;
  user_id?: string;
  session_id?: string;
  patient_id?: string;
  id?: string;
}

export interface EMGRawData {
  channel_name: string;
  sampling_rate: number;
  data: number[];
  time_axis: number[];
  contractions?: Contraction[];
}

export interface ProcessingOptions {
  threshold_factor: number;
  min_duration_ms: number;
  smoothing_window: number;
}

// API functions
export const ghostlyApi = {
  // Upload and process a C3D file
  async uploadC3DFile(
    file: File,
    options: {
      user_id?: string;
      patient_id?: string;
      session_id?: string;
      threshold_factor?: number;
      min_duration_ms?: number;
      smoothing_window?: number;
    } = {}
  ): Promise<EMGAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add optional parameters
    if (options.user_id) formData.append('user_id', options.user_id);
    if (options.patient_id) formData.append('patient_id', options.patient_id);
    if (options.session_id) formData.append('session_id', options.session_id);
    
    // Add processing options with defaults
    formData.append('threshold_factor', (options.threshold_factor || 0.3).toString());
    formData.append('min_duration_ms', (options.min_duration_ms || 50).toString());
    formData.append('smoothing_window', (options.smoothing_window || 25).toString());
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/c3d/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload file');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading C3D file:', error);
      throw error;
    }
  },
  
  // Get a list of all results
  async getResults(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/c3d/results`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch results');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  },
  
  // Get a specific result by ID
  async getResult(resultId: string): Promise<EMGAnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/c3d/results/${resultId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch result');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching result ${resultId}:`, error);
      throw error;
    }
  },
  
  // Get all results for a specific patient
  async getPatientResults(patientId: string): Promise<EMGAnalysisResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/c3d/patients/${patientId}/results`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch patient results');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching results for patient ${patientId}:`, error);
      throw error;
    }
  },
  
  // Delete a specific result
  async deleteResult(resultId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/c3d/results/${resultId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete result');
      }
    } catch (error) {
      console.error(`Error deleting result ${resultId}:`, error);
      throw error;
    }
  },
};

export async function getEMGWaveformData(resultId: string): Promise<Record<string, Array<{time: number, amplitude: number}>>> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/c3d/results/${resultId}/waveform`);
    if (!response.ok) {
      throw new Error(`Failed to fetch waveform data: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching EMG waveform data:', error);
    throw error;
  }
} 