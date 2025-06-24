import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon?: React.ReactNode;
  isInteger?: boolean;
  avg?: number;  // Average value
  std?: number;  // Standard deviation
  isWIP?: boolean; // Work in progress indicator
}

export default function MetricCard({
  title,
  value,
  unit,
  description,
  icon,
  isInteger,
  avg,
  std,
  isWIP = false,
}: MetricCardProps) {
  return (
    <Card className={isWIP ? "border-dashed border-yellow-400" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {isWIP && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
              WIP
            </Badge>
          )}
        </div>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isInteger ? Math.round(value) : value.toFixed(2)} {unit}
        </div>
        {(avg !== undefined && std !== undefined) && (
          <div className="mt-1 text-xs text-muted-foreground">
            <span title="Average ± Standard Deviation">
              avg: {avg.toFixed(2)} ± {std.toFixed(2)} {unit}
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
} 