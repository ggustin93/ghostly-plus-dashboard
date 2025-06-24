import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from "@/components/ui/input";
import { EyeIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { c3dFiles, C3DFile } from '@/data/c3d-files-data';
import PageHeader from '@/components/ui/page-header';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

// Color palette for patient avatars
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

// Helper function to get initials
const getInitials = (name: string) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
};

// Helper function to get a color based on patient ID
const getAvatarColor = (id: string) => {
  if (!id) return avatarColorPalette[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const index = Math.abs(hash) % avatarColorPalette.length;
  return avatarColorPalette[index];
};

// View Button Component
const ViewButton: React.FC<{ file: C3DFile }> = ({ file }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Route to sessions without /analysis
    const sessionPath = `/sessions/${file.rehabilitationSessionId}`;
    
    const searchParams = new URLSearchParams({
      gameSessionId: file.gameSessionId
    });
    
    console.log('Navigating to:', `${sessionPath}?${searchParams.toString()}`);
    navigate(`${sessionPath}?${searchParams.toString()}`);
  };

  return (
    <Button variant="ghost" className="text-blue-600 hover:text-blue-700" size="sm" onClick={handleClick}>
      <EyeIcon className="mr-2 h-4 w-4" />
      Analyze
    </Button>
  );
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}> = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} files
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function C3DPage() {
  const [files, setFiles] = useState<C3DFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof C3DFile>('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;

  useEffect(() => {
    try {
      console.log('C3D Files loaded:', c3dFiles?.length || 0);
      setFiles(c3dFiles || []);
    } catch (error) {
      console.error('Error loading C3D files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply search filter
  const filteredFiles = files.filter(file => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      file.fileName?.toLowerCase().includes(searchLower) ||
      file.patientName?.toLowerCase().includes(searchLower) ||
      file.patientId?.toLowerCase().includes(searchLower) ||
      file.rehabilitationSessionId?.toLowerCase().includes(searchLower) ||
      file.gameType?.toLowerCase().includes(searchLower)
    );
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === 'uploadDate') {
      return sortOrder === 'asc' 
        ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
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

  // Calculate pagination
  const totalPages = Math.ceil(sortedFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = sortedFiles.slice(startIndex, endIndex);

  // Toggle sort
  const toggleSort = (field: keyof C3DFile) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Count files (simplified without status counts)
  const totalFiles = files.length;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading C3D files...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="C3D Files"
        description="Manage and analyze C3D motion capture files from rehabilitation sessions"
      />
      <Card>
        <CardHeader>
          
        </CardHeader>
        <CardContent>
          
      {/* Search Bar */}
      <div className="flex justify-start">
        <div className="relative w-80 mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files, patients, sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer w-[200px]"
                onClick={() => toggleSort('fileName')}
              >
                <div className="flex items-center gap-1 pl-2.5">
                  File Name {sortBy === 'fileName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer w-[180px]"
                onClick={() => toggleSort('patientName')}
              >
                <div className="flex items-center gap-1 pl-5">
                  Patient {sortBy === 'patientName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('rehabilitationSessionId')}
              >
                <div className="flex items-center gap-1 pl-5">
                  Session {sortBy === 'rehabilitationSessionId' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('gameType')}
              >
                <div className="flex items-center gap-1 pl-5">
                  Game Type {sortBy === 'gameType' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => toggleSort('uploadDate')}
              >
                <div className="flex items-center gap-1 pl-5">
                  Upload Date {sortBy === 'uploadDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFiles.length > 0 ? (
              currentFiles.map((file) => {
                const avatarStyle = getAvatarColor(file.patientId);
                const patientName = file.patientName || file.patientId;
                
                return (
                  <TableRow key={file.id}>
                    <TableCell className="pl-5 text-left">
                      <span className="text-blue-600 hover:underline cursor-pointer font-mono text-sm">
                        {file.fileName}
                      </span>
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
                        <div>
                          <div className="font-medium">{patientName}</div>
                          <div className="text-sm text-muted-foreground">{file.patientId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pl-5">
                      <div>
                        <div className="text-sm font-medium">{file.rehabilitationSessionId}</div>
                        <div className="text-xs text-muted-foreground">
                          Round {file.gameSessionId?.split('-').pop() || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{file.gameType || 'Unknown'}</span>
                        {file.gameLevel && (
                          <Badge variant="static" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                            Level {file.gameLevel}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pl-5">
                      {formatDate(file.uploadDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ViewButton file={file} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No C3D files found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={sortedFiles.length}
        />
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
          <div>Files loaded: {totalFiles}</div>
          <div>Filtered: {filteredFiles.length}, Current page: {currentPage}/{totalPages}</div>
          <div>Search term: "{searchTerm}"</div>
        </div>
      )}
    
        </CardContent>
      </Card>
    </div>
  );
}