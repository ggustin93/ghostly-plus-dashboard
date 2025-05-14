import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Ghostly+ Dashboard E2E tests
 * 
 * This config sets up end-to-end testing for the application, considering
 * both local development and CI environments.
 */
export default defineConfig({
  // Dossier des tests
  testDir: './tests/e2e/specs',
  
  // Timeout par défaut
  timeout: 30000,
  
  // Reporter HTML pour visualiser les résultats
  reporter: 'html',
  
  // Configuration minimale
  use: {
    // URL de base de l'application
    baseURL: 'http://localhost:3000',
    
    // Capture d'écran uniquement en cas d'échec
    screenshot: 'only-on-failure',
  },
  
  // Un seul projet avec Chrome
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  
  // Configuration du serveur web local
  webServer: {
    command: 'cd frontend && npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60000,
  },
}); 