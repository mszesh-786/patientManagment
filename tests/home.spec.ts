import {test, expect} from '@playwright/test';

test('should display the home page', async ({page}) => {
  await page.goto('/');

  // Check if the main heading is visible
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('Welcome to the Patient Management System');

  // Check if the "Get Started" button is visible and has the correct text
  const getStartedButton = page.locator('text=Get Started');
  await expect(getStartedButton).toBeVisible();
  await expect(getStartedButton).toHaveText('Get Started');
});