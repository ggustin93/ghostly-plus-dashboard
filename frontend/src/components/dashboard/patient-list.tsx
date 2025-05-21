import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  EyeIcon, 
  Search, 
  ArrowUpDown 
} from 'lucide-react';
import { Patient } from '@/types/patients';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PatientListProps {
  patients: Patient[];
  showViewAllButton?: boolean;
}

// Helper function to get initials
const getInitials = (name: string) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
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

// Reverted helper function to get a color based on patient ID for random, distinct colors
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

const PatientList = ({ patients, showViewAllButton = true }: PatientListProps) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Patient>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.id.toLowerCase().includes(search.toLowerCase())
  );

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Handle potentially undefined string fields for sorting
    // Treat undefined as an empty string for comparison purposes, or handle as per desired logic
    if (typeof fieldA === 'string' || fieldA === undefined) {
      fieldA = fieldA || ''; // Fallback for undefined
    }
    if (typeof fieldB === 'string' || fieldB === undefined) {
      fieldB = fieldB || ''; // Fallback for undefined
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Toggle sort
  const toggleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {showViewAllButton && (
          <Link to="/patients">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <div className="pl-2.5">Avatar</div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('id' as keyof Patient)}>
                <div className="flex items-center gap-1 pl-2.5">
                  Patient ID
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1 pl-2.5">
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('studyArm' as keyof Patient)}>
                <div className="flex items-center gap-1 pl-2.5">
                  Study Arm
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('lastSession')}>
                <div className="flex items-center gap-1 pl-2.5">
                  Last Session
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPatients.length > 0 ? (
              sortedPatients.map(patient => {
                const avatarStyle = getAvatarColor(patient.id);
                return (
                  <TableRow key={patient.id}>
                    <TableCell className="pl-5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback 
                          style={avatarStyle}
                          className="flex items-center justify-center h-full w-full rounded-full text-xs font-semibold"
                        >
                          {getInitials(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="text-left pl-5 justify-center">{patient.id}</TableCell>
                    <TableCell className="text-left pl-5 justify-center">{patient.name}</TableCell>
                    <TableCell className="pl-5 text-left">
                      {patient.studyArm === 'Intervention' ? (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 border-blue-300 dark:border-blue-600">
                          Intervention
                        </Badge>
                      ) : patient.studyArm === 'Control' ? (
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100 border-orange-300 dark:border-orange-600">
                          Control
                        </Badge>
                      ) : patient.studyArm === 'Ghostly' ? (
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100 border-purple-300 dark:border-purple-600">
                          Ghostly
                        </Badge>
                      ) : (
                        <Badge variant={"outline"}>
                          {patient.studyArm || 'N/A'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pl-5 text-left">
                      {patient.lastSession ? new Date(patient.lastSession).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/patients/${patient.id}`}>
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
                <TableCell colSpan={6} className="h-16 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientList;