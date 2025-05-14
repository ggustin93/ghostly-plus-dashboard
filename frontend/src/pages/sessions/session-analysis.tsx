import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockData } from '@/data/mock-data';
import { Session } from '@/types/sessions';
import { Patient } from '@/types/patients';
import { Download, FileText, ArrowLeft, ClipboardList } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import EmgVisualization from '@/components/visualizations/emg-visualization';
import MuscleHeatmap from '@/components/visualizations/muscle-heatmap';

const SessionAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visualization');
  
  // Determine where the user came from (default to sessions page if not specified)
  const cameFromPatient = location.state?.from === 'patient';
  const backPath = cameFromPatient && patient?.id ? `/patients/${patient.id}` : '/sessions';
  const backLabel = cameFromPatient ? 'Patient Profile' : 'Sessions';
  
  useEffect(() => {
    // Simulating API call with mock data
    const fetchSession = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundSession = mockData.sessions.find(s => s.id === id);
      if (foundSession) {
        setSession(foundSession);
        
        // Find the associated patient
        const foundPatient = mockData.patients.find(p => p.id === foundSession.patientId);
        if (foundPatient) {
          setPatient(foundPatient);
        }
      }
      setLoading(false);
    };
    
    fetchSession();
  }, [id]);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        
        <Skeleton className="h-[500px]" />
      </div>
    );
  }
  
  if (!session || !patient) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Session not found</h2>
        <p className="text-muted-foreground">The session you're looking for doesn't exist or you don't have access</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with back button and action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-8 pl-0">
            <Link to={backPath}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-xs text-muted-foreground">Back to {backLabel}</span>
            </Link>
          </Button>
          <h2 className="text-xl font-bold sm:text-2xl">{session.type} Session</h2>
          <Badge variant={
            session.status === 'completed' ? 'default' :
            session.status === 'scheduled' ? 'secondary' :
            'outline'
          }>
            {session.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <div className="sm:hidden">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Session info cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Patient</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback>
                  {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{patient.name}</div>
                <Link 
                  to={`/patients/${patient.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">
                {new Date(session.date).toLocaleDateString()}
              </span>
              
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm">{session.duration} minutes</span>
              
              <span className="text-sm font-medium">Difficulty:</span>
              <span className="text-sm">Level {session.difficulty}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium">Score:</span>
              <span className="text-sm">{session.performance || 'N/A'}</span>
              
              <span className="text-sm font-medium">Completion:</span>
              <span className="text-sm">92%</span>
              
              <span className="text-sm font-medium">Peak EMG:</span>
              <span className="text-sm">138 μV</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabbed content area */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="overflow-auto">
          <TabsList className="inline-flex w-full justify-start sm:w-auto">
            <TabsTrigger value="visualization" className="flex items-center">
              <span className="hidden sm:inline">EMG Visualization</span>
              <span className="sm:hidden">EMG</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center">
              <span className="hidden sm:inline">Quadriceps Analysis</span>
              <span className="sm:hidden">Muscles</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center">
              <span className="hidden sm:inline">Comparison</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center">
              <ClipboardList className="mr-1 h-4 w-4 sm:hidden" />
              <span>Notes</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="visualization">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>EMG Signal Analysis</CardTitle>
              <CardDescription>Detailed view of muscle activation patterns</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[350px] sm:h-96">
                <EmgVisualization detailed groupType="ghostly" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>Quadriceps Analysis</CardTitle>
              <CardDescription>Visual analysis of quadriceps muscle metrics</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-center text-sm font-medium">Left Leg</h3>
                  <MuscleHeatmap side="left" measurementType="strength" />
                </div>
                <div>
                  <h3 className="mb-4 text-center text-sm font-medium">Right Leg</h3>
                  <MuscleHeatmap side="right" measurementType="strength" />
                </div>
              </div>
              <div className="mt-6 rounded-lg border bg-card p-4">
                <h4 className="mb-2 font-medium">Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Patient shows asymmetrical activation patterns with stronger engagement in the right leg. 
                  Improvements noted in the rectus femoris (23% increase) compared to previous sessions. 
                  Cross-sectional area measurements show a reduction in muscle atrophy. 
                  Recommended focus on left leg vastus medialis activation in future sessions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>Session Comparison</CardTitle>
              <CardDescription>Compare current session with previous performance</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-center text-sm font-medium">Current Session (June 15, 2025)</h3>
                  <div className="h-64">
                    <EmgVisualization simplified groupType="ghostly" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-center text-sm font-medium">Previous Session (June 10, 2025)</h3>
                  <div className="h-64">
                    <EmgVisualization simplified previous groupType="ghostly" />
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="mb-2 text-center font-medium">Peak Activation</h4>
                  <div className="flex items-end justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">138 μV</div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-muted-foreground">112 μV</div>
                      <div className="text-xs text-muted-foreground">Previous</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm text-primary">
                    +23% Improvement
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="mb-2 text-center font-medium">Sustained Contraction</h4>
                  <div className="flex items-end justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">18 sec</div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-muted-foreground">12 sec</div>
                      <div className="text-xs text-muted-foreground">Previous</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm text-primary">
                    +50% Improvement
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="mb-2 text-center font-medium">Leg Symmetry</h4>
                  <div className="flex items-end justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">72%</div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-muted-foreground">65%</div>
                      <div className="text-xs text-muted-foreground">Previous</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-sm text-primary">
                    +7% Improvement
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>Clinical observations and comments</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 flex flex-wrap justify-between gap-2">
                  <div className="font-medium">Therapist Notes</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Patient demonstrated improved quadriceps engagement during this session.
                  EMG recordings show increased activation in the vastus lateralis and rectus femoris
                  compared to the previous session. The patient reported less fatigue after the session
                  and expressed interest in continuing with the Ghostly app training program. 
                  Cross-sectional ultrasound measurements show a 5% increase in muscle mass compared to baseline.
                  Recommended to maintain current difficulty level but increase session duration 
                  by 5 minutes in the next session.
                </p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline">Edit Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionAnalysis;