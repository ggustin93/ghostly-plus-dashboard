/**
 * Application Entry Point
 * 
 * This file serves as the main entry point for the React application.
 * It's responsible for:
 * - Initializing the React application 
 * - Setting up global providers
 * - Mounting the application to the DOM
 * - Initializing development tools and services
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n'; // Import internationalization configuration
import './index.css'; // Import global styles
import { AuthProvider } from './contexts/auth-context';
import { setupStagewise } from './lib/stagewise';

// Initialize Stagewise toolbar for development assistance
// This will only be active in development mode
setupStagewise();

// Mount the React application to the DOM
// The exclamation mark (!) is a non-null assertion operator telling TypeScript
// that we're certain the element exists
createRoot(document.getElementById('root')!).render(
  // StrictMode enables additional development checks and warnings
  <StrictMode>
    {/* AuthProvider makes authentication context available throughout the app */}
    <AuthProvider>
      {/* App component is the main component tree of our application */}
      <App />
    </AuthProvider>
  </StrictMode>
);