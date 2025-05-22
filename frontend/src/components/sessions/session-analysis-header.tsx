import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { RehabilitationSession } from '@/types/session';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, getAvatarColor } from '@/lib/utils';

interface SessionAnalysisHeaderProps {
  patient: Patient;
  session: RehabilitationSession;
  onExport: () => void;
}

const SessionAnalysisHeader: React.FC<SessionAnalysisHeaderProps> = ({ patient, session, onExport }) => {
  const avatarStyle = getAvatarColor(patient.id);

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="pl-0 text-sm"
        >
          <Link to={`/patients/${patient.id}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Patient Profile
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback 
              style={avatarStyle}
              className="flex items-center justify-center h-full w-full text-lg font-semibold"
            >
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-x-2">
              <h1 className="text-3xl font-bold tracking-tight">Session Analysis</h1>
              <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium text-muted-foreground ring-1 ring-inset ring-muted-foreground/10">
                {session.id}
              </span>
            </div>
            <p className="text-muted-foreground mt-0.5">
              {patient.name} • {format(new Date(session.date), "dd/MM/yyyy, hh:mm")}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0 self-start sm:self-center">
          <Button variant="outline" onClick={onExport} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionAnalysisHeader; 