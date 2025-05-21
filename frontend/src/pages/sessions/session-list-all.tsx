import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { mockData } from '@/data/mock-data'; // Import the entire mockData object
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AllSessionsView from '@/components/sessions/all-sessions-view'; // Import the new component
import { Link } from 'react-router-dom';

const SessionsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">All Sessions</h1>
        <div className="ml-auto flex gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>
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
          <AllSessionsView allSessions={mockData.sessions} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage; 