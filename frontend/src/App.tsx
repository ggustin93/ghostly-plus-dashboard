/**
 * Root Application Component
 * 
 * This component serves as the root of the component hierarchy and defines
 * the overall structure and providers for the application UI.
 * 
 * Responsibilities:
 * - Provides theme context for styling
 * - Sets up global UI components like toasts
 * - Renders the main router which controls page navigation
 */

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { RouterProvider } from '@/routes/router';
import { AuthProvider } from '@/contexts/auth-context';

import './App.css';

/**
 * Main application component that wraps the entire UI with necessary providers
 * and global components.
 * 
 * @returns The root React component tree
 */
function App() {
  return (
    // Theme provider enables light/dark mode and theme customization
    <ThemeProvider defaultTheme="light">
      {/* 
        Note: AuthProvider is also present in main.tsx.
        Consider removing one of these instances to avoid duplicate context.
        Typically, global providers should be in a single location (main.tsx).
      */}
      <AuthProvider>
        {/* RouterProvider manages all application routes and page rendering */}
        <RouterProvider />
        {/* Toaster provides a container for toast notifications */}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;