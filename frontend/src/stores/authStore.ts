import { defineStore } from 'pinia';
import supabaseClient from '../services/supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | Error | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    session: null,
    loading: false,
    error: null,
  }),

  actions: {
    async initializeAuthListener(): Promise<void> {
      // Attempt to get the current session first
      try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error) throw error;
        if (data.session) {
          this.session = data.session;
          this.user = data.session.user;
        }
      } catch (error) {
        this.error = error as AuthError | Error;
        console.error("Error getting initial session:", error);
      }

      // Listen for auth state changes
      supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event, 'Session:', session);
        this.session = session;
        this.user = session?.user ?? null;
        // You might want to handle specific events differently here, e.g., TOKEN_REFRESHED
        // For now, just updating session and user is fine.
      });
    },

    async signInWithPassword(emailIn: string, passwordIn: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        // ORIGINAL SUPABASE CLIENT METHOD - has header issues
        // const { data, error } = await supabaseClient.auth.signInWithPassword({
        //   email: emailIn,
        //   password: passwordIn,
        // });
        
        // CUSTOM IMPLEMENTATION - use fetch directly to avoid duplicate header issues
        console.log('[authStore] Using custom fetch for authentication to avoid header issues');
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
        
        // Add debug logs
        console.log('[authStore] DEBUG - supabaseUrl:', supabaseUrl);
        console.log('[authStore] DEBUG - Auth URL:', `${supabaseUrl}/auth/v1/token?grant_type=password`);
        console.log('[authStore] DEBUG - apikey length:', supabaseKey.length);
        console.log('[authStore] DEBUG - apikey first 10 chars:', supabaseKey.substring(0, 10));
        console.log('[authStore] DEBUG - apikey last 10 chars:', supabaseKey.substring(supabaseKey.length - 10));
        
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Only send the apikey header, not Authorization
            'apikey': supabaseKey,
            // Include other required headers
            'X-Client-Info': 'supabase-js-web/custom'
          },
          body: JSON.stringify({
            email: emailIn,
            password: passwordIn
          })
        });
        
        // Log response details for debugging
        console.log('[authStore] DEBUG - Response status:', response.status);
        console.log('[authStore] DEBUG - Response status text:', response.statusText);
        
        const responseData = await response.json();
        console.log('[authStore] DEBUG - Response data:', responseData);
        
        if (!response.ok) {
          throw responseData.error || new Error('Authentication failed');
        }
        
        // Update the Supabase client with the new session
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.setSession({
          access_token: responseData.access_token,
          refresh_token: responseData.refresh_token
        });
        
        if (sessionError) throw sessionError;
        
        this.session = sessionData.session;
        this.user = sessionData.user;
      } catch (error) {
        console.error('Authentication error:', error);
        this.error = error as AuthError | Error;
      } finally {
        this.loading = false;
      }
    },

    async signUpWithPassword(emailIn: string, passwordIn: string, options?: object): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        // Note: Supabase signUp also logs the user in if successful and email confirmation is not required.
        const { data, error } = await supabaseClient.auth.signUp({
          email: emailIn,
          password: passwordIn,
          options: options,
        });
        if (error) throw error;
        // Session and user might be null if email confirmation is required
        this.session = data.session;
        this.user = data.user;
        // If email confirmation is required, data.user will exist but data.session will be null.
        // You might want to inform the user to check their email.
      } catch (error) {
        this.error = error as AuthError;
      } finally {
        this.loading = false;
      }
    },

    async signOut(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        this.user = null;
        this.session = null;
      } catch (error) {
        this.error = error as AuthError;
      } finally {
        this.loading = false;
      }
    },

    async sendPasswordResetEmail(emailIn: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        // Ensure you have a redirect URL configured in your Supabase project settings for password resets.
        const { error } = await supabaseClient.auth.resetPasswordForEmail(emailIn, {
          // redirectTo: 'http://localhost:3000/update-password' // Example, adjust to your app's route
        });
        if (error) throw error;
        // Optionally, inform the user to check their email
      } catch (error) {
        this.error = error as AuthError;
      } finally {
        this.loading = false;
      }
    },

    async updatePassword(newPasswordIn: string): Promise<void> {
      if (!this.user) {
        this.error = new Error("User must be logged in to update password.");
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const { error } = await supabaseClient.auth.updateUser({ password: newPasswordIn });
        if (error) throw error;
        // Optionally, inform the user of success
      } catch (error) {
        this.error = error as AuthError;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.session,
  },
}); 