'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<'signin' | 'reset'>('signin');
  const { loading, error: authContextError, signInWithPassword, sendPasswordResetEmail } = useAuth();

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Clear local errors after a delay
  useEffect(() => {
    if (signInError) {
      const timer = setTimeout(() => setSignInError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [signInError]);

  useEffect(() => {
    if (resetError) {
      const timer = setTimeout(() => setResetError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [resetError]);

  useEffect(() => {
    if (resetSuccessMessage) {
      const timer = setTimeout(() => setResetSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccessMessage]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setSignInError(null);
    if (!signInEmail || !signInPassword) {
      setSignInError('Please enter both email and password.');
      return;
    }
    await signInWithPassword(signInEmail, signInPassword);
    // Global error (authContextError) will be displayed if sign-in fails
    // Navigation on success should be handled elsewhere (e.g., in layout based on auth state)
    // Resetting fields is optional, as successful sign-in usually redirects
    // setSignInEmail(''); 
    // setSignInPassword('');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setResetError(null);
    setResetSuccessMessage(null);
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }
    await sendPasswordResetEmail(resetEmail);
    if (!authContextError) { // Check if the context method itself threw an error
      setResetSuccessMessage('Password reset email sent. Please check your inbox.');
      setResetEmail(''); 
    } else {
        setResetError(authContextError.message); // Display the error from context
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto my-8 shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold font-display">Sign In</CardTitle>
        <CardDescription className="text-sm">Access your EMG monitoring dashboard</CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        {/* Tab navigation */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('signin')}
            className={`py-2 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'signin'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Sign In
            {activeTab === 'signin' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reset')}
            className={`py-2 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'reset'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Reset Password
            {activeTab === 'reset' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Global Error Display from Context */}
        {authContextError && !signInError && !resetError && (
          <Alert variant="destructive" className="mb-4 animate-in fade-in">
            <AlertCircle className="w-4 h-4 mr-2" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authContextError.message}</AlertDescription>
          </Alert>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-1">
            {signInError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{signInError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reset')}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <Button
                type="submit" // Changed to submit
                disabled={loading}
                className="w-full h-10 mt-2 !bg-blue-600 text-white shadow-xs !hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Signing In
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Password Reset Form */}
        {activeTab === 'reset' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-1">
            {resetError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{resetError}</AlertDescription>
              </Alert>
            )}

            {resetSuccessMessage && (
              <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{resetSuccessMessage}</AlertDescription>
              </Alert>
            )}

            <div className="text-sm text-muted-foreground mb-4">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="h-10"
                />
              </div>

              <Button
                type="submit" // Changed to submit
                disabled={loading}
                className="w-full h-10 mt-2"
                variant="secondary"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Sending Email
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-xs text-primary hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 