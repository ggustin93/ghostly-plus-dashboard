import { Session } from '@/types/sessions';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockData as mainMockData } from '@/data/mock-data'; // Import main mock data to get patient names
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AllSessionsView from '@/components/sessions/all-sessions-view'; // Import the new component

// Function to get patient name by ID from main mock data
const getPatientName = (patientId: string): string | undefined => {
  const patient = mainMockData.patients.find(p => p.id === patientId);
  return patient?.name;
};

// Mock data - using SXXX format for IDs and fetching patient names
const mockSessions: Session[] = [
  {
    id: 'S001',
    patientId: 'P001',
    patientName: getPatientName('P001'),
    date: '2025-06-15T14:30:00',
    type: 'Strength',
    duration: 25,
    difficulty: 3,
    status: 'completed',
    performance: '85%',
  },
  {
    id: 'S003',
    patientId: 'P002',
    patientName: getPatientName('P002'),
    date: '2025-06-14T11:00:00',
    type: 'Coordination',
    duration: 30,
    difficulty: 4,
    status: 'completed',
    performance: '92%',
  },
  {
    id: 'S007',
    patientId: 'P001',
    patientName: getPatientName('P001'),
    date: '2025-06-17T14:30:00',
    type: 'Strength',
    duration: 25,
    difficulty: 4,
    status: 'scheduled',
  },
  {
    id: 'S009',
    patientId: 'P003',
    patientName: getPatientName('P003'),
    date: new Date().toISOString(), // Keep dynamic date for variety
    type: 'Coordination',
    duration: 30,
    difficulty: 3,
    status: 'scheduled',
  },
];

const SessionsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">All Sessions</h1>
        <Button className="ml-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> New Session
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="text-center w-full">
            <CardTitle>Session Overview</CardTitle>
            <CardDescription>
              Search, view, and manage all patient therapy sessions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <AllSessionsView allSessions={mockSessions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage; 