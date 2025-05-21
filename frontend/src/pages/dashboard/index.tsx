import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ArrowRight, Clock, Users, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockData } from '@/data/mock-data';
import PatientList from '@/components/dashboard/patient-list';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper function to get initials (copied from patient-list.tsx)
const getInitials = (name: string) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
};

// Color palette (copied from patient-list.tsx)
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

// Helper function to get a color based on patient ID (copied from patient-list.tsx)
const getAvatarColor = (id: string | undefined) => { // Added undefined check for id
  if (!id) { 
    return avatarColorPalette[0]; // Default color if id is not provided
  }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % avatarColorPalette.length;
  return avatarColorPalette[index];
};

const Dashboard = () => {
  const [activePatients, setActivePatients] = useState<number>(0);
  const [upcomingSessions, setUpcomingSessions] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<number>(0);
  const [patientsWithAlerts, setPatientsWithAlerts] = useState<number>(0);
  const [nextSessionPatient, setNextSessionPatient] = useState<string>('');
  
  // Simulate fetching dashboard stats
  useEffect(() => {
    // This would be replaced with actual API calls
    setActivePatients(mockData.patients.length);
    setUpcomingSessions(mockData.sessions.filter(s => s.status === 'scheduled').length);
    setRecentActivity(mockData.sessions.filter(s => 
      new Date(s.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && s.status === 'completed'
    ).length);

    // Simulate patients with alerts
    const patientsWithAlertsCount = mockData.patients.filter(p => 
      Object.prototype.hasOwnProperty.call(p, 'alerts') && (p as { alerts?: number }).alerts && (p as { alerts?: number }).alerts! > 0
    ).length;
    setPatientsWithAlerts(patientsWithAlertsCount);

    // Simulate next session patient
    const upcomingScheduledSessions = mockData.sessions
      .filter(s => s.status === 'scheduled' && new Date(s.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcomingScheduledSessions.length > 0) {
      const nextSession = upcomingScheduledSessions[0];
      const patient = mockData.patients.find(p => p.id === nextSession.patientId);
      const nextSessionTime = new Date(nextSession.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setNextSessionPatient(patient ? `${patient.name} at ${nextSessionTime}` : `Next at ${nextSessionTime}`);
    } else {
      setNextSessionPatient('No upcoming sessions');
    }
    
    // Placeholder for engagement/adherence logic if needed in the future

  }, []);
  
  return (
    <div className="space-y-6">
      {/* Centered Dashboard Title */}
      <div className="flex justify-center md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h2>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatients}</div>
            <p className="text-xs text-muted-foreground">
              {patientsWithAlerts > 0 
                ? `${patientsWithAlerts} Patient${patientsWithAlerts > 1 ? 's' : ''} with Alert(s)` 
                : 'No patients with alerts'}
            </p>
          </CardContent>
        </Card>
        
        <Link to="/sessions?filter=upcoming" className="hover:shadow-lg transition-shadow rounded-lg">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingSessions}</div>
              <p className="text-xs text-muted-foreground">
                {nextSessionPatient}
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/sessions?filter=recent7days" className="hover:shadow-lg transition-shadow rounded-lg">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions (Last 7d)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                View session insights
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Quick Actions */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/sessions/new" className="hover:shadow-lg transition-shadow rounded-lg block">
          <Card className="h-full flex flex-row items-center p-4">
            <div className="mr-4 flex-shrink-0">
              <CalendarPlus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-md font-medium mb-1">Schedule New Session</CardTitle>
              <CardDescription className="text-xs">Plan a new rehabilitation session</CardDescription>
            </div>
          </Card>
        </Link>

        <Link to="/patients/new" className="hover:shadow-lg transition-shadow rounded-lg block">
          <Card className="h-full flex flex-row items-center p-4">
            <div className="mr-4 flex-shrink-0">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-md font-medium mb-1">Add New Patient</CardTitle>
              <CardDescription className="text-xs">Register a new patient</CardDescription>
            </div>
          </Card>
        </Link> 
        
        {/* Add more action cards here as needed
      </div> */}
      
      <Tabs defaultValue="patients" className="w-full">
        <div className="flex w-full justify-center">
          <TabsList className="grid w-auto grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1 shadow-sm">
            <TabsTrigger 
              value="patients" 
              className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
            >
              <Users className="h-4 w-4" />
              <span>My Patients</span>
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
            >
              <Calendar className="h-4 w-4" />
              <span>Today's Schedule</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none"
            >
              <Activity className="h-4 w-4" />
              <span>Recent Sessions</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="patients" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                Manage your patients and their treatment plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientList patients={mockData.patients} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>A chronological view of today's appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 border rounded-md p-2 bg-muted/40">
                {(() => {
                  const timeSlots = [];
                  const hoursToDisplay = 12; // e.g., 8 AM to 7:59 PM (for 8-18h range)
                  const startHour = 8;

                  const todaySessions = mockData.sessions
                    .filter(session => new Date(session.date).toDateString() === new Date().toDateString())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                  for (let i = 0; i < hoursToDisplay; i++) {
                    const currentHour = startHour + i;
                    const hourString = `${currentHour.toString().padStart(2, '0')}:00`;
                    
                    const sessionsInThisHour = todaySessions.filter(session => {
                      const sessionDate = new Date(session.date);
                      return sessionDate.getHours() === currentHour;
                    });

                    timeSlots.push(
                      <div key={`timeslot-${currentHour}`} className="flex items-start py-3 border-b last:border-b-0">
                        <div className="w-20 text-sm text-muted-foreground pr-2 text-right shrink-0 flex items-center justify-end">
                          <Clock className="h-4 w-4 mr-1" />
                          {hourString}
                        </div>
                        <div className="flex-grow pl-3 border-l">
                          {sessionsInThisHour.length > 0 ? (
                            sessionsInThisHour.map(session => {
                              const patient = mockData.patients.find(p => p.id === session.patientId);
                              const sessionTime = new Date(session.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              });
                              const avatarStyle = getAvatarColor(patient?.id);
                              const initials = getInitials(patient?.name || '');

                              return (
                                <div key={session.id} className="mb-2 last:mb-0 px-3 py-2 bg-background rounded-md shadow-sm border border-border hover:shadow-md transition-shadow">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center flex-grow">
                                      {patient && (
                                        <Avatar className="h-8 w-8 mr-3">
                                          <AvatarFallback 
                                            style={avatarStyle}
                                            className="flex items-center justify-center h-full w-full rounded-full text-xs font-semibold"
                                          >
                                            {initials}
                                          </AvatarFallback>
                                        </Avatar>
                                      )}
                                      <div className="flex flex-col justify-center">
                                        <p className="font-semibold text-foreground">
                                          <Link to={`/patients/${patient?.id}`} className="hover:underline">
                                            {patient?.name || 'Unknown Patient'}
                                          </Link>
                                        </p>
                                        {/* Group Patient ID and BFR badge horizontally */}
                                        <div className="flex items-center space-x-2 mt-0.5"> {/* Adjusted for horizontal layout */}
                                          {patient && <p className="text-xs text-muted-foreground">{patient.id}</p>}
                                          {session.isBFR ? (
                                            <Badge className="bg-destructive/80 text-destructive-foreground border-destructive text-xs">
                                              BFR
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="text-xs">
                                              Standard
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-2 shrink-0">
                                      <p className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">{sessionTime}</p>
                                      <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                        <Link to={`/sessions/${String(session.id)}`} title="View Session Details">
                                          <ArrowRight className="h-4 w-4" />
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="h-10 flex items-center"> {/* Placeholder for empty hour slot */}
                              <p className="text-xs text-muted-foreground italic pl-2"></p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  if (todaySessions.length === 0) {
                    return (
                      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">No sessions scheduled for today</p>
                      </div>
                    );
                  }
                  return timeSlots;
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>View recently completed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.sessions
                  .filter(session => 
                    session.status === 'completed' && 
                    new Date(session.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
                  )
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map(session => {
                    const patient = mockData.patients.find(p => p.id === session.patientId);
                    const avatarStyle = getAvatarColor(patient?.id);
                    const initials = getInitials(patient?.name || '');
                    return (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-3 flex-grow">
                          {patient && (
                            <Avatar className="h-10 w-10">
                              <AvatarFallback 
                                style={avatarStyle}
                                className="flex items-center justify-center h-full w-full rounded-full text-sm font-semibold"
                              >
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="font-medium text-foreground">
                              <Link to={`/patients/${patient?.id}`} className="hover:underline">
                                {patient?.name || 'Unknown Patient'}
                              </Link>
                            </p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              {patient && <p className="text-xs text-muted-foreground">{patient.id}</p>}
                              {session.isBFR ? (
                                <Badge className="bg-destructive/80 text-destructive-foreground border-destructive text-xs">
                                  BFR
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Standard
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <p className="text-sm font-medium text-foreground/90">
                            {new Date(session.date).toLocaleDateString([], {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                            <Link to={`/sessions/${String(session.id)}`} title="View Session Details">
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;