import { createBrowserRouter, RouterProvider as Router, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/auth-context';
import AppLayout from '@/components/layouts/app-layout';
import { Loader } from 'lucide-react';

// Lazy-loaded routes
const Login = lazy(() => import('@/pages/auth/login'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const PatientProfile = lazy(() => import('@/pages/patients/patient-profile'));
const SessionAnalysis = lazy(() => import('@/pages/sessions/session-analysis'));
const TreatmentConfig = lazy(() => import('@/pages/treatments/treatment-config'));
const PatientsList = lazy(() => import('@/pages/patients/patients-list'));
const ProgressReports = lazy(() => import('@/pages/reports/progress-reports'));
const SessionsPage = lazy(() => import('@/pages/sessions/session-list-all'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Loading component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'patients',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PatientsList />
          </Suspense>
        ),
      },
      {
        path: 'patients/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PatientProfile />
          </Suspense>
        ),
      },
      {
        path: 'sessions',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SessionsPage />
          </Suspense>
        ),
      },
      {
        path: 'sessions/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SessionAnalysis />
          </Suspense>
        ),
      },
      {
        path: 'treatments/configure',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TreatmentConfig />
          </Suspense>
        ),
      },
      {
        path: 'reports/progress',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProgressReports />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export { router };
export const RouterProvider = () => <Router router={router} />;