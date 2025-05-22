import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { C3DUpload } from '@/components/c3d-upload/c3d-upload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"; 
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockData } from '@/data/mock-data'; 
import { C3DFile } from '@/data/c3d-files-data';
import { UploadCloud, ArrowUpDown, Search, Eye } from 'lucide-react'; 

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const getInitials = (name?: string) => {
  if (!name) return '??';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '?';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
};

const avatarColorPalette = [
  { backgroundColor: '#ef4444', color: '#ffffff' }, { backgroundColor: '#f97316', color: '#ffffff' }, 
  { backgroundColor: '#f59e0b', color: '#000000' }, { backgroundColor: '#eab308', color: '#000000' },
  { backgroundColor: '#84cc16', color: '#000000' }, { backgroundColor: '#22c55e', color: '#ffffff' }, 
  { backgroundColor: '#10b981', color: '#ffffff' }, { backgroundColor: '#14b8a6', color: '#ffffff' }, 
  { backgroundColor: '#06b6d4', color: '#000000' }, { backgroundColor: '#0ea5e9', color: '#ffffff' },
  { backgroundColor: '#3b82f6', color: '#ffffff' }, { backgroundColor: '#6366f1', color: '#ffffff' }, 
  { backgroundColor: '#8b5cf6', color: '#ffffff' }, { backgroundColor: '#a855f7', color: '#ffffff' }, 
  { backgroundColor: '#d946ef', color: '#ffffff' }, { backgroundColor: '#ec4899', color: '#ffffff' }, 
  { backgroundColor: '#f43f5e', color: '#ffffff' },
];

const getAvatarColor = (id?: string) => {
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

type SortableC3DFileKeys = keyof Pick<C3DFile, 'id' | 'patientName' | 'uploadDate' | 'gameType' | 'gameLevel' | 'gameScore'>;

const C3DPage = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortableC3DFileKeys>('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const allFiles = mockData.c3dFiles;

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = allFiles;

    if (patientSearchTerm) {
      filtered = filtered.filter(file => 
        file.patientName?.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        file.patientId.toLowerCase().includes(patientSearchTerm.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      let comparison = 0;

      if (sortBy === 'uploadDate') {
        comparison = new Date(valA as string).getTime() - new Date(valB as string).getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [allFiles, patientSearchTerm, sortBy, sortOrder]); 

  const toggleSort = (field: SortableC3DFileKeys) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const handleViewFile = (fileId: string) => console.log(`View C3D file details for: ${fileId}`);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">C3D File Explorer</h1>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <UploadCloud className="mr-2 h-4 w-4" />
          {showUploadForm ? 'Cancel Manual Upload' : 'Manual Upload'}
        </Button>
      </div>
      
      {showUploadForm && (
        <Card className="mb-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Manual C3D File Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              For backup purposes when automatic game upload fails.
            </p>
            <C3DUpload />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by patient name or ID..."
                className="pl-8 w-full"
                value={patientSearchTerm}
                onChange={(e) => setPatientSearchTerm(e.target.value)}
              />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => toggleSort('id')} className="cursor-pointer hover:bg-muted/50 text-left">
                  C3D File ID {sortBy === 'id' && <ArrowUpDown className="ml-1 h-3 w-3 inline" />}
                </TableHead>
                <TableHead onClick={() => toggleSort('patientName')} className="cursor-pointer hover:bg-muted/50 text-left">
                  Patient {sortBy === 'patientName' && <ArrowUpDown className="ml-1 h-3 w-3 inline" />}
                </TableHead>
                <TableHead onClick={() => toggleSort('uploadDate')} className="cursor-pointer hover:bg-muted/50 text-left">
                  Upload Date {sortBy === 'uploadDate' && <ArrowUpDown className="ml-1 h-3 w-3 inline" />}
                </TableHead>
                <TableHead onClick={() => toggleSort('gameType')} className="cursor-pointer hover:bg-muted/50 text-left">
                  Game Type {sortBy === 'gameType' && <ArrowUpDown className="ml-1 h-3 w-3 inline" />}
                </TableHead>
                <TableHead onClick={() => toggleSort('gameLevel')} className="cursor-pointer hover:bg-muted/50 text-left">
                  Level {sortBy === 'gameLevel' && <ArrowUpDown className="ml-1 h-3 w-3 inline" />}
                </TableHead>
                <TableHead onClick={() => toggleSort('gameScore')} className="cursor-pointer hover:bg-muted/50 text-left">
                  Score {sortBy === 'gameScore' && <ArrowUpDown className="ml-1 h-3 w-3 inline" />}
                </TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedFiles.length > 0 ? (
                filteredAndSortedFiles.map((file) => {
                  const avatarStyle = getAvatarColor(file.patientId);
                  return (
                    <TableRow key={file.id}>
                      <TableCell 
                        className="font-medium text-left hover:underline cursor-pointer"
                        onClick={() => handleViewFile(file.id)}
                        title={`View C3D file ${file.id}`}
                      >
                        {file.id}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback 
                              style={avatarStyle}
                              className="flex items-center justify-center h-full w-full rounded-full text-xs font-semibold"
                            >
                              {getInitials(file.patientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{file.patientName || 'N/A'}</div>
                            <div className="text-xs text-muted-foreground">ID: {file.patientId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">{formatDate(file.uploadDate)}</TableCell>
                      <TableCell className="text-left">{file.gameType || 'N/A'}</TableCell>
                      <TableCell className="text-left">{file.gameLevel !== undefined ? file.gameLevel : 'N/A'}</TableCell>
                      <TableCell className="text-left">{file.gameScore !== undefined ? file.gameScore : 'N/A'}</TableCell>
                      <TableCell className="text-left">
                        <Button variant="outline" size="sm" onClick={() => handleViewFile(file.id)} title={`View C3D file ${file.id}`}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No C3D files found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default C3DPage;