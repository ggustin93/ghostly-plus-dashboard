import React from 'react';
import { SessionListItem } from '@/types/session';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/lib/utils';

interface TreatmentTimelineProps {
  sessions: SessionListItem[];
}

const TreatmentTimeline: React.FC<TreatmentTimelineProps> = ({ sessions }) => {
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Treatment Timeline</h3>
        {sortedSessions.length > 0 ? (
          <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-border">
            {sortedSessions.map((session, i) => (
              <div key={session.id} className="relative flex items-start pb-8">
                {/* Line connecting dots - remove for last item */}
                {i < sortedSessions.length - 1 && (
                  <div className="absolute left-4 top-5 -ml-px h-full w-0.5 bg-gray-300 dark:bg-gray-700" />
                )}
                <div className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between bg-card p-3">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        session.status === 'completed' 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        <Brain className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {session.type} Session
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(session.date)}
                        </div>
                      </div>
                    </div>
                    <Link to={`/sessions/${session.id}`}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </div>
                  <div className="border-t bg-card p-3 pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-muted-foreground">{session.duration} min</div>
                      </div>
                      <div>
                        <div className="font-medium">Difficulty</div>
                        <div className="text-muted-foreground">Level {session.difficulty}</div>
                      </div>
                      <div>
                        <div className="font-medium">Performance</div>
                        <div className="text-muted-foreground">{session.performance || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="font-medium">Status</div>
                        <div className={cn(
                          "capitalize",
                          session.status === 'completed' ? "text-primary" : "text-muted-foreground"
                        )}>{session.status}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No treatment sessions found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TreatmentTimeline;