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
import { EyeIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SessionsListProps {
  sessions: Session[];
}

// Helper function to get initials
const getInitials = (name: string) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
};

// Helper function to format date only
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString()
  };
};

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

// Helper function to get a color based on patient ID for random, distinct colors
const getAvatarColor = (id: string) => {
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
              className="cursor-pointer w-[120px]"
              onClick={() => toggleSort('id')}
            >
              <div className="flex items-center gap-1 pl-2.5">
                Session ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('status')}
            >
              <div className="flex items-center gap-1 pl-5">
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('date')}
            >
              <div className="flex items-center gap-1 pl-5">
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer w-[200px]"
              onClick={() => toggleSort('patientName')}
            >
              <div className="flex items-center gap-1 pl-5">
                Patient {sortBy === 'patientName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('isBFR')}
            >
              <div className="flex items-center gap-1 pl-8">
                BFR {sortBy === 'isBFR' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => {
              const avatarStyle = getAvatarColor(session.patientId);
              const patientName = session.patientName || session.patientId;
              const { date } = formatDateTime(session.date);
              return (
                <TableRow key={session.id}>
                  <TableCell className="pl-5 text-left">
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {session.id}
                    </span>
                  </TableCell>
                  <TableCell className="pl-5">
                    {session.status === 'completed' ? (
                      <Badge variant="static" className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 border-green-300 dark:border-green-600">
                        Completed
                      </Badge>
                    ) : session.status === 'scheduled' ? (
                      <Badge variant="static" className="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 border-blue-300 dark:border-blue-600">
                        Scheduled
                      </Badge>
                    ) : (
                      <Badge variant="static" className="bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 border-red-300 dark:border-red-600">
                        Cancelled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="pl-5">
                    {date}
                  </TableCell>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback 
                          style={avatarStyle}
                          className="flex items-center justify-center h-full w-full rounded-full text-xs font-semibold"
                        >
                          {getInitials(patientName)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pl-5">
                    {session.isBFR ? (
                      <Badge variant="static" className="bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100 border-purple-300 dark:border-purple-600">
                        BFR
                      </Badge>
                    ) : (
                      <Badge variant="static" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                        Standard
                      </Badge>
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
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
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