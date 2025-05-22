import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Activity, ArrowRight } from 'lucide-react';
import { getAllSessions } from '@/data/sessions-data';
import { mockPatients } from '@/data/patients-data';
import PatientList from '@/components/dashboard/patient-list';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper function to get initials
const getInitials = (name: string) => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';
  return (nameParts[0][0] + (nameParts[nameParts.length - 1][0] || '')).toUpperCase();
};

// Color palette
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

// Helper function to get a color based on patient ID
const getAvatarColor = (id: string | undefined) => {
  if (!id) { return avatarColorPalette[0]; }
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const index = Math.abs(hash) % avatarColorPalette.length;
  return avatarColorPalette[index];
};

const Dashboard = () => {
  const [activePatients, setActivePatients] = useState<number>(0);
  const [upcomingSessionsCount, setUpcomingSessionsCount] = useState<number>(0);
  const [recentActivityCount, setRecentActivityCount] = useState<number>(0);
  const [patientsWithAlertsCount, setPatientsWithAlertsCount] = useState<number>(0);
  const [nextSessionPatientInfo, setNextSessionPatientInfo] = useState<string>('');
  const [upcomingSessionsTimeframeText, setUpcomingSessionsTimeframeText] = useState<string>('');

  useEffect(() => {
    const allSessions = getAllSessions();
    const allPatients = mockPatients;
    const today = new Date();

    // Active Patients
    setActivePatients(allPatients.filter(p => p.status === 'active').length);

    // Upcoming Sessions (next 7 days)
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const upcoming = allSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return s.status === 'scheduled' && sessionDate >= today && sessionDate <= sevenDaysFromNow;
    });
    setUpcomingSessionsCount(upcoming.length);
    setUpcomingSessionsTimeframeText('In the next 7 days');

    // Recent Activity (completed in last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    setRecentActivityCount(allSessions.filter(s => {
      const sessionDate = new Date(s.date);
      return s.status === 'completed' && sessionDate >= sevenDaysAgo && sessionDate <= today;
    }).length);

    // Patients with Alerts
    setPatientsWithAlertsCount(allPatients.filter(p => p.alerts && p.alerts.length > 0).length);

    // Next Session Patient
    const upcomingScheduledSessions = allSessions
      .filter(s => s.status === 'scheduled' && new Date(s.date).getTime() >= today.getTime())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcomingScheduledSessions.length > 0) {
      const nextSession = upcomingScheduledSessions[0];
      const patient = allPatients.find(p => p.id === nextSession.patientId);
      const nextSessionTime = new Date(nextSession.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nextSessionDate = new Date(nextSession.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
      setNextSessionPatientInfo(patient ? `${patient.name} on ${nextSessionDate} at ${nextSessionTime}` : `Next on ${nextSessionDate} at ${nextSessionTime}`);
    } else {
      setNextSessionPatientInfo('No upcoming sessions');
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-center md:items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatients}</div>
            <p className="text-xs text-muted-foreground">
              {patientsWithAlertsCount > 0 
                ? `${patientsWithAlertsCount} Patient${patientsWithAlertsCount > 1 ? 's' : ''} with Alert(s)` 
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
              <div className="text-2xl font-bold">{upcomingSessionsCount}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingSessionsCount > 0 ? `${nextSessionPatientInfo} (${upcomingSessionsTimeframeText})` : `No upcoming sessions (${upcomingSessionsTimeframeText})`}
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
              <div className="text-2xl font-bold">{recentActivityCount}</div>
              <p className="text-xs text-muted-foreground">
                View session insights
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <Tabs defaultValue="patients" className="w-full">
        <div className="flex w-full justify-center">
          <TabsList className="grid w-auto grid-cols-3 gap-1 rounded-lg border border-border bg-muted/40 p-1 shadow-sm">
            <TabsTrigger value="patients" className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none">
              <Users className="h-4 w-4" />
              <span>My Patients</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none">
              <Calendar className="h-4 w-4" />
              <span>Weekly Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-2 data-[state=active]:border-black data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-background/60 focus:outline-none">
              <Activity className="h-4 w-4" />
              <span>Recent Sessions</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="patients" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Manage your patients and their treatment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientList patients={mockPatients} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>A calendar view of this week's appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Weekly Calendar View - Rolling 7 Days */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 p-2 border rounded-md bg-muted/40">
                {(() => {
                  const today = new Date();
                  const days = [];
                  const allScheduledSessions = getAllSessions().filter(s => s.status === 'scheduled');

                  for (let i = 0; i < 7; i++) {
                    const dayDate = new Date(today);
                    dayDate.setDate(today.getDate() + i); // Changed to show today and next 6 days

                    const dayString = dayDate.toLocaleDateString([], { weekday: 'short' });
                    const dateString = dayDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
                    const isCurrentDay = dayDate.toDateString() === today.toDateString();
                    const isSunday = dayDate.getDay() === 0; // Check if it's Sunday

                    const sessionsOnThisDay = isSunday ? [] : allScheduledSessions // No sessions on Sunday
                      .filter(session => new Date(session.date).toDateString() === dayDate.toDateString())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    days.push(
                      <div 
                        key={`day-${i}`}
                        className={`p-3 rounded-md ${isCurrentDay ? 'bg-primary/10 border border-primary/30' : 'bg-background/50'} min-h-[150px]`}
                      >
                        <div className={`font-semibold text-center mb-2 pb-1 border-b ${isCurrentDay ? 'border-primary/30 text-primary' : 'border-border'}`}>
                          <p className="text-sm">{dayString}</p>
                          <p className="text-lg">{dateString.split(' ')[0]}</p> {/* Just the day number */}
                        </div>
                        <div className="space-y-2 overflow-y-auto max-h-[200px]">
                          {sessionsOnThisDay.length > 0 ? (
                            sessionsOnThisDay.map(session => {
                              const patient = mockPatients.find(p => p.id === session.patientId);
                              const sessionTime = new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const avatarStyle = getAvatarColor(patient?.id);
                              const initials = getInitials(patient?.name || '');
                              return (
                                <div key={session.id} className="flex items-center p-2 bg-card rounded shadow-sm text-xs">
                                  <Avatar className="h-6 w-6 mr-2 shrink-0">
                                    <AvatarFallback 
                                      style={avatarStyle}
                                      className="flex items-center justify-center h-full w-full rounded-full text-[10px] font-semibold"
                                    >
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-grow">
                                    {patient ? (
                                      <Link to={`/patients/${patient.id}`} className="hover:underline">
                                        <p className="font-medium">{patient.name}</p>
                                      </Link>
                                    ) : (
                                      <p className="font-medium">Unknown Patient</p>
                                    )}
                                    <p className="text-muted-foreground">{sessionTime}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-muted-foreground text-center pt-4">No sessions</p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return days;
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 5 completed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getAllSessions()
                  .filter(session => 
                    session.status === 'completed' && 
                    new Date(session.date).getTime() <= new Date().getTime()
                  )
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map(session => {
                    const patient = mockPatients.find(p => p.id === session.patientId);
                    const avatarStyle = getAvatarColor(patient?.id);
                    const initials = getInitials(patient?.name || '');
                    return (
                      <Link key={session.id} to={`/sessions/${session.id}`} className="block hover:bg-muted/80 rounded-md p-3 transition-colors">
                        <div className="flex items-center w-full">
                          <Avatar className="h-8 w-8 mr-3 shrink-0">
                            <AvatarFallback 
                              style={avatarStyle}
                              className="flex items-center justify-center h-full w-full rounded-full text-xs font-semibold"
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium mr-4">
                            {patient ? patient.name : 'Unknown Patient'}
                          </span>
                          <p className="text-xs text-muted-foreground ml-auto">
                            Completed on {new Date(session.date).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <ArrowRight className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                {getAllSessions().filter(s => s.status === 'completed').length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No completed sessions yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;