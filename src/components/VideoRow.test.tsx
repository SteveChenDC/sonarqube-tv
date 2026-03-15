import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import VideoRow from "./VideoRow";
import type { Video } from "@/types";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

const makeVideo = (id: string): Video => ({
  id,
  title: `Video ${id}`,
  description: "desc",
  youtubeId: `yt-${id}`,
  thumbnail: `/thumb-${id}.jpg`,
  category: "tutorials",
  duration: "10:00",
  publishedAt: "2025-01-01T00:00:00Z",
});

describe("VideoRow", () => {
  it("renders nothing when videos array is empty", () => {
    const { container } = render(
      <VideoRow title="Empty Row" categorySlug="tutorials" videos={[]} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title as a link to the category page with all video cards", () => {
    const videos = [makeVideo("v1"), makeVideo("v2"), makeVideo("v3")];
    const { getByText, getAllByText, container } = render(
      <VideoRow title="Tutorials" categorySlug="tutorials" videos={videos} />
    );
    // Title is a clickable link to the category page
    const titleEl = getByText("Tutorials");
    expect(titleEl.closest("a")).toHaveAttribute("href", "/category/tutorials");
    // All video cards rendered (may appear in both mobile + desktop layouts)
    expect(getAllByText("Video v1").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Video v2").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Video v3").length).toBeGreaterThanOrEqual(1);
  });

  it("scroll buttons call scrollBy on the container", () => {
    const videos = [makeVideo("v1")];
    const scrollBySpy = vi.fn();
    // Mock scrollBy on the scroll container
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string, options?: ElementCreationOptions) => {
      const el = originalCreateElement(tag, options);
      if (tag === "div") {
        Object.defineProperty(el, "scrollBy", { value: scrollBySpy, writable: true });
      }
      return el;
    });

    const { getByLabelText } = render(
      <VideoRow title="Row" categorySlug="cat" videos={videos} />
    );

    fireEvent.click(getByLabelText("Scroll right"));
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 340, behavior: "smooth" });

    fireEvent.click(getByLabelText("Scroll left"));
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -340, behavior: "smooth" });

    vi.restoreAllMocks();
  });
});
