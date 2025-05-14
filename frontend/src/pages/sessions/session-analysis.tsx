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
import { Download, FileText, Calendar, ArrowLeft, Activity, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import EmgVisualization from '@/components/visualizations/emg-visualization';
import MuscleHeatmap from '@/components/visualizations/muscle-heatmap';

const SessionAnalysis = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Determine where the user came from (default to sessions page if not specified)
  const cameFromPatient = location.state?.from === 'patient';
  const backPath = cameFromPatient ? `/patients/${patient?.id}` : '/sessions';
  const backLabel = cameFromPatient ? 'Patient Profile' : 'Sessions';
  
  useEffect(() => {
    // Simulating API call with mock data
    const fetchSession = () => {
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
    return <div className="flex h-96 items-center justify-center">Loading session data...</div>;
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild className="pl-0">
            <Link to={backPath}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-xs text-muted-foreground">Back to {backLabel}</span>
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">{session.type} Session</h2>
          <Badge variant={
            session.status === 'completed' ? 'default' :
            session.status === 'scheduled' ? 'secondary' :
            'outline'
          }>
            {session.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patient</CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
      
      <Tabs defaultValue="visualization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visualization">EMG Visualization</TabsTrigger>
          <TabsTrigger value="heatmap">Muscle Heatmap</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="notes">Session Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>EMG Signal Analysis</CardTitle>
              <CardDescription>Detailed view of muscle activation patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <EmgVisualization detailed />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Muscle Activation Heatmap</CardTitle>
              <CardDescription>Visual representation of muscle engagement intensity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-center text-sm font-medium">Left Side</h3>
                  <MuscleHeatmap side="left" />
                </div>
                <div>
                  <h3 className="mb-4 text-center text-sm font-medium">Right Side</h3>
                  <MuscleHeatmap side="right" />
                </div>
              </div>
              <div className="mt-6 rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Patient shows asymmetrical activation patterns with stronger engagement on the 
                  right side. Biceps and deltoids show improved activation compared to previous 
                  sessions. Recommended focus on improving left side activation in future sessions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Session Comparison</CardTitle>
              <CardDescription>Compare current session with previous performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-center text-sm font-medium">Current Session (June 15, 2025)</h3>
                  <div className="h-64">
                    <EmgVisualization simplified />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-center text-sm font-medium">Previous Session (June 10, 2025)</h3>
                  <div className="h-64">
                    <EmgVisualization simplified previous />
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border p-4">
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
                
                <div className="rounded-lg border p-4">
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
                
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 text-center font-medium">Muscle Symmetry</h4>
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
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>Clinical observations and comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex justify-between">
                  <div className="font-medium">Therapist Notes</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Patient demonstrated improved engagement and motivation during this session.
                  EMG recordings show increased activation in the biceps and deltoids compared
                  to the previous session. The patient reported less fatigue after the session
                  and expressed interest in continuing with the program. Recommended to maintain
                  current difficulty level but increase session duration by 5 minutes in the next session.
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