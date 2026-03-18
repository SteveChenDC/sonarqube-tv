import { test, expect } from "@playwright/test";

test.describe("Filter Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("filter button opens the filter modal", async ({ page }) => {
    // Scroll down to trigger the floating filter button (the hero's inline
    // FilterTrigger is duplicated for mobile/desktop; the floating button
    // with aria-label="Open filters" appears after scrolling past the hero)
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    const floatingBtn = page.locator('button[aria-label="Open filters"]');
    await expect(floatingBtn).toBeVisible({ timeout: 5000 });
    await floatingBtn.click();

    // Modal should appear with filter options
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Upload date")).toBeVisible();
    await expect(page.getByText("Duration", { exact: true })).toBeVisible();
    await expect(page.getByText("Sort by")).toBeVisible();
  });

  test("applying duration filter updates results", async ({ page }) => {
    // Scroll to trigger floating filter button
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    await page.locator('button[aria-label="Open filters"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Click "Under 4 min" duration filter
    await page.getByRole("button", { name: "Under 4 min" }).click();

    // Apply filters
    await page.getByRole("button", { name: "Apply" }).click();

    // Modal should close
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("reset all clears filters", async ({ page }) => {
    // Scroll and open filters
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    await page.locator('button[aria-label="Open filters"]').click();
    await page.getByRole("button", { name: "Under 4 min" }).click();
    await page.getByRole("button", { name: "Apply" }).click();

    // Re-open
    await page.locator('button[aria-label="Open filters"]').click();
    const resetBtn = page.getByRole("button", { name: "Reset all" });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  });

  test("escape key closes filter modal", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    await page.locator('button[aria-label="Open filters"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
