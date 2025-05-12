'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // We'll make email read-only

export default function AccountPage() {
  const { user, session, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not logged in and session check is complete
    if (!loading && !session) {
      router.push('/login');
    }
  }, [session, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    // The AuthProvider listener will handle the session state update
    // and the useEffect above will trigger redirection.
    // Optionally, force redirect immediately:
    // router.push('/login'); 
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Display account details if logged in
  if (session && user) {
    // Get initials for Avatar Fallback
    const getInitials = (email: string | undefined) => {
        return email ? email.substring(0, 2).toUpperCase() : 'U';
    }
      
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="items-center text-center">
            <Avatar className="w-20 h-20 mb-4">
              {/* Placeholder for user avatar - Supabase user metadata might have an avatar_url */}
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User Avatar'} /> 
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">My Account</CardTitle>
            <CardDescription>View and manage your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={user.email || 'No email provided'} readOnly disabled className="cursor-not-allowed" />
            </div>
            
            {/* Example: Displaying User ID (optional) */}
            {/* <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" type="text" value={user.id} readOnly disabled className="cursor-not-allowed" />
            </div> */}

             {/* Add more fields here as needed, e.g., Name, based on user_metadata */}
             {/* 
             {user.user_metadata?.full_name && (
                 <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" value={user.user_metadata.full_name} readOnly disabled />
                 </div>
             )} 
             */}

            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback if session exists but user object doesn't (shouldn't typically happen)
  if (session && !user) {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <p className="text-destructive">Error: Session exists but user data is unavailable.</p>
            <Button variant="secondary" onClick={handleSignOut} className="mt-4">Sign Out</Button>
        </div>
    )
  }

  // If !loading and !session, the useEffect hook handles redirection, 
  // but we return null here to prevent rendering anything during the brief redirect period.
  return null; 
} 