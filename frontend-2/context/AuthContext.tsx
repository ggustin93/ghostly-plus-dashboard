'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client'; // Use the client-side client

// Define the shape of the authentication context
interface AuthContextType {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check initial session state
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get initial session'));
        console.error('Auth Error (getSession):', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      console.log('[AuthContext] Auth state changed:', _event, currentSession ? 'Session present' : 'No session');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setError(null); // Clear previous errors on state change
      setLoading(false); // Ensure loading is false after initial check + listener trigger
    });

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // --- Authentication Actions ---

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      // Session state will be updated by the onAuthStateChange listener
    } catch (err) {
      console.error('Auth Error (signIn):', err);
      setError(err instanceof Error ? err : new Error('Sign in failed'));
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        // Optional: specify the redirect URL for the password reset link
        // redirectTo: `${window.location.origin}/update-password`, 
      });
      if (resetError) throw resetError;
      // Success state handled in the component
    } catch (err) {
      console.error('Auth Error (resetPassword):', err);
      setError(err instanceof Error ? err : new Error('Password reset failed'));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      // Session state will be updated by the onAuthStateChange listener
    } catch (err) {
      console.error('Auth Error (signOut):', err);
      setError(err instanceof Error ? err : new Error('Sign out failed'));
    } finally {
      setLoading(false);
    }
  };

  // Value provided to consuming components
  const value: AuthContextType = {
    supabase,
    session,
    user,
    loading,
    error,
    signInWithPassword,
    sendPasswordResetEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy context consumption
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 