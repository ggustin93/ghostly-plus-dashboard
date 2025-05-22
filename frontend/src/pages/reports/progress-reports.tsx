import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageHeader from '@/components/ui/page-header';

const ProgressReports = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Progress Reports" description="View and analyze patient progress over time." />
      <Card>
        <CardHeader>
          <CardTitle>Patient Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Progress reports dashboard will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressReports;