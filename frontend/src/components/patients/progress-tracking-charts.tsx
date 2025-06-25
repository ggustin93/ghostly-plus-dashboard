import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Droplets, Gamepad2, TrendingUp, TrendingDown, Info, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProgressTrackingChartsProps {
  patient: Patient | null;
}

type ChartData = { date: string; value: number };

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
            <span className="font-bold text-muted-foreground">{label}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
            <span className="font-bold text-foreground">{payload[0].value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ChartCard = ({ 
  title, 
  description,
  data, 
  dataKey, 
  lineColor, 
  Icon, 
  domain, 
  referenceLine,
  isExperimental = false,
  clinicalInfo
}: { 
  title: string, 
  description: string,
  data: ChartData[], 
  dataKey: string, 
  lineColor: string, 
  Icon: React.ElementType,
  domain: [number, number],
  referenceLine?: { y: number, label: string, color: string },
  isExperimental?: boolean,
  clinicalInfo?: string
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {isExperimental && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Experimental
                </Badge>
              )}
              {clinicalInfo && (
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="p-1 text-left text-sm">
                        <p>{clinicalInfo}</p>
                      </div>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              )}
            </div>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={domain} />
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} name={title} stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          {referenceLine && (
            <ReferenceLine y={referenceLine.y} label={referenceLine.label} stroke={referenceLine.color} strokeDasharray="3 3" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const ProgressTrackingCharts = ({ patient }: ProgressTrackingChartsProps) => {
  if (!patient) {
    return <div>No patient data available for charts.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard 
        title="Game Performance Score"
        description="Evolution of the patient's average game scores."
        data={patient.gamePerformanceHistory || []}
        dataKey="value"
        lineColor="#10b981" // Emerald
        Icon={Gamepad2}
        domain={[0, 100]}
        referenceLine={{ y: 75, label: 'Target', color: '#f59e0b' }}
        clinicalInfo="Game performance scores reflect patient engagement and motor control. Higher scores indicate better coordination and reaction time. The target line represents the clinical goal for this patient."
      />
      <ChartCard 
        title="Adherence History"
        description="Patient's session attendance percentage over time."
        data={patient.adherenceHistory || []}
        dataKey="value"
        lineColor="#3b82f6" // Blue
        Icon={TrendingUp}
        domain={[0, 100]}
        referenceLine={{ y: 80, label: 'Goal', color: '#10b981' }}
        clinicalInfo="Adherence tracks completion of prescribed sessions. The GHOSTLY+ protocol requires 5 sessions per week (10 total over 2 weeks). The goal line represents the 80% adherence threshold for optimal outcomes."
      />
      <ChartCard 
        title="Fatigue History"
        description="Evolution of muscle fatigue index during sessions."
        data={patient.fatigueHistory || []}
        dataKey="value"
        lineColor="#f43f5e" // Rose
        Icon={TrendingDown}
        domain={[0, 100]}
        isExperimental={true}
        clinicalInfo="This experimental metric is derived from EMG signal analysis. It estimates muscle fatigue based on frequency domain shifts and amplitude changes during exercise. Higher values indicate greater fatigue."
      />
      <ChartCard 
        title="Perceived Exertion (RPE)"
        description="Patient's self-reported exertion level (0-10 scale)."
        data={patient.rpeHistory || []}
        dataKey="value"
        lineColor="#a855f7" // Purple
        Icon={Droplets}
        domain={[0, 10]}
        clinicalInfo="Rate of Perceived Exertion (RPE) is a subjective scale where patients rate their effort from 0 (no exertion) to 10 (maximum exertion). This helps calibrate exercise intensity and track subjective improvement over time."
      />
    </div>
  );
};

export default ProgressTrackingCharts;
