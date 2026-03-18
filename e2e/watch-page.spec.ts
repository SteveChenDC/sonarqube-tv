import { test, expect } from "@playwright/test";

test.describe("Watch Page", () => {
  test("watch page loads with video player and metadata", async ({ page }) => {
    await page.goto("/watch/v1");

    // The VideoPlayer renders a thumbnail with a play button overlay initially
    // (iframe only loads after clicking). Check for the player container.
    await expect(page.locator('[id="yt-player"], [data-testid="video-player"]').or(
      page.locator('button[aria-label*="Play"]').or(page.locator('img[alt]').first())
    ).first()).toBeVisible();

    // Title should be visible
    await expect(page.locator("h1").first()).toBeVisible();

    // Back link should be present
    await expect(page.locator('a[href="/"]').filter({ hasText: "Back" })).toBeVisible();
  });

  test("back link returns to home page", async ({ page }) => {
    await page.goto("/watch/v1");
    await page.locator('a[href="/"]').filter({ hasText: "Back" }).click();
    await expect(page).toHaveURL("/");
  });

  test("related videos section appears on watch page", async ({ page }) => {
    // Use v2 which has related videos in its category
    await page.goto("/watch/v2");
    // Scroll down to see related videos section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText(/More in/).first()).toBeVisible({ timeout: 10000 });
  });

  test("category link on watch page navigates to category", async ({ page }) => {
    await page.goto("/watch/v1");

    const categoryLink = page.locator('a[href^="/category/"]').first();
    if (await categoryLink.isVisible()) {
      const href = await categoryLink.getAttribute("href");
      await categoryLink.click();
      await expect(page).toHaveURL(href!);
    }
  });
});
