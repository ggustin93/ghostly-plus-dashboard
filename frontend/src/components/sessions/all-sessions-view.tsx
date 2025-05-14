import { useState } from 'react';
import { Session } from '@/types/sessions';
import SessionsList from '@/components/patients/sessions-list';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AllSessionsViewProps {
  allSessions: Session[];
}

const AllSessionsView = ({ allSessions }: AllSessionsViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = allSessions.filter(session =>
    session.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
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
      <SessionsList sessions={filteredSessions} />
    </div>
  );
};

export default AllSessionsView; 