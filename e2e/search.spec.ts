import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("search button opens search input", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test("typing in search shows results dropdown", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("SonarQube");

    // Results dropdown should appear with "X of Y results" text
    await expect(page.locator('text=/\\d+ of \\d+ results?/')).toBeVisible({ timeout: 5000 });
  });

  test("clicking a search result navigates to watch page", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("SonarQube");

    // Wait for results
    await expect(page.locator('text=/\\d+ of \\d+ results?/')).toBeVisible({ timeout: 5000 });

    // Click first result
    const firstResult = page.locator('ul li a[href^="/watch/"]').first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await expect(page).toHaveURL(/\/watch\//);
    }
  });

  test("escape key closes search", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(searchInput).not.toBeVisible();
  });

  test("slash key opens search", async ({ page }) => {
    await page.keyboard.press("/");
    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();
  });

  test("no results shows empty state", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill("xyznonexistentvideo123");

    await expect(page.getByText("No results", { exact: true })).toBeVisible({ timeout: 5000 });
  });
});
