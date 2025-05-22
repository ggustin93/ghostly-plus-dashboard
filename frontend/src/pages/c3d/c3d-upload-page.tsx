import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { C3DUpload } from '@/components/c3d-upload/c3d-upload';
import { EMGAnalysisDisplay } from '@/components/c3d-upload/emg-analysis-display';
import { EMGAnalysisResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function C3DUploadPage() {
  const { patientId } = useParams<{ patientId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisResult, setAnalysisResult] = useState<EMGAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a unique session ID if needed
  const sessionId = `session_${Date.now()}`;
  
  const handleUploadSuccess = (result: EMGAnalysisResult) => {
    setAnalysisResult(result);
    setActiveTab('results');
    toast({
      title: 'Upload Successful',
      description: 'C3D file has been processed successfully.',
    });
  };
  
  const handleUploadError = (error: Error) => {
    setError(error.message);
    toast({
      title: 'Upload Failed',
      description: error.message,
      variant: 'destructive',
    });
  };
  
  const handleExport = () => {
    if (!analysisResult) return;
    
    // Create a JSON blob and download it
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghostly_analysis_${analysisResult.file_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Analysis data has been exported as JSON.',
    });
  };
  
  const handleGenerateReport = () => {
    toast({
      title: 'Generating Report',
      description: 'This feature will be available in a future update.',
    });
  };
  
  const handleBackClick = () => {
    if (patientId) {
      navigate(`/patients/${patientId}`);
    } else {
      navigate('/sessions');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBackClick} className="h-8 pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-xs text-muted-foreground">
              Back to {patientId ? 'Patient Profile' : 'Sessions'}
            </span>
          </Button>
          <h2 className="text-xl font-bold sm:text-2xl">C3D Analysis</h2>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <C3DUpload
            patientId={patientId}
            sessionId={sessionId}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          {analysisResult ? (
            <EMGAnalysisDisplay
              result={analysisResult}
              onExport={handleExport}
              onGenerateReport={handleGenerateReport}
            />
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Upload a C3D file to see results</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 