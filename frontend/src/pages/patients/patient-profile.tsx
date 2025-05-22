import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockData } from '@/data/mock-data';
import { Patient } from '@/types/patient';
import { SessionListItem } from '@/types/session';
import { Calendar, FilePlus, BarChart, FileEdit, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SessionsList from '@/components/patients/sessions-list';
import ClinicalAssessments from '@/components/patients/clinical-assessments';
import { getInitials, getAvatarColor } from '@/lib/utils';

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
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
  
  const avatarStyle = getAvatarColor(patient.id);
  
  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-start">
        <Button variant="ghost" size="sm" asChild className="pl-0">
          <Link to="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-xs text-muted-foreground">All Patients</span>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div className="flex items-center space-x-4 mx-auto sm:mx-0">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback 
              style={avatarStyle}
              className="flex items-center justify-center h-full w-full text-lg font-semibold"
            >
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold md:text-3xl">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {patient.studyArm === 'Intervention' ? (
                <Badge variant="static" className="bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 border-blue-300 dark:border-blue-600">
                  Intervention
                </Badge>
              ) : patient.studyArm === 'Control' ? (
                <Badge variant="static" className="bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100 border-orange-300 dark:border-orange-600">
                  Control
                </Badge>
              ) : patient.studyArm === 'Ghostly' ? (
                <Badge variant="static" className="bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100 border-purple-300 dark:border-purple-600">
                  Ghostly
                </Badge>
              ) : (
                <Badge variant="static" className="text-foreground border-foreground">
                  {patient.studyArm || 'N/A'}
                </Badge>
              )}
              
              {patient.status === 'active' ? (
                <Badge variant="static" className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 border-green-300 dark:border-green-600">
                  Active
                </Badge>
              ) : patient.status === 'inactive' ? (
                <Badge variant="static" className="bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 border-red-300 dark:border-red-600">
                  Dropped Out
                </Badge>
              ) : (
                <Badge variant="static" className="text-foreground border-foreground">
                  {patient.status || 'Unknown'}
                </Badge>
              )}
              
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
      
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-auto grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1 shadow-sm">
          <TabsTrigger 
            value="sessions" 
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
          >
            <Calendar className="h-4 w-4" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger 
            value="clinical-assessments" 
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
          >
            <FileEdit className="h-4 w-4" />
            <span>Clinical Assessments</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
          >
            <FilePlus className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
        </TabsList>
        
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
        
        <TabsContent value="clinical-assessments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-left text-xl py-1">Clinical Assessments</CardTitle>
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
                    <FilePlus className="mr-2 h-4 w-4" />
                    Add Assessment
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ClinicalAssessments patientId={patient.id} isEmbedded={true} />
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