import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, ArrowRight, Clock, Users, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockData } from '@/data/mock-data';
import PatientList from '@/components/dashboard/patient-list';

const Dashboard = () => {
  const { user } = useAuth();
  const [activePatients, setActivePatients] = useState<number>(0);
  const [upcomingSessions, setUpcomingSessions] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<number>(0);
  
  // Simulate fetching dashboard stats
  useEffect(() => {
    // This would be replaced with actual API calls
    setActivePatients(mockData.patients.length);
    setUpcomingSessions(mockData.sessions.filter(s => s.status === 'scheduled').length);
    setRecentActivity(mockData.sessions.filter(s => 
      new Date(s.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length);
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
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              Next: Today at 2:00 PM
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Sessions in the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="space-y-4">
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
        
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>View all scheduled sessions for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.sessions
                  .filter(session => new Date(session.date).toDateString() === new Date().toDateString())
                  .map(session => {
                    const patient = mockData.patients.find(p => p.id === session.patientId);
                    return (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{patient?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'scheduled' ? 'secondary' : 'outline'
                          }>
                            {session.status}
                          </Badge>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/sessions/${session.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                
                {mockData.sessions.filter(
                  session => new Date(session.date).toDateString() === new Date().toDateString()
                ).length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">No sessions scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
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
                  .slice(0, 5)
                  .map(session => {
                    const patient = mockData.patients.find(p => p.id === session.patientId);
                    return (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{patient?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/sessions/${session.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
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