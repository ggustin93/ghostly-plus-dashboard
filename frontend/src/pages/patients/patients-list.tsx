import { mockData } from '@/data/mock-data';
import PatientList from '@/components/dashboard/patient-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const PatientsListPage = () => {
  return (
    <div className="mx-auto py-10">
      <div className="flex items-center justify-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
        </div>
        <div className="ml-auto">
          <Button asChild>
            <Link to="/patients/new">
              <Plus className="mr-2 h-4 w-4" /> New Patient
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-center w-full">
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                View and manage all patients in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PatientList patients={mockData.patients} showViewAllButton={false} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsListPage;