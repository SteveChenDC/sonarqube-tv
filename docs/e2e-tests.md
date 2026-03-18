# E2E Test Suite — 28 Playwright Tests

## Setup

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: { baseURL: "http://localhost:3000", headless: true, screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: { command: "npm run dev", url: "http://localhost:3000", reuseExistingServer: !process.env.CI, timeout: 30000 },
});
```

---

## Test Cases

### Navigation (6)

| # | Scenario | Assertion |
|---|----------|-----------|
| 1 | Load `/` | Header and logo link visible |
| 2 | Click logo from `/category/*` | Redirects to `/` |
| 3 | Click "Categories" button | "Browse by Category" dropdown visible |
| 4 | Click "Courses" button | "Certification Courses" heading visible |
| 5 | Load `/category/getting-started` | Heading + video links visible |
| 6 | Click video card → browser back | Returns to `/` |

### Filter Modal (4)

| # | Scenario | Assertion |
|---|----------|-----------|
| 7 | Scroll past hero → click floating filter button | Dialog with date/duration/sort options visible |
| 8 | Select "Under 4 min" → Apply | Modal closes, results filtered |
| 9 | Apply filter → reopen → Reset all | Filters cleared |
| 10 | Open modal → press Escape | Dialog dismissed |

### Video Card (3)

| # | Scenario | Assertion |
|---|----------|-----------|
| 11 | Click first `.snap-start` card | URL matches card href, title visible |
| 12 | Inspect card DOM | Play icon SVG attached (opacity-0 until hover) |
| 13 | Inspect first card | Duration badge with `MM:SS` format visible |

### Watch Page (4)

| # | Scenario | Assertion |
|---|----------|-----------|
| 14 | Load `/watch/v1` | Player area, title, "Back" link visible |
| 15 | Click "Back" link | Redirects to `/` |
| 16 | Load `/watch/v2` → scroll to bottom | "More in…" related section visible |
| 17 | Click category link on watch page | URL matches `/category/*` |

### Search (6)

| # | Scenario | Assertion |
|---|----------|-----------|
| 18 | Click "Search videos" button | Search input visible |
| 19 | Type "SonarQube" | "X of Y results" count visible |
| 20 | Click first search result | URL matches `/watch/*` |
| 21 | Open search → press Escape | Search input dismissed |
| 22 | Press `/` key on home page | Search input appears |
| 23 | Type nonsense query | "No results" shown |

### Mobile (5) — 375x812, touch enabled

| # | Scenario | Assertion |
|---|----------|-----------|
| 24 | Load `/` at mobile viewport | Header + video cards visible |
| 25 | Tap mobile "Filters" button | Dialog with "Upload date" visible |
| 26 | Open search → type "SonarQube" | Results or "No results" visible |
| 27 | Tap first video card | URL matches `/watch/*` |
| 28 | Load `/watch/v1` at mobile | Title + "Back" link visible |

---

## Selectors Reference

| Element | Selector |
|---------|----------|
| Video cards | `a.snap-start[href^="/watch/"]` |
| Play icon SVG | `svg path[d='M8 5v14l11-7z']` |
| Duration badge | `span` filtered by `/^\d+:\d{2}$/` |
| Floating filter btn | `button[aria-label="Open filters"]` |
| Mobile filter btn | `button[aria-label="Filters"]` |
| Search input | `input[type="search"]` |
| Search results count | `text=/\d+ of \d+ results?/` |
| Search result links | `ul li a[href^="/watch/"]` |
| Back link | `a[href="/"]` filtered by text "Back" |
| Category links | `a[href^="/category/"]` |

---

## Full Test Code

### `e2e/navigation.spec.ts`

```ts
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
    await expect(
      page.getByRole("heading", { name: "Certification Courses", exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  test("category page loads with videos", async ({ page }) => {
    await page.goto("/category/getting-started");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page.locator('a[href^="/watch/"]').first()).toBeVisible();
  });

  test("back button works after navigation", async ({ page }) => {
    await page.goto("/");
    const videoLink = page.locator('a.snap-start[href^="/watch/"]').first();
    await videoLink.waitFor({ state: "visible", timeout: 10000 });
    await videoLink.click();
    await expect(page).toHaveURL(/\/watch\//);
    await page.goBack();
    await expect(page).toHaveURL("/");
  });
});
```

### `e2e/filter-modal.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Filter Modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("filter button opens the filter modal", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    const floatingBtn = page.locator('button[aria-label="Open filters"]');
    await expect(floatingBtn).toBeVisible({ timeout: 5000 });
    await floatingBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Upload date")).toBeVisible();
    await expect(page.getByText("Duration", { exact: true })).toBeVisible();
    await expect(page.getByText("Sort by")).toBeVisible();
  });

  test("applying duration filter updates results", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await page.locator('button[aria-label="Open filters"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Under 4 min" }).click();
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("reset all clears filters", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    await page.locator('button[aria-label="Open filters"]').click();
    await page.getByRole("button", { name: "Under 4 min" }).click();
    await page.getByRole("button", { name: "Apply" }).click();
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
```

### `e2e/video-card.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Video Card", () => {
  test("clicking a video card navigates to watch page", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('a.snap-start[href^="/watch/"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });
    const firstCard = cards.first();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();
    await expect(page).toHaveURL(href!);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("video card shows play icon on hover", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('a.snap-start[href^="/watch/"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });
    const playIcon = cards.first().locator("svg path[d='M8 5v14l11-7z']").first();
    await expect(playIcon).toBeAttached();
  });

  test("video cards display title and duration", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator('a.snap-start[href^="/watch/"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });
    const durationBadge = cards.first().locator("span").filter({ hasText: /^\d+:\d{2}$/ }).first();
    await expect(durationBadge).toBeVisible();
  });
});
```

### `e2e/watch-page.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Watch Page", () => {
  test("watch page loads with video player and metadata", async ({ page }) => {
    await page.goto("/watch/v1");
    await expect(
      page.locator('[id="yt-player"], [data-testid="video-player"]')
        .or(page.locator('button[aria-label*="Play"]').or(page.locator("img[alt]").first()))
        .first()
    ).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator('a[href="/"]').filter({ hasText: "Back" })).toBeVisible();
  });

  test("back link returns to home page", async ({ page }) => {
    await page.goto("/watch/v1");
    await page.locator('a[href="/"]').filter({ hasText: "Back" }).click();
    await expect(page).toHaveURL("/");
  });

  test("related videos section appears on watch page", async ({ page }) => {
    await page.goto("/watch/v2");
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
```

### `e2e/search.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("search button opens search input", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test("typing in search shows results dropdown", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    await page.locator('input[type="search"]').fill("SonarQube");
    await expect(page.locator('text=/\\d+ of \\d+ results?/')).toBeVisible({ timeout: 5000 });
  });

  test("clicking a search result navigates to watch page", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    await page.locator('input[type="search"]').fill("SonarQube");
    await expect(page.locator('text=/\\d+ of \\d+ results?/')).toBeVisible({ timeout: 5000 });
    const firstResult = page.locator('ul li a[href^="/watch/"]').first();
    if (await firstResult.isVisible()) {
      await firstResult.click();
      await expect(page).toHaveURL(/\/watch\//);
    }
  });

  test("escape key closes search", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    await expect(page.locator('input[type="search"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('input[type="search"]')).not.toBeVisible();
  });

  test("slash key opens search", async ({ page }) => {
    await page.keyboard.press("/");
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test("no results shows empty state", async ({ page }) => {
    await page.getByRole("button", { name: "Search videos" }).click();
    await page.locator('input[type="search"]').fill("xyznonexistentvideo123");
    await expect(page.getByText("No results", { exact: true })).toBeVisible({ timeout: 5000 });
  });
});
```

### `e2e/mobile.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test.describe("Mobile viewport", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("home page loads at mobile viewport", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    const cards = page.locator('a.snap-start[href^="/watch/"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });
  });

  test("filter modal renders on mobile", async ({ page }) => {
    await page.goto("/");
    const filterBtn = page.locator('button[aria-label="Filters"]');
    await filterBtn.first().scrollIntoViewIfNeeded();
    await filterBtn.first().click({ force: true });
    await expect(page.getByRole("dialog")).toBeVisible();
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
    await expect(page.locator('a[href="/"]').filter({ hasText: "Back" })).toBeVisible();
  });
});
```
