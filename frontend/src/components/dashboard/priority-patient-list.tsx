import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowDownCircle, TrendingDown, CalendarOff, AlertTriangle } from 'lucide-react';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// This would typically come from a props interface
export interface PatientAlert {
  id: string;
  name: string;
  reason: 'Low Performance' | 'Missed Sessions' | 'Declining Progress';
  details: string; // New field for accordion content
}

interface PriorityPatientListProps {
  patients: PatientAlert[];
}

const alertConfig = {
  'Low Performance': {
    icon: <ArrowDownCircle className="h-4 w-4 text-red-500" />,
    color: 'text-red-500',
  },
  'Missed Sessions': {
    icon: <CalendarOff className="h-4 w-4 text-yellow-600" />,
    color: 'text-yellow-600',
  },
  'Declining Progress': {
    icon: <TrendingDown className="h-4 w-4 text-orange-500" />,
    color: 'text-orange-500',
  },
};

export const PriorityPatientList = ({ patients }: PriorityPatientListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle>Patients with Alerts</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground pt-1">
              {patients.length} {patients.length === 1 ? 'patient' : 'patients'} requiring attention
            </p>
          </div>
          <Button variant="link" asChild className="p-0 -mt-1 h-auto shrink-0">
            <Link to="/patients">See all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        {patients.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-1">
            {patients.map((patient) => (
              <AccordionItem value={patient.id} key={patient.id} className="border-b-0">
                <AccordionTrigger className="p-3 rounded-lg hover:no-underline hover:bg-muted/50 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0">
                  <div className="flex items-center w-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback style={getAvatarColor(patient.id)}>
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 text-left">
                      <p className="text-sm font-medium leading-none">{patient.name}</p>
                      <div className={`flex items-center gap-1.5 ${alertConfig[patient.reason].color}`}>
                        {alertConfig[patient.reason].icon}
                        <p className="text-xs">{patient.reason}</p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3 px-4 text-sm text-muted-foreground">
                  {patient.details}
                  <Button variant="link" asChild className="p-0 h-auto mt-2 font-semibold">
                    <Link to={`/patients/${patient.id}`}>
                      View Patient Profile &rarr;
                    </Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <span className="text-2xl mb-2">✅</span>
            <p>All patients are on track.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 