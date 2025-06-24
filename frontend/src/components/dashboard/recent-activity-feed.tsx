import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, getAvatarColor, formatDate } from '@/lib/utils';
import { ChevronRight, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SessionActivity {
  id: string; // Session ID
  patientId: string;
  patientName: string;
  date: string;
  performance: number;
}

interface RecentActivityFeedProps {
  sessions: SessionActivity[];
}

const getPerformanceBadge = (performance: number) => {
  let badgeClass = 'bg-red-100 text-red-700 hover:bg-red-100/80';
  if (performance > 80) {
    badgeClass = 'bg-green-100 text-green-700 hover:bg-green-100/80';
  } else if (performance >= 60) {
    badgeClass = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80';
  }
  return <Badge className={badgeClass}>{performance}%</Badge>;
};

const SessionActivityItem = ({ session }: { session: SessionActivity }) => (
  <Link 
    to={`/sessions/${session.id}`} 
    className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
  >
    <div className="flex items-center gap-4">
      <Avatar className="h-9 w-9">
        <AvatarFallback style={getAvatarColor(session.patientId)}>
          {getInitials(session.patientName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-primary">
          {session.patientName}
        </p>
        <p className="text-xs text-muted-foreground">
          Session on {formatDate(session.date)}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {getPerformanceBadge(session.performance)}
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
);

export const RecentActivityFeed = ({ sessions }: RecentActivityFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              <CardTitle>Recent Session Activity</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              Patient sessions from the last 7 days
            </p>
          </div>
          <Button variant="link" asChild className="p-0 -mt-1 h-auto shrink-0">
            <Link to="/sessions">See all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {sessions.length > 0 ? (
          <div className="space-y-1">
            {sessions.map((session) => (
              <SessionActivityItem key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <p>No recent sessions to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 