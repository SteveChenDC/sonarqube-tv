import { test, expect } from "@playwright/test";

test.describe("Mobile viewport", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("home page loads at mobile viewport", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    // Video cards with snap-start should be visible
    const cards = page.locator('a.snap-start[href^="/watch/"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });
  });

  test("filter modal renders on mobile", async ({ page }) => {
    await page.goto("/");

    // On mobile, the FilterTrigger is inside the mobile Hero section
    // Use the button with aria-label="Filters" that is visible on mobile
    const filterBtn = page.locator('button[aria-label="Filters"]');
    // The mobile Hero version should be visible; scroll to it
    await filterBtn.first().scrollIntoViewIfNeeded();
    await filterBtn.first().click({ force: true });

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByText("Upload date")).toBeVisible();
  });

  test("search works on mobile", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Search videos" }).click();

    const searchInput = page.locator('input[type="search"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill("SonarQube");
    await expect(
      page.locator('text=/\\d+ of \\d+ results?/').or(page.getByText("No results", { exact: true }))
    ).toBeVisible({ timeout: 5000 });
  });

  test("video card tap navigates to watch page on mobile", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('a.snap-start[href^="/watch/"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });

    await cards.first().tap();
    await expect(page).toHaveURL(/\/watch\//);
  });

  test("watch page renders correctly on mobile", async ({ page }) => {
    await page.goto("/watch/v1");

    await expect(page.locator("h1").first()).toBeVisible();
    // Check for video player area (thumbnail or player container)
    await expect(page.locator('a[href="/"]').filter({ hasText: "Back" })).toBeVisible();
  });
});
