import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads with header", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator('header a[href="/"]')).toBeVisible();
  });

  test("clicking logo navigates to home", async ({ page }) => {
    await page.goto("/category/getting-started");
    await page.locator('header a[href="/"]').click();
    await expect(page).toHaveURL("/");
  });

  test("header Categories dropdown opens on click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Categories" }).click();
    await expect(page.getByText("Browse by Category")).toBeVisible();
  });

  test("header Courses dropdown opens on click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Courses", exact: true }).click();
    // Wait for both the dropdown and the lazy-loaded courses data
    await expect(page.getByRole("heading", { name: "Certification Courses", exact: true })).toBeVisible({ timeout: 10000 });
  });

  test("category page loads with videos", async ({ page }) => {
    await page.goto("/category/getting-started");
    // Category page should have a heading and video links
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page.locator('a[href^="/watch/"]').first()).toBeVisible();
  });

  test("back button works after navigation", async ({ page }) => {
    await page.goto("/");
    // Use snap-start to target video cards, not Hero CTA
    const videoLink = page.locator('a.snap-start[href^="/watch/"]').first();
    await videoLink.waitFor({ state: "visible", timeout: 10000 });
    await videoLink.click();
    await expect(page).toHaveURL(/\/watch\//);
    await page.goBack();
    await expect(page).toHaveURL("/");
  });
});
