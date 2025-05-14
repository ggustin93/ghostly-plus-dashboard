import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <UserCircle className="h-24 w-24 text-primary/50" />
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-center text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;