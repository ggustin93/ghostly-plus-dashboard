import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Activity, Target } from 'lucide-react';
import { mockPatients } from '@/data/patients-data';
import { PriorityPatientList, type PatientAlert } from '@/components/dashboard/priority-patient-list';
import { RecentActivityFeed, type SessionActivity } from '@/components/dashboard/recent-activity-feed';

const priorityPatients: PatientAlert[] = [
  { 
    id: 'P004', 
    name: 'Thomas Rivera', 
    reason: 'Declining Progress', 
    details: 'Performance has dropped by 15% over the last 3 sessions.'
  },
  { 
    id: 'P008', 
    name: 'Arthur Lewis', 
    reason: 'Missed Sessions',
    details: 'Patient has missed 2 of the 5 scheduled sessions this week.' 
  },
  { 
    id: 'P007', 
    name: 'Brenda Lee', 
    reason: 'Low Performance',
    details: 'Session scores consistently below 50% target.'
  },
];

const recentActivities: SessionActivity[] = [
  { id: 'P009-S02', patientId: 'P009', patientName: 'Nancy Young', date: '2025-06-19', performance: 88 },
  { id: 'P007-S01', patientId: 'P007', patientName: 'Brenda Lee', date: '2025-06-19', performance: 85 },
  { id: 'P011-S01', patientId: 'P011', patientName: 'Patricia Hall', date: '2025-06-17', performance: 72 },
  { id: 'P006-S03', patientId: 'P006', patientName: 'George Miller', date: '2025-06-17', performance: 83 },
  { id: 'P005-S02', patientId: 'P005', patientName: 'Sarah Wilson', date: '2025-06-14', performance: 95 },
];

const Dashboard = () => {
  const [activePatients] = useState(mockPatients.filter(p => p.status === 'active').length);

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
  }, []);

  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight text-center">Welcome back, Dr. Johnson!</h2>

      {/* 3-card summary grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-col items-center text-center space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold">{activePatients}</div>
            <p className="text-xs text-muted-foreground">Total active patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col items-center text-center space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <CardTitle className="text-sm font-medium">Average Adherence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Up from 88% in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col items-center text-center space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-sm font-medium">Avg. Session Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Last 7 days (down from 81%)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-3" id="priority-patients">
          <PriorityPatientList patients={priorityPatients} />
        </div>
        <div className="lg:col-span-4">
          <RecentActivityFeed sessions={recentActivities} />
        </div>
      </div>

     
     
    </div>
  );
};

export default Dashboard;