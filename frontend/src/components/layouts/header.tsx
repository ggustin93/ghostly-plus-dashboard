import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Bell, 
  Settings,
  UserCircle,
  LogOut,
  Globe
} from 'lucide-react';
import { useAuth, MockAppUser } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '../theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  openSidebar: () => void;
}

interface AppUser {
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  email?: string;
}

const Header = ({ openSidebar }: HeaderProps) => {
  const { user, signOut, isMockAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const typedUser = user;

  const getUserDisplayName = (): string | undefined => {
    if (!typedUser) return undefined;
    if (isMockAuth) {
      return (typedUser as MockAppUser).name;
    }
    return (typedUser as AppUser).user_metadata?.name as string | undefined;
  };

  const getUserAvatar = (): string | undefined => {
    if (!typedUser) return undefined;
    if (isMockAuth) {
      return (typedUser as MockAppUser).avatar;
    }
    return (typedUser as AppUser).user_metadata?.avatar_url as string | undefined;
  };
  
  const getUserEmail = (): string | undefined => {
    if (!typedUser) return undefined;
    return (typedUser as AppUser).email as string | undefined;
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (!displayName) return 'U';
    return displayName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' }
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          asChild
          onClick={openSidebar}
        >
          <span className="inline-flex items-center justify-center h-full w-full">
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="sr-only">Toggle menu</span>
          </span>
        </Button>
        
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <span className="inline-flex items-center justify-center">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <span className="inline-flex items-center justify-center">
                <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => {
                  // i18n.changeLanguage(lang.code); // Original functionality commented out
                  alert("Language switching is temporarily disabled.");
                }}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar()} alt={getUserDisplayName() || 'User'} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {getUserEmail()}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>{t('profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>{t('settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;