'use client'; // Make this a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        // If logged in, redirect from root to account page
        console.log('[HomePage] Session found, redirecting to /account...');
        router.push('/account');
      } else {
        // If not logged in, redirect from root to login page
        console.log('[HomePage] No session found, redirecting to /login...');
        router.push('/login');
      }
    }
  }, [session, loading, router]);

  // Display a loading indicator while checking the session
  // This prevents flashing the page content briefly before redirection
  if (loading || !session) { // Show loading if loading or if there's no session (to avoid flicker before redirect)
    console.log('[HomePage] Checking session or preparing redirect...');
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  // This part should technically not be reached if redirection logic works correctly,
  // but it's kept as a fallback or placeholder.
  // If the user *is* logged in, they are redirected to /account by the effect.
  // If they are *not* logged in, they are redirected to /login.
  // We only render the loader above while checking or redirecting.
  console.log('[HomePage] Rendering fallback content (should not be visible if redirect works).');
  return (
    <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4">Loading or Redirecting...</p>
    </div>
  );
}
