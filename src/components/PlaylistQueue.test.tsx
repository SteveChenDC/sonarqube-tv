import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaylistQueue from "./PlaylistQueue";
import { makeVideo } from "@/__tests__/factories";

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

const videos = [
  makeVideo({ id: "v1", category: "tutorials", title: "First Tutorial" }),
  makeVideo({ id: "v2", category: "tutorials", title: "Second Tutorial" }),
  makeVideo({ id: "v3", category: "tutorials", title: "Third Tutorial" }),
  makeVideo({ id: "v4", category: "webinars", title: "A Webinar" }),
];

describe("PlaylistQueue", () => {
  it("renders nothing when no playlist param is present", () => {
    mockSearchParams.delete("playlist");
    const { container } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={videos} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when playlist has no matching videos", () => {
    mockSearchParams.set("playlist", "nonexistent");
    const { container } = render(
      <PlaylistQueue currentVideoId="v1" allVideos={videos} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders playlist videos filtered by category", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    expect(screen.getByText("First Tutorial")).toBeTruthy();
    expect(screen.getByText("Second Tutorial")).toBeTruthy();
    expect(screen.getByText("Third Tutorial")).toBeTruthy();
    expect(screen.queryByText("A Webinar")).toBeNull();
  });

  it("shows correct position counter (1 / 3 for first video)", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);
    expect(screen.getByText("1 / 3")).toBeTruthy();
  });

  it("shows correct position counter (2 / 3 for middle video)", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);
    expect(screen.getByText("2 / 3")).toBeTruthy();
  });

  it("disables prev button on first video and enables next", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v1" allVideos={videos} />);

    // Next should be a link
    expect(screen.getByLabelText("Next video")).toBeTruthy();
    expect(
      screen.getByLabelText("Next video").getAttribute("href"),
    ).toBe("/watch/v2?playlist=tutorials");

    // Prev should not exist as a link (it's a disabled span)
    expect(screen.queryByLabelText("Previous video")).toBeNull();
  });

  it("disables next button on last video and enables prev", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v3" allVideos={videos} />);

    expect(screen.getByLabelText("Previous video")).toBeTruthy();
    expect(
      screen.getByLabelText("Previous video").getAttribute("href"),
    ).toBe("/watch/v2?playlist=tutorials");

    expect(screen.queryByLabelText("Next video")).toBeNull();
  });

  it("enables both prev and next for middle video", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    expect(
      screen.getByLabelText("Previous video").getAttribute("href"),
    ).toBe("/watch/v1?playlist=tutorials");
    expect(
      screen.getByLabelText("Next video").getAttribute("href"),
    ).toBe("/watch/v3?playlist=tutorials");
  });

  it("highlights the currently playing video", () => {
    mockSearchParams.set("playlist", "tutorials");
    render(<PlaylistQueue currentVideoId="v2" allVideos={videos} />);

    // Current video title should have the active highlight classes
    const currentTitle = screen.getByText("Second Tutorial");
    expect(currentTitle.className).toContain("font-semibold");
    expect(currentTitle.className).toContain("text-n1");

    // Other titles should have the inactive class
    const otherTitle = screen.getByText("First Tutorial");
    expect(otherTitle.className).toContain("text-n3");
    expect(otherTitle.className).not.toMatch(/(?<!\S)text-n1(?!\S)/);
  });
});
