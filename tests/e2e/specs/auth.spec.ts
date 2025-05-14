import { test, expect } from '@playwright/test';

// Test minimal d'authentification pour Ghostly+
test('should show login page and authenticate', async ({ page }) => {
  // 1. Aller sur la page de login
  await page.goto('/login');
  
  // 2. Vérifier que le formulaire est visible
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  
  // 3. Remplir les identifiants
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  
  // 4. Soumettre le formulaire
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // 5. Vérifier que l'authentification a réussi (redirection vers dashboard)
  await expect(page).toHaveURL(/.*dashboard/);
}); 