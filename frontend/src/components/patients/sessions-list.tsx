import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Session } from '@/types/sessions';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, Activity } from 'lucide-react';

interface SessionsListProps {
  sessions: Session[];
}

const SessionsList = ({ sessions }: SessionsListProps) => {
  const [sortBy, setSortBy] = useState<keyof Session>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });

  // Toggle sort
  const toggleSort = (field: keyof Session) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('date')}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('patientName')}
            >
              Patient {sortBy === 'patientName' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('type')}
            >
              Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('duration')}
            >
              Duration {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('difficulty')}
            >
              Difficulty {sortBy === 'difficulty' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('status')}
            >
              Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Performance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {new Date(session.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{session.patientName || session.patientId}</TableCell>
                <TableCell>{session.type}</TableCell>
                <TableCell>{session.duration} min</TableCell>
                <TableCell>Level {session.difficulty}</TableCell>
                <TableCell>
                  <Badge variant={
                    session.status === 'completed' ? 'default' :
                    session.status === 'scheduled' ? 'secondary' :
                    'outline'
                  }>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {session.performance ? (
                    <div className="flex items-center">
                      <Activity className="mr-1 h-4 w-4 text-primary" />
                      {session.performance}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                  >
                    <Link 
                      to={`/sessions/${session.id}`} 
                      state={session.linkState}
                    >
                      <EyeIcon className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No sessions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsList;