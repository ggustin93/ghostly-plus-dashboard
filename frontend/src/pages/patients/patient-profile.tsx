import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockData } from '@/data/mock-data';
import { Patient } from '@/types/patients';
import { Session } from '@/types/sessions';
import { Activity, Calendar, FilePlus, History, ListChecks, Users, BarChart, Brain, FileEdit, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import EmgVisualization from '@/components/visualizations/emg-visualization';
import TreatmentTimeline from '@/components/patients/treatment-timeline';
import SessionsList from '@/components/patients/sessions-list';
import TreatmentConfig from '@/pages/treatments/treatment-config';

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API call with mock data
    const fetchPatient = () => {
      const foundPatient = mockData.patients.find(p => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
        
        // Get patient sessions
        const patientSessions = mockData.sessions.filter(s => s.patientId === id);
        setSessions(patientSessions);
      }
      setLoading(false);
    };
    
    fetchPatient();
  }, [id]);
  
  if (loading) {
    return <div className="flex h-96 items-center justify-center">Loading patient data...</div>;
  }
  
  if (!patient) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Patient not found</h2>
        <p className="text-muted-foreground">The patient you're looking for doesn't exist or you don't have access</p>
        <Button asChild className="mt-4">
          <Link to="/patients">View All Patients</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-start">
        <Button variant="ghost" size="sm" asChild className="pl-0">
          <Link to="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-xs text-muted-foreground">Back</span>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col justify-center sm:flex-row sm:items-center">
        <div className="flex items-center space-x-4 mx-auto sm:mx-0">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="text-lg">
              {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold md:text-3xl">{patient.name}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant={
                patient.status === 'active' ? 'default' :
                patient.status === 'inactive' ? 'secondary' :
                'outline'
              }>
                {patient.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ID: {patient.id}
              </span>
            </div>
          </div>
        </div>
        
     
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Demographics</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="inline-flex items-center justify-center">
                <FileEdit className="h-5 w-5" />
              </span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium">Age:</span>
              <span className="text-sm">{patient.age}</span>
              
              <span className="text-sm font-medium">Gender:</span>
              <span className="text-sm">{patient.gender}</span>
              
              <span className="text-sm font-medium">Room:</span>
              <span className="text-sm">{patient.room || 'N/A'}</span>
              
              <span className="text-sm font-medium">Admission:</span>
              <span className="text-sm">
                {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Medical Info</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="inline-flex items-center justify-center">
                <FileEdit className="h-5 w-5" />
              </span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium">Diagnosis:</span>
              <span className="text-sm">{patient.diagnosis || 'N/A'}</span>
              
              <span className="text-sm font-medium">Mobility:</span>
              <span className="text-sm">{patient.mobility || 'N/A'}</span>
              
              <span className="text-sm font-medium">Cognitive:</span>
              <span className="text-sm">{patient.cognitiveStatus || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Treatment Summary</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="inline-flex items-center justify-center">
                <FileEdit className="h-5 w-5" />
              </span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium">Sessions:</span>
              <span className="text-sm">{sessions.length}</span>
              
              <span className="text-sm font-medium">Last Session:</span>
              <span className="text-sm">
                {patient.lastSession ? new Date(patient.lastSession).toLocaleDateString() : 'N/A'}
              </span>
              
              <span className="text-sm font-medium">Compliance:</span>
              <span className="text-sm">{patient.compliance || 'N/A'}</span>
              
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm">{patient.progress || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="notes" className="hidden md:block">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent EMG Activity</CardTitle>
                <CardDescription>Last 30 days muscle activity</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <EmgVisualization simplified />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Treatment Timeline</CardTitle>
                <CardDescription>Recent treatment sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <TreatmentTimeline sessions={sessions.slice(0, 5)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-left text-xl py-1">Session History</CardTitle>
                <CardDescription>All therapy sessions and outcomes</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link to="/sessions/new">
                  <Calendar className="mr-2 h-4 w-4" />
                  New Session
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <SessionsList sessions={sessions.map(session => ({
                ...session,
                linkState: { from: 'patient' }
              }))} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-left text-xl py-1">Treatment Plan</CardTitle>
                <CardDescription>Current treatment configuration and goals</CardDescription>
              </div>
              <div className="flex space-x-2">
            
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/reports/progress?patientId=${patient.id}`}>
                    <BarChart className="mr-2 h-4 w-4" />
                    View Progress
                  </Link>
                </Button>
                <Button size="sm" variant="default" asChild>
                  <Link to={`/treatments/configure/${patient.id}`}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Edit treatment
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <TreatmentConfig patientId={patient.id} isEmbedded={true} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-left text-xl py-1">Clinical Notes</CardTitle>
                <CardDescription>Treatment notes and observations</CardDescription>
              </div>
              <Button size="sm">
                <FilePlus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex justify-between">
                    <div className="font-medium">Session Progress Note</div>
                    <div className="text-sm text-muted-foreground">June 15, 2025</div>
                  </div>
                  <p className="text-sm">
                    Patient showed improved engagement with the game today. EMG readings indicate a 12% increase in right arm muscle activation compared to baseline. Continue with current difficulty setting.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex justify-between">
                    <div className="font-medium">Initial Assessment</div>
                    <div className="text-sm text-muted-foreground">June 10, 2025</div>
                  </div>
                  <p className="text-sm">
                    Patient admitted with significant muscle weakness following extended bed rest. Baseline EMG measurements established today. Starting with low difficulty level to build confidence and establish proper movement patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientProfile;