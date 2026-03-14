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

  it("renders title, See All link, Watch All link, and all video cards", () => {
    const videos = [makeVideo("v1"), makeVideo("v2"), makeVideo("v3")];
    const { getByText, container } = render(
      <VideoRow title="Tutorials" categorySlug="tutorials" videos={videos} />
    );
    expect(getByText("Tutorials")).toBeTruthy();
    expect(getByText("See All")).toBeTruthy();
    expect(getByText("Watch All")).toBeTruthy();
    // See All links to category page
    const seeAllLink = container.querySelector('a[href="/category/tutorials"]');
    expect(seeAllLink).toBeTruthy();
    // Watch All links to first video with playlist param
    const watchAllLink = container.querySelector('a[href="/watch/v1?playlist=tutorials"]');
    expect(watchAllLink).toBeTruthy();
    // All video cards rendered
    expect(getByText("Video v1")).toBeTruthy();
    expect(getByText("Video v2")).toBeTruthy();
    expect(getByText("Video v3")).toBeTruthy();
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
