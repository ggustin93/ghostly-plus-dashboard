/**
 * Stagewise Development Toolbar Configuration
 * 
 * This module configures and initializes the Stagewise development toolbar,
 * which provides helpful debugging and development tools during local development.
 * The toolbar is only initialized in development mode and is excluded from production builds.
 */

// 1. Import the Stagewise toolbar initialization function
import { initToolbar } from '@stagewise/toolbar';

// 2. Define the toolbar configuration
// This configuration object can be extended with custom plugins and settings
// See Stagewise documentation for available options: https://docs.stagewise.dev
const stagewiseConfig = {
  plugins: [],
  // Additional configuration options can be added here:
  // - logLevel: 'info' | 'warn' | 'error' | 'debug'
  // - position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  // - theme: 'light' | 'dark' | 'auto'
};

/**
 * Initialize the Stagewise toolbar for development environments
 * 
 * This function conditionally initializes the Stagewise toolbar
 * only when running in development mode to avoid including it in production builds.
 * 
 * @example
 * // Call this function in your application's entry point
 * setupStagewise();
 */
export function setupStagewise() {
  // Only initialize in development mode using Vite's import.meta.env.DEV flag
  // This ensures the toolbar is completely excluded from production builds
  if (import.meta.env.DEV) {
    initToolbar(stagewiseConfig);
  }
} 