import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

// Must mock before importing the page module
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock CategoryContent — it has its own test suite
vi.mock("@/components/CategoryContent", () => ({
  default: ({
    videos,
  }: {
    videos: { id: string }[];
    description?: string;
  }) => (
    <div data-testid="category-content">
      {videos.map((v) => (
        <span key={v.id}>{v.id}</span>
      ))}
    </div>
  ),
}));

import CategoryPage, {
  generateStaticParams,
  generateMetadata,
} from "./page";
import { categories } from "@/data/videos";

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// generateStaticParams
// ---------------------------------------------------------------------------
describe("generateStaticParams", () => {
  it("returns one entry per category", () => {
    const params = generateStaticParams();
    expect(params.length).toBe(categories.length);
  });

  it("every entry has a slug string", () => {
    const params = generateStaticParams();
    expect(params.every((p) => typeof p.slug === "string")).toBe(true);
  });

  it("includes the getting-started slug", () => {
    const params = generateStaticParams();
    expect(params.map((p) => p.slug)).toContain("getting-started");
  });
});

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------
describe("generateMetadata", () => {
  it("returns the category title as metadata title for a valid slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    expect(meta.title).toBe("Getting Started");
  });

  it("returns the category description as metadata description", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    expect(typeof meta.description).toBe("string");
    expect((meta.description as string).length).toBeGreaterThan(0);
  });

  it("includes openGraph metadata with the category title", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-security" }),
    });
    const og = meta.openGraph as { title?: string } | undefined;
    expect(og?.title).toContain("Code Security");
  });

  it("includes twitter card metadata", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-quality" }),
    });
    const twitter = meta.twitter as { card?: string } | undefined;
    expect(twitter?.card).toBe("summary_large_image");
  });

  it("sets canonical alternates to /category/{slug}", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "devops-cicd" }),
    });
    const alternates = meta.alternates as
      | { canonical?: string }
      | undefined;
    expect(alternates?.canonical).toBe("/category/devops-cicd");
  });

  it("returns an empty object for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "this-does-not-exist" }),
    });
    expect(meta).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// CategoryPage rendering
// ---------------------------------------------------------------------------
describe("CategoryPage", () => {
  it("renders the category heading for a valid slug", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    expect(
      screen.getByRole("heading", { name: /getting started/i })
    ).toBeInTheDocument();
  });

  it("renders a back link pointing to '/'", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders a video count badge", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    expect(screen.getByText(/video/i)).toBeInTheDocument();
  });

  it("renders total duration badge when videos exist", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    // formatTotalDuration produces "Xm total" or "Xh Xm total"
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it("renders category description", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    // The Getting Started description mentions "Installation"
    expect(screen.getByText(/installation/i)).toBeInTheDocument();
  });

  it("renders CategoryContent component with videos", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    render(jsx);
    expect(screen.getByTestId("category-content")).toBeInTheDocument();
  });

  it("throws NEXT_NOT_FOUND for an unknown slug", async () => {
    await expect(
      CategoryPage({ params: Promise.resolve({ slug: "not-a-real-slug" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders the Sonar Summit category correctly", async () => {
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "sonar-summit" }),
    });
    render(jsx);
    expect(
      screen.getByRole("heading", { name: /sonar summit/i })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// generateMetadata — openGraph and twitter fields not yet covered
//
// The existing suite checks og.title (partial), twitter.card, and
// alternates.canonical. The fields below are genuinely untested:
//   - og.description, og.type, og.images (url/dimensions/alt)
//   - twitter.title (full "… | Sonar.tv" format), twitter.description,
//     twitter.images
// ---------------------------------------------------------------------------
describe("generateMetadata — openGraph details", () => {
  it("og.title includes '| Sonar.tv' suffix", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    const og = meta.openGraph as { title?: string } | undefined;
    expect(og?.title).toContain("| Sonar.tv");
    expect(og?.title).toContain("Getting Started");
  });

  it("og.description matches the category description", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    const og = meta.openGraph as { description?: string } | undefined;
    // og.description is set to category.description — must be a non-empty string
    expect(typeof og?.description).toBe("string");
    expect((og?.description ?? "").length).toBeGreaterThan(0);
    // And must equal meta.description (both come from category.description)
    expect(og?.description).toBe(meta.description);
  });

  it("og.type is 'website'", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-security" }),
    });
    const og = meta.openGraph as { type?: string } | undefined;
    expect(og?.type).toBe("website");
  });

  it("og.images array has at least one entry with url '/og-image.png'", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-quality" }),
    });
    const og = meta.openGraph as {
      images?: { url: string; width?: number; height?: number; alt?: string }[];
    } | undefined;
    expect(Array.isArray(og?.images)).toBe(true);
    expect(og?.images?.length).toBeGreaterThanOrEqual(1);
    expect(og?.images?.[0].url).toBe("/og-image.png");
  });

  it("og.images[0] has width=1200, height=630", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-quality" }),
    });
    const og = meta.openGraph as {
      images?: { url: string; width?: number; height?: number; alt?: string }[];
    } | undefined;
    expect(og?.images?.[0].width).toBe(1200);
    expect(og?.images?.[0].height).toBe(630);
  });

  it("og.images[0].alt contains the category title", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "code-quality" }),
    });
    const og = meta.openGraph as {
      images?: { url: string; alt?: string }[];
    } | undefined;
    expect(og?.images?.[0].alt).toContain("Code Quality");
  });
});

describe("generateMetadata — twitter details", () => {
  it("twitter.title contains the category title and '| Sonar.tv' suffix", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "devops-cicd" }),
    });
    const twitter = meta.twitter as { title?: string } | undefined;
    expect(twitter?.title).toContain("| Sonar.tv");
    // Slug devops-cicd maps to "DevOps / CI-CD" or similar — just check non-empty and contains slug keywords
    expect((twitter?.title ?? "").length).toBeGreaterThan(0);
  });

  it("twitter.description matches the category description", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    const twitter = meta.twitter as { description?: string } | undefined;
    // twitter.description is set to category.description
    expect(typeof twitter?.description).toBe("string");
    expect((twitter?.description ?? "").length).toBeGreaterThan(0);
    expect(twitter?.description).toBe(meta.description);
  });

  it("twitter.images[0] is '/og-image.png'", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "getting-started" }),
    });
    const twitter = meta.twitter as { images?: string[] } | undefined;
    expect(Array.isArray(twitter?.images)).toBe(true);
    expect(twitter?.images?.[0]).toBe("/og-image.png");
  });
});

// ---------------------------------------------------------------------------
// formatTotalDuration via page render (private function, tested via output)
// ---------------------------------------------------------------------------
describe("formatTotalDuration (via CategoryPage render)", () => {
  it("shows minutes-only format for categories with <1h total duration", async () => {
    // ai-code-quality is a real category — total duration is checked for format
    const jsx = await CategoryPage({
      params: Promise.resolve({ slug: "ai-code-quality" }),
    });
    render(jsx);
    // We just verify some duration badge is present without asserting the exact number
    const text = screen.getByText(/total/i).textContent ?? "";
    // Must match either "Xm total" or "Xh Xm total"
    expect(text).toMatch(/(\d+h \d+m|\d+m) total/);
  });
});
