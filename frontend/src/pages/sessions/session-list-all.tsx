import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { mockData } from '@/data/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SessionsList from '@/components/patients/sessions-list';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const SessionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = mockData.sessions.filter(session =>
    session.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
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
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by patient name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <SessionsList sessions={filteredSessions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage; 