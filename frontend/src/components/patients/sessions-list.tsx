// It seems there might be an issue with your node_modules.
// Please try running `npm install @tanstack/react-table` to fix type declaration issues.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RehabilitationSession } from "@/types/session";
import { Patient } from '@/types/patient';
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
import { EyeIcon, ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  flexRender,
  Row,
  Column,
  HeaderGroup,
  Cell,
  Header,
} from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';

interface SessionsListProps {
  sessions: RehabilitationSession[];
  patients: Patient[];
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

export const sessionsColumns = (patients: Patient[]): ColumnDef<RehabilitationSession>[] => [
  {
    id: 'avatar',
    header: () => <div className="w-[50px] pl-4">Avatar</div>,
    cell: ({ row }: { row: Row<RehabilitationSession>}) => {
      const patientId = row.original.patientId;
      const patient = patients.find(p => p.id === patientId);
      const patientName = patient ? patient.name : 'Unknown';
      const avatarStyle = getAvatarColor(patientId);

      return (
        <div className="pl-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback style={avatarStyle} className="text-xs font-semibold">
              {getInitials(patientName)}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }: { column: Column<RehabilitationSession, unknown>}) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Session ID<ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: { row: Row<RehabilitationSession>}) => <div className="font-mono">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'date',
    header: ({ column }: { column: Column<RehabilitationSession, unknown>}) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date<ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }: { row: Row<RehabilitationSession>}) => <div className="font-medium">{formatDate(new Date(row.getValue('date')))}</div>,
  },
  {
    id: 'patient',
    header: ({ column }: { column: Column<RehabilitationSession, unknown>}) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Patient<ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row: RehabilitationSession) => {
        const patient = patients.find(p => p.id === row.patientId);
        return patient ? patient.name : 'Unknown';
    },
    cell: ({ row }: { row: Row<RehabilitationSession>}) => {
      const patientId = row.original.patientId;
      const patientName = row.getValue('patient') as string;

      return (
          <Link to={`/patients/${patientId}`} className="hover:underline">
            <span>{patientName}</span>
          </Link>
      );
    },
  },
  {
    id: 'bfr',
    header: 'Type',
    accessorFn: (row: RehabilitationSession) => row.gameSessions?.some(gs => gs.bfrParameters) || false,
    cell: ({ row }) => {
        const isBFR = row.getValue('bfr') as boolean;
        return (
            <Badge variant="static" className={isBFR ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}>
            {isBFR ? 'BFR' : 'Standard'}
            </Badge>
        );
    },
  },
  {
    id: 'performance',
    header: ({ column }: { column: Column<RehabilitationSession, unknown>}) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Performance<ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row: RehabilitationSession) => {
        const gameSessions = row.gameSessions;
        const scores = gameSessions?.map(gs => gs.statistics?.engagementScore).filter((score): score is number => score !== undefined);
        if (scores && scores.length > 0) {
            return scores.reduce((a, b) => a + b, 0) / scores.length;
        }
        return null;
    },
    cell: ({ row }) => {
        const performance = row.getValue('performance') as number | null;
        let badgeClass = 'bg-gray-100 text-gray-700 border-gray-300';
        if (performance !== null) {
          if (performance > 80) badgeClass = 'bg-green-100 text-green-700 border-green-300';
          else if (performance >= 60) badgeClass = 'bg-yellow-100 text-yellow-700 border-yellow-300';
          else badgeClass = 'bg-red-100 text-red-700 border-red-300';
        }
        return (
          <Badge variant="outline" className={`${badgeClass} dark:bg-opacity-30`}>
            {performance !== null ? `${Math.round(performance)}%` : 'N/A'}
          </Badge>
        );
      },
  },
  {
    id: 'actions',
    cell: ({ row }: { row: Row<RehabilitationSession>}) => (
      <div className="text-right">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/sessions/${row.original.id}`}>
            <EyeIcon className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      </div>
    ),
  },
];

const SessionsList: React.FC<SessionsListProps> = ({ sessions, patients }) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);

  const table = useReactTable({
    data: sessions,
    columns: sessionsColumns(patients),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<RehabilitationSession>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: Header<RehabilitationSession, unknown>) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: Row<RehabilitationSession>) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell: Cell<RehabilitationSession, unknown>) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={sessionsColumns(patients).length} className="h-24 text-center">
                No sessions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsList;