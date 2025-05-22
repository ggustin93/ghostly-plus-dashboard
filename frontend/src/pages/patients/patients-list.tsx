import { mockData } from '@/data/mock-data';
import PatientList from '@/components/dashboard/patient-list';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/ui/page-header';

const PatientsListPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center">
        <PageHeader title="Patients" description="View and manage all patients in the system" />
        <div className="ml-auto">
          <Button asChild>
            <Link to="/patients/new">
              <Plus className="mr-2 h-4 w-4" /> New Patient
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          
        </CardHeader>
        <CardContent>
          <PatientList patients={mockData.patients} showViewAllButton={false} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsListPage;