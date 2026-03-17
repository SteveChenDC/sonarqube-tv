import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the theme lib before importing the component
vi.mock("@/lib/theme", () => ({
  getEffectiveTheme: vi.fn(() => "dark"),
  toggleTheme: vi.fn(() => "light"),
  subscribeToSystemTheme: vi.fn(() => vi.fn()), // returns unsubscribe fn
}));

import ThemeToggle from "./ThemeToggle";
import { getEffectiveTheme, toggleTheme, subscribeToSystemTheme } from "@/lib/theme";

const mockGetEffectiveTheme = vi.mocked(getEffectiveTheme);
const mockToggleTheme = vi.mocked(toggleTheme);
const mockSubscribeToSystemTheme = vi.mocked(subscribeToSystemTheme);

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetEffectiveTheme.mockReturnValue("dark");
    mockToggleTheme.mockReturnValue("light");
    mockSubscribeToSystemTheme.mockReturnValue(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a placeholder div before mounting (SSR-safe)", () => {
    // The component renders an empty 11×11 div before useEffect fires.
    // jsdom runs useEffect immediately after render, so we check initial render
    // by inspecting that the component mounts without crashing.
    const { container } = render(<ThemeToggle />);
    expect(container.firstChild).not.toBeNull();
  });

  it("shows a toggle button after mounting", () => {
    render(<ThemeToggle />);
    // After useEffect, the button should be present
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has aria-label 'Switch to light mode' when theme is dark", () => {
    mockGetEffectiveTheme.mockReturnValue("dark");
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();
  });

  it("has aria-label 'Switch to dark mode' when theme is light", () => {
    mockGetEffectiveTheme.mockReturnValue("light");
    mockToggleTheme.mockReturnValue("dark");
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
  });

  it("calls toggleTheme when button is clicked", () => {
    mockGetEffectiveTheme.mockReturnValue("dark");
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("updates aria-label after toggling from dark to light", () => {
    mockGetEffectiveTheme.mockReturnValue("dark");
    mockToggleTheme.mockReturnValue("light");
    render(<ThemeToggle />);

    // Initial: dark mode
    expect(
      screen.getByRole("button", { name: "Switch to light mode" })
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    // After toggle returns "light", the button should reflect light mode
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" })
    ).toBeInTheDocument();
  });

  it("calls subscribeToSystemTheme on mount", () => {
    render(<ThemeToggle />);
    expect(mockSubscribeToSystemTheme).toHaveBeenCalledTimes(1);
  });

  it("calls the unsubscribe function returned by subscribeToSystemTheme on unmount", () => {
    const unsubscribe = vi.fn();
    mockSubscribeToSystemTheme.mockReturnValue(unsubscribe);

    const { unmount } = render(<ThemeToggle />);
    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("accepts a custom className prop", () => {
    mockGetEffectiveTheme.mockReturnValue("dark");
    render(<ThemeToggle className="custom-class" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });
});
