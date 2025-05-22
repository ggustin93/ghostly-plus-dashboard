import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { mockData } from '@/data/mock-data';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import SessionsList from '@/components/patients/sessions-list';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import PageHeader from '@/components/ui/page-header';

const SessionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = mockData.sessions.filter(session =>
    session.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-6">
        <PageHeader title="All Sessions" description="Search, view, and manage all patient therapy sessions" />
        <div className="ml-auto flex gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Session
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
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