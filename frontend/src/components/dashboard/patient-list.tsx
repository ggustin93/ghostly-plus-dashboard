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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PatientListProps {
  patients: Patient[];
  showViewAllButton?: boolean;
}

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
              <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1 pl-2.5">
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('status')}>
                <div className="flex items-center gap-1 pl-2.5">
                  Status
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
              sortedPatients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell className="pl-5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>
                        {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-left pl-5 justify-center">{patient.name}</TableCell>
                  <TableCell className="pl-5 text-left">
                    <Badge variant={
                      patient.status === 'active' ? 'default' :
                      patient.status === 'inactive' ? 'secondary' :
                      'outline'
                    }>
                      {patient.status}
                    </Badge>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-16 text-center">
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