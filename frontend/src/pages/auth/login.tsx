import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type FormValues = z.infer<typeof formSchema>;

// Mock users for demo login buttons (can be imported or defined here)
const DEMO_USERS_CREDENTIALS = [
  { email: 'sarah@example.com', password: 'password', role: 'Therapist' },
  { email: 'michael@example.com', password: 'password', role: 'Researcher' },
  { email: 'emily@example.com', password: 'password', role: 'Admin' },
];

const Login = () => {
  const { 
    signInWithPassword, 
    user, 
    session, 
    loading: authLoading, 
    error: authError,
    authMode
  } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const handleLogin = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await signInWithPassword(values.email, values.password);
    } catch (error) {
      console.error("Login page specific error during signInWithPassword:", error);
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle navigation and toast based on auth state
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        if ((authMode === 'supabase' && session) || authMode === 'mock') {
          interface AuthUserDisplay {
            email?: string;
            name?: string; // For MockAppUser
          }
          const userName = (user as AuthUserDisplay).email || (user as AuthUserDisplay).name || 'User';
          toast({
            title: 'Login Successful',
            description: `Welcome back, ${userName}${authMode === 'mock' ? ' (Mock User)' : ''}`,
          });
          navigate('/dashboard');
        }
      } else if (authError) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: authError.message || 'Please check your credentials and try again',
        });
      }
    }
  }, [user, session, authLoading, authError, navigate, toast, authMode]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center">
          <UserCircle className="h-16 w-16 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Welcome to Ghostly+</h1>
          <p className="mt-1 text-center text-muted-foreground">
            EMG monitoring and treatment platform
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Both mock users and real database users are supported
            </p>
          </form>
        </Form>

        <div className="mt-6">
          <p className="mb-2 text-center text-sm text-muted-foreground">Quick login with mock users:</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {DEMO_USERS_CREDENTIALS.map((demoUser) => (
              <Button
                key={demoUser.email}
                variant="outline"
                className="w-full"
                onClick={() => handleLogin({ email: demoUser.email, password: demoUser.password })}
                disabled={isLoading || authLoading}
              >
                {demoUser.role}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;