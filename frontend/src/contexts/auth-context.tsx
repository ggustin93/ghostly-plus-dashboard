'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, SupabaseClient, User as SupabaseUser, AuthChangeEvent } from '@supabase/supabase-js'; // Renamed User to SupabaseUser to avoid conflict
import { supabase } from '@/lib/supabase/client';

// --- Mock Data and Types (for development/testing) ---
export type UserRole = 'therapist' | 'researcher' | 'administrator';

export interface MockAppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Supabase User type might have different fields, this is for mock UI display
}

const MOCK_USERS: (MockAppUser & { password?: string })[] = [
  {
    id: 'mock-therapist-1',
    name: 'Dr. Sarah Johnson (Mock)',
    email: 'sarah@example.com',
    password: 'password',
    role: 'therapist',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'mock-researcher-1',
    name: 'Dr. Michael Chen (Mock)',
    email: 'michael@example.com',
    password: 'password',
    role: 'researcher',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'mock-admin-1',
    name: 'Emily Rodriguez (Mock)',
    email: 'emily@example.com',
    password: 'password',
    role: 'administrator',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

// --- End Mock Data and Types ---

// Flag to enable/disable mock authentication (can be driven by .env later)
const VITE_USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
// New flag to allow using both auth systems in parallel
const ALLOW_DUAL_AUTH = true; // Set to true to allow both mock and real authentication

// Define the shape of the authentication context
interface AuthContextType {
  supabase: SupabaseClient;
  session: Session | null;
  user: SupabaseUser | MockAppUser | null; // User can be SupabaseUser or our MockAppUser
  loading: boolean;
  error: Error | null;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isMockAuth: boolean; // Expose whether mock auth is active
  isAuthenticated: boolean; // Added isAuthenticated
  authMode: 'mock' | 'supabase' | null; // Track which authentication system is being used
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  // User state can now hold either a SupabaseUser or a MockAppUser
  const [user, setUser] = useState<SupabaseUser | MockAppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [authMode, setAuthMode] = useState<'mock' | 'supabase' | null>(null);

  // Derive isAuthenticated based on user, session, and authMode
  const isAuthenticated = authMode === 'mock' ? !!user : !!(user && session);

  useEffect(() => {
    if (VITE_USE_MOCK_AUTH && !ALLOW_DUAL_AUTH) {
      setLoading(false); // No async op for mock, so stop loading
      // Optionally, auto-login a default mock user or leave as null
      // setUser(MOCK_USERS[0]); 
      return;
    }

    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setAuthMode('supabase');
          console.log('[AuthContext] Restored Supabase session for:', currentSession.user.email);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get initial session'));
        console.error('Auth Error (getSession):', err);
      } finally {
        setLoading(false);
      }
    };
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, currentSession: Session | null) => {
      if (VITE_USE_MOCK_AUTH && !ALLOW_DUAL_AUTH) return; // Don't process Supabase events if mocking exclusively
      
      console.log('[AuthContext] Supabase Auth state changed:', _event, currentSession ? 'Session present' : 'No session');
      
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        setAuthMode('supabase');
        setError(null);
      } else if (authMode === 'supabase') {
        // Only clear if currently using Supabase auth (don't clear mock users)
        setSession(null);
        setUser(null);
        setAuthMode(null);
      }
      
      setLoading(false);
    });

    return () => {
      if (!VITE_USE_MOCK_AUTH || ALLOW_DUAL_AUTH) {
        authListener?.subscription.unsubscribe();
      }
    };
  }, [authMode]); // Added authMode to dependencies

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    // Try mock authentication if enabled
    if (VITE_USE_MOCK_AUTH || ALLOW_DUAL_AUTH) {
      const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (matchedUser) {
        const userToSet = { ...matchedUser };
        delete (userToSet as { password?: string }).password; // Remove password property
        setUser(userToSet);
        setSession(null); // No real Supabase session for mock users
        setAuthMode('mock');
        console.log('[AuthContext] Mock sign in successful:', userToSet.email);
        setLoading(false);
        return;
      }
    }
    
    // If mock auth failed or is disabled, try Supabase
    if (!VITE_USE_MOCK_AUTH || ALLOW_DUAL_AUTH) {
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          // If both auth methods failed, show error
          if (VITE_USE_MOCK_AUTH || ALLOW_DUAL_AUTH) {
            console.error('[AuthContext] Both mock and Supabase sign in failed for:', email);
            setError(new Error('Invalid credentials'));
          } else {
            throw signInError;
          }
        } else {
          // Supabase auth successful (session will be set by the onAuthStateChange listener)
          setAuthMode('supabase');
        }
      } catch (err) {
        console.error('Auth Error (signIn):', err);
        setError(err instanceof Error ? err : new Error('Sign in failed'));
      }
    } else {
      // Mock-only mode and mock auth failed
      setError(new Error('Mock login failed: Invalid credentials'));
      console.error('[AuthContext] Mock sign in failed for:', email);
    }
    
    setLoading(false);
  };

  const sendPasswordResetEmail = async (email: string) => {
    if (VITE_USE_MOCK_AUTH && !ALLOW_DUAL_AUTH) {
      alert(`Mock password reset for ${email}. In a real app, an email would be sent.`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {});
      if (resetError) throw resetError;
    } catch (err) {
      console.error('Auth Error (resetPassword):', err);
      setError(err instanceof Error ? err : new Error('Password reset failed'));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (authMode === 'mock') {
      setUser(null);
      setSession(null);
      setAuthMode(null);
      console.log('[AuthContext] Mock sign out successful.');
      return;
    }
    
    if (authMode === 'supabase') {
      setLoading(true);
      setError(null);
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        // The auth listener will handle clearing the user
      } catch (err) {
        console.error('Auth Error (signOut):', err);
        setError(err instanceof Error ? err : new Error('Sign out failed'));
      } finally {
        setLoading(false);
      }
    }
  };

  const value: AuthContextType = {
    supabase,
    session,
    user,
    loading,
    error,
    signInWithPassword,
    sendPasswordResetEmail,
    signOut,
    isMockAuth: authMode === 'mock',
    isAuthenticated,
    authMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};