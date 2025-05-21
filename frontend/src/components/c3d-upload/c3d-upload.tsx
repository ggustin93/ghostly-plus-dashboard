import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { ghostlyApi, EMGAnalysisResult } from '@/lib/api';

interface C3DUploadProps {
  patientId?: string;
  sessionId?: string;
  userId?: string;
  onUploadSuccess?: (result: EMGAnalysisResult) => void;
  onUploadError?: (error: Error) => void;
}

export function C3DUpload({
  patientId,
  sessionId,
  userId,
  onUploadSuccess,
  onUploadError
}: C3DUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [thresholdFactor, setThresholdFactor] = useState(0.3);
  const [minDurationMs, setMinDurationMs] = useState(50);
  const [smoothingWindow, setSmoothingWindow] = useState(25);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.c3d')) {
        setError('Please select a valid C3D file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await ghostlyApi.uploadC3DFile(file, {
        patient_id: patientId,
        session_id: sessionId,
        user_id: userId,
        threshold_factor: thresholdFactor,
        min_duration_ms: minDurationMs,
        smoothing_window: smoothingWindow
      });
      
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      if (onUploadError && err instanceof Error) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload C3D File</CardTitle>
        <CardDescription>
          Upload a C3D file from the GHOSTLY rehabilitation game for EMG analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="c3d-file">C3D File</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="c3d-file"
              type="file"
              accept=".c3d"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={handleBrowseClick}
              className="flex-1"
            >
              {file ? file.name : 'Browse...'}
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Button 
          variant="link" 
          className="h-auto p-0 text-xs"
          onClick={() => setAdvancedOptions(!advancedOptions)}
        >
          {advancedOptions ? 'Hide advanced options' : 'Show advanced options'}
        </Button>
        
        {advancedOptions && (
          <div className="space-y-4 rounded-md border p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="threshold-factor">Threshold Factor: {thresholdFactor}</Label>
                <span className="text-xs text-muted-foreground">
                  Factor of max amplitude (0.1-0.9)
                </span>
              </div>
              <Slider
                id="threshold-factor"
                min={0.1}
                max={0.9}
                step={0.05}
                value={[thresholdFactor]}
                onValueChange={(values) => setThresholdFactor(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="min-duration">Min Duration: {minDurationMs}ms</Label>
                <span className="text-xs text-muted-foreground">
                  Minimum contraction duration (10-200ms)
                </span>
              </div>
              <Slider
                id="min-duration"
                min={10}
                max={200}
                step={5}
                value={[minDurationMs]}
                onValueChange={(values) => setMinDurationMs(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="smoothing-window">Smoothing Window: {smoothingWindow}</Label>
                <span className="text-xs text-muted-foreground">
                  Signal smoothing window size (0-100)
                </span>
              </div>
              <Slider
                id="smoothing-window"
                min={0}
                max={100}
                step={5}
                value={[smoothingWindow]}
                onValueChange={(values) => setSmoothingWindow(values[0])}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Supported format: C3D</p>
        <p>Max file size: 50MB</p>
      </CardFooter>
    </Card>
  );
} 