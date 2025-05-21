import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export function C3DUploadCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EMG Analysis</CardTitle>
        <CardDescription>Upload and analyze C3D files from GHOSTLY+ sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-6">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Upload C3D files to analyze EMG data from rehabilitation sessions
            </p>
            <Button asChild className="w-full">
              <Link to="/sessions/upload">
                Upload C3D File
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 