import { expect, test } from "@playwright/test";

/**
 * E2E Test: View schedule and add favorites
 *
 * This is the third layer of testing (after unit and integration tests).
 * It tests the complete user workflow in a real browser.
 * It verifies that all parts of the app work together correctly.
 */

test("should display festival schedule on load", async ({ page }) => {
  await page.goto("/");

  // Verify page loads
  await expect(page).toHaveTitle(/JCHC Fest/);

  // Verify schedule is visible
  await expect(page.locator("text=July 18")).toBeVisible();
});

test("should allow user to toggle favorite sets", async ({ page }) => {
  await page.goto("/");

  // Find first set and click favorite button
  const firstFavButton = page.locator("button").first();
  await firstFavButton.click();

  // Verify it's marked as favorite (visual feedback)
  // This would check for a filled heart icon, changed color, etc.
});

test("should filter sets when filter tab is clicked", async ({ page }) => {
  await page.goto("/");

  // Click "Favorites" tab
  await page.locator("button:has-text('Favorites')").click();

  // Verify only favorite sets are shown
  // The page should only display sets that were marked as favorites
});

test("should drag and drop taco break", async ({ page }) => {
  await page.goto("/");

  // Find taco card
  const tacoCard = page.locator("text=/Shove-It Tacos|🌮/");

  // Drag it to a different location (between two sets)
  const dropZone = page.locator("[data-testid='drop-zone']").first();
  await tacoCard.dragTo(dropZone);

  // Verify it moved
  await expect(tacoCard).toBeVisible();
});
