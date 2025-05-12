"use client";

import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { useEffect } from 'react';

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to account page if already logged in and session is loaded
    if (!loading && session) {
      console.log('[LoginPage] Session found, redirecting to /account...');
      router.push('/account'); // Redirect to the account page
    }
  }, [session, loading, router]);

  // Optional: Show loading state while checking session
  if (loading) {
    console.log('[LoginPage] Checking session...');
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  // Render login form only if not loading and no session
  if (!session) {
    console.log('[LoginPage] No session found, rendering AuthForm.');
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <AuthForm />
      </div>
    );
  }

  // If loading is false and session exists, this return null while redirecting
  console.log('[LoginPage] Session exists, redirecting (component returns null)...');
  return null; 
} 