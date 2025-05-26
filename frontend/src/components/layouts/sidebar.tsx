import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  Users,
  ListChecks,
  Settings,
  Activity,
  Home,
  BarChart,
  X,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <Home className="h-5 w-5" />,
      },
      {
        name: 'Patients',
        href: '/patients',
        icon: <Users className="h-5 w-5" />,
      },
    ];
    
    const therapistItems = [
      {
        name: 'Sessions',
        href: '/sessions',
        icon: <ListChecks className="h-5 w-5" />,
      },
      {
        name: 'C3D Files',
        href: '/c3d',
        icon: <FileText className="h-5 w-5" />,
      },
      {
        name: 'Reports',
        href: '/reports/progress',
        icon: <BarChart className="h-5 w-5" />,
      },
    ];
    
    const researcherItems = [
      {
        name: 'Data Analysis',
        href: '/analysis',
        icon: <Activity className="h-5 w-5" />,
      },
    ];
    
    const adminItems = [
      {
        name: 'System Settings',
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
      },
    ];
    
    if (user?.role === 'therapist') {
      return [...baseItems, ...therapistItems];
    }
    
    if (user?.role === 'researcher') {
      return [...baseItems, ...researcherItems];
    }
    
    if (user?.role === 'administrator') {
      return [...baseItems, ...adminItems];
    }
    
    return baseItems;
  };
  
  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card shadow-lg transition-transform duration-300 ease-in-out lg:static lg:z-0 lg:transform-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 bg-gray-100">
          <Link to="/dashboard" className="flex items-center py-2">
            <div className="flex flex-col items-center">
              <span className="text-4xl tracking-tighter text-primary hover:text-primary font-serif">Ghostly+</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            asChild
            onClick={() => setOpen(false)}
          >
            <span className="inline-flex items-center justify-center h-full w-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </span>
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;