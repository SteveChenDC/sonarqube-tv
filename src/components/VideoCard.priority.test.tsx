/**
 * Tests for VideoCard `priority` prop and responsive `sizes` attribute.
 *
 * The global next/image mock in setup.tsx strips `priority` and `sizes` from
 * the rendered <img>. This file overrides that mock locally so those props are
 * forwarded as data-* attributes, making them assertable.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import type { Video } from "@/types";

// Override the global next/image mock to capture priority + sizes props.
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    priority,
    sizes,
    ...props
  }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt as string}
      data-priority={String(priority ?? false)}
      data-sizes={sizes as string ?? ""}
      {...(props as object)}
    />
  ),
}));

import VideoCard from "./VideoCard";

const makeVideo = (overrides: Partial<Video> = {}): Video => ({
  id: "vid1",
  title: "Test Video",
  description: "A test video",
  youtubeId: "abc123",
  thumbnail: "/thumb.jpg",
  category: "tutorials",
  duration: "5:00",
  publishedAt: "2025-01-01T00:00:00Z",
  ...overrides,
});

describe("VideoCard — priority prop", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("default priority={false} — img does not have high-priority flag", () => {
    const { container } = render(<VideoCard video={makeVideo()} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    // priority defaults to false when prop is omitted
    expect(img!.getAttribute("data-priority")).toBe("false");
  });

  it("priority={true} — img receives the high-priority flag", () => {
    const { container } = render(<VideoCard video={makeVideo()} priority={true} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.getAttribute("data-priority")).toBe("true");
  });

  it("priority={false} explicit — img still has no high-priority flag", () => {
    const { container } = render(<VideoCard video={makeVideo()} priority={false} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img!.getAttribute("data-priority")).toBe("false");
  });
});

describe("VideoCard — sizes attribute", () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("fluid={false} (default) — uses fixed pixel sizes for horizontal row", () => {
    const { container } = render(<VideoCard video={makeVideo()} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    const sizes = img!.getAttribute("data-sizes")!;
    // Fixed widths: 280px at mobile, 320px at desktop
    expect(sizes).toContain("280px");
    expect(sizes).toContain("320px");
    // Should NOT use responsive vw units for horizontal-scroll row
    expect(sizes).not.toContain("vw");
  });

  it("fluid={true} — uses responsive calc(vw) sizes for category grid", () => {
    const { container } = render(<VideoCard video={makeVideo()} fluid />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    const sizes = img!.getAttribute("data-sizes")!;
    // Responsive breakpoint-aware calc() sizes for grid layout
    expect(sizes).toContain("vw");
    expect(sizes).toContain("calc");
    // Should NOT use fixed 280px from row mode
    expect(sizes).not.toContain("280px");
  });

  it("fluid={true} sizes covers three breakpoints (mobile, tablet, desktop)", () => {
    const { container } = render(<VideoCard video={makeVideo()} fluid />);
    const img = container.querySelector("img");
    const sizes = img!.getAttribute("data-sizes")!;
    // Expect three media-query breakpoints in the sizes string
    const breakpoints = sizes.split(",").map((s) => s.trim());
    expect(breakpoints.length).toBe(3);
    // Each breakpoint uses a calc() expression
    breakpoints.forEach((bp) => expect(bp).toContain("calc"));
  });
});
