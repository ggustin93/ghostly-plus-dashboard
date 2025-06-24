import { Patient } from '@/types/patient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Droplets, Gamepad2, TrendingUp, TrendingDown } from 'lucide-react';

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
  referenceLine 
}: { 
  title: string, 
  description: string,
  data: ChartData[], 
  dataKey: string, 
  lineColor: string, 
  Icon: React.ElementType,
  domain: [number, number],
  referenceLine?: { y: number, label: string, color: string }
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
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
      />
      <ChartCard 
        title="Fatigue History"
        description="Evolution of muscle fatigue index during sessions."
        data={patient.fatigueHistory || []}
        dataKey="value"
        lineColor="#f43f5e" // Rose
        Icon={TrendingDown}
        domain={[0, 100]}
      />
      <ChartCard 
        title="Perceived Exertion (RPE)"
        description="Patient's self-reported exertion level (0-10 scale)."
        data={patient.rpeHistory || []}
        dataKey="value"
        lineColor="#a855f7" // Purple
        Icon={Droplets}
        domain={[0, 10]}
      />
    </div>
  );
};

export default ProgressTrackingCharts;
