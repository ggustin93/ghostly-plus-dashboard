import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProgressReports = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Progress Reports</h1>
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