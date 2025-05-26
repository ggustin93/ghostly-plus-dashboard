import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import ResponsiveBlocker from '../../../components/ResponsiveBlocker';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAuth();
  const [mounted, setMounted] = useState(false);

  // Ensure hydration issue is avoided
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar for larger screens */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main content */}
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <Header openSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <ResponsiveBlocker />
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;