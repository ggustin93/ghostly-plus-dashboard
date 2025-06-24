import { Search } from 'lucide-react';
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
import { calculateAveragePerformance } from '@/lib/utils';

const SessionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { rehabilitationSessions, patients } = mockData;

  const completedSessions = rehabilitationSessions.filter(
    session => calculateAveragePerformance(session.gameSessions) > 0
  );

  const filteredSessions = completedSessions.filter(session => {
    const patient = patients.find(p => p.id === session.patientId);
    const patientName = patient ? patient.name : '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-6">
        <PageHeader title="All Sessions" description="Search, view, and manage all patient therapy sessions" />
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
            <SessionsList sessions={filteredSessions} patients={patients} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionsPage; 