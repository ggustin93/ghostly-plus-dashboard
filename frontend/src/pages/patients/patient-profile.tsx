import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockData } from '@/data/mock-data';
import { Patient } from '@/types/patient';
import { RehabilitationSession } from '@/types/session';
import { Calendar, FilePlus, BarChart, FileEdit, ArrowLeft, Info } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import SessionsList from '@/components/patients/sessions-list';
import { getInitials, getAvatarColor, formatDate, cn, calculateAveragePerformance } from '@/lib/utils';
import ProgressTrackingCharts from '@/components/patients/progress-tracking-charts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const StatusBadge = ({ status }: { status?: string }) => {
  if (!status || status === 'N/A') {
    return <span className="text-sm text-muted-foreground">N/A</span>;
  }

  let badgeClass = '';
  switch (status.toLowerCase()) {
    case 'good':
    case 'high':
    case 'excellent':
    case 'improving':
      badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700';
      break;
    case 'fair':
    case 'medium':
      badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      break;
    case 'declining':
    case 'poor':
    case 'low':
      badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700';
      break;
    default:
      badgeClass = 'border-border';
  }

  return (
    <Badge variant="outline" className={cn('font-medium', badgeClass)}>
      {status}
    </Badge>
  );
};

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<RehabilitationSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating API call with mock data
    const fetchPatient = () => {
      const foundPatient = mockData.patients.find(p => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
        
        // Get patient sessions
        const patientSessions = mockData.rehabilitationSessions.filter(s => s.patientId === id);
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
  
  // --- Adherence Calculation ---
  // The total number of prescribed sessions according to the clinical protocol.
  const totalPrescribedSessions = 10; 
  // Since only performed sessions exist in the data, the count of records is the count of completed sessions.
  const completedSessionsCount = sessions.length; 
  const adherencePercentage = totalPrescribedSessions > 0 
    ? (completedSessionsCount / totalPrescribedSessions) * 100 
    : 0;
  
  const getAdherenceStatus = (percentage: number): string => {
    if (percentage >= 80) return 'High';
    if (percentage >= 50) return 'Medium';
    if (percentage > 0) return 'Low';
    return 'N/A';
  };

  // --- Compliance Calculation ---
  const complianceScores = sessions.map(s => calculateAveragePerformance(s.gameSessions));
  const averageCompliance = complianceScores.length > 0 ? complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length : 0;

  const getComplianceStatus = (score: number): string => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score > 0) return 'Fair';
    return 'N/A';
  };
  
  // --- Missed Sessions Calculation (Last 7 Days) ---
  const MOCK_TODAY = new Date('2025-06-25'); // Use a fixed date for consistent demo logic
  const sevenDaysAgo = new Date(MOCK_TODAY);
  sevenDaysAgo.setDate(MOCK_TODAY.getDate() - 7);

  const completedSessionsLastWeek = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    // A session is completed if its duration is greater than 0
    return sessionDate >= sevenDaysAgo && sessionDate <= MOCK_TODAY && s.duration > 0;
  }).length;
  
  const expectedSessionsLastWeek = 5;
  const missedSessions = patient.status === 'active' 
    ? Math.max(0, expectedSessionsLastWeek - completedSessionsLastWeek)
    : 0;

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
            <h1 className="text-2xl font-bold md:text-3xl mb-1">{patient.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
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
                {patient.admissionDate ? formatDate(patient.admissionDate) : 'N/A'}
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
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Treatment Summary</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs p-2 text-left text-sm">
                      <h4 className="mb-2 font-bold">GHOSTLY+ Protocol Details</h4>
                      <ul className="list-inside list-disc space-y-1">
                        <li>
                          <span className="font-semibold">Frequency:</span> Min. 5 sessions/week.
                        </li>
                        <li>
                          <span className="font-semibold">Exercise:</span> Isometric contractions @ 75% MVC.
                        </li>
                        <li>
                          <span className="font-semibold">BFR:</span> 50% arterial occlusion pressure.
                        </li>
                        <li>
                          <span className="font-semibold">Volume:</span> 3 sets of 12 repetitions.
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium">Sessions:</span>
              <span className="text-sm">{`${completedSessionsCount} / ${totalPrescribedSessions} completed`}</span>
              
              <span className="text-sm font-medium">Last Session:</span>
              <span className="text-sm">
                {patient.lastSession ? formatDate(patient.lastSession) : 'N/A'}
              </span>
              
              <span className="text-sm font-medium">Compliance:</span>
              <StatusBadge status={getComplianceStatus(averageCompliance)} />

              <span className="text-sm font-medium">Adherence:</span>
              <StatusBadge status={getAdherenceStatus(adherencePercentage)} />

              {missedSessions > 0 && (
                <>
                  <span className="text-sm font-medium text-destructive">Missed Sessions</span>
                  <span className="text-sm font-bold text-destructive">
                    {missedSessions} in last 7 days
                  </span>
                </>
              )}
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
            value="progress-tracking"
            className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
          >
            <BarChart className="mr-2 h-4 w-4" />
            <span>Progress Tracking</span>
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
              <SessionsList sessions={sessions} patients={mockData.patients} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress-tracking">
          <ProgressTrackingCharts patient={patient} />
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
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Session Progress Note</div>
                      <Badge variant="outline">Progress Note</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">June 15, 2025</div>
                  </div>
                  <p className="text-sm text-left">
                    Patient showed improved engagement with the game today. EMG readings indicate a 12% increase in right arm muscle activation compared to baseline. Continue with current difficulty setting.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">Initial Assessment</div>
                      <Badge variant="outline">Assessment</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">June 10, 2025</div>
                  </div>
                  <p className="text-sm text-left">
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