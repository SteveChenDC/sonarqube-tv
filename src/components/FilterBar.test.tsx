import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import FilterBar, { FilterTrigger } from "./FilterBar";

afterEach(cleanup);

function renderFilterBar(overrides = {}) {
  const props = {
    uploadDate: "anytime" as const,
    duration: "any" as const,
    sortBy: "newest" as const,
    onUploadDateChange: vi.fn(),
    onDurationChange: vi.fn(),
    onSortByChange: vi.fn(),
    onReset: vi.fn(),
    hasActiveFilters: false,
    isOpen: true,
    onOpenChange: vi.fn(),
    ...overrides,
  };
  const result = render(<FilterBar {...props} />);
  return { ...result, props };
}

describe("FilterBar", () => {
  it("renders nothing when closed", () => {
    const { container } = renderFilterBar({ isOpen: false });
    expect(container.innerHTML).toBe("");
  });

  it("renders the modal with filter groups when open", () => {
    renderFilterBar();
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Upload date")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("renders all upload date options", () => {
    renderFilterBar();
    expect(screen.getByText("Any time")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("This week")).toBeInTheDocument();
    expect(screen.getByText("This month")).toBeInTheDocument();
    expect(screen.getByText("This year")).toBeInTheDocument();
  });

  it("renders all duration options", () => {
    renderFilterBar();
    expect(screen.getByText("Any duration")).toBeInTheDocument();
    expect(screen.getByText("Under 4 min")).toBeInTheDocument();
    expect(screen.getByText("4–20 min")).toBeInTheDocument();
    expect(screen.getByText("Over 20 min")).toBeInTheDocument();
  });

  it("calls onUploadDateChange when an upload date option is clicked", () => {
    const { props } = renderFilterBar();
    fireEvent.click(screen.getByText("This week"));
    expect(props.onUploadDateChange).toHaveBeenCalledWith("this-week");
  });

  it("calls onDurationChange when a duration option is clicked", () => {
    const { props } = renderFilterBar();
    fireEvent.click(screen.getByText("Under 4 min"));
    expect(props.onDurationChange).toHaveBeenCalledWith("short");
  });

  it("calls onSortByChange when a sort option is clicked", () => {
    const { props } = renderFilterBar();
    fireEvent.click(screen.getByText("Oldest"));
    expect(props.onSortByChange).toHaveBeenCalledWith("oldest");
  });

  it("shows Reset all button when hasActiveFilters is true", () => {
    renderFilterBar({ hasActiveFilters: true });
    expect(screen.getByText("Reset all")).toBeInTheDocument();
  });

  it("does not show Reset all when hasActiveFilters is false", () => {
    renderFilterBar({ hasActiveFilters: false });
    expect(screen.queryByText("Reset all")).not.toBeInTheDocument();
  });

  it("calls onReset when Reset all is clicked", () => {
    const { props } = renderFilterBar({ hasActiveFilters: true });
    fireEvent.click(screen.getByText("Reset all"));
    expect(props.onReset).toHaveBeenCalledOnce();
  });

  it("calls onOpenChange(false) when Apply is clicked", () => {
    const { props } = renderFilterBar();
    fireEvent.click(screen.getByText("Apply"));
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when Escape is pressed", () => {
    const { props } = renderFilterBar();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when clicking the backdrop", () => {
    const { props } = renderFilterBar();
    // The backdrop is the outer fixed div
    const backdrop = screen.getByText("Filters").closest(".fixed");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("FilterTrigger", () => {
  it("renders the Filters button", () => {
    render(<FilterTrigger activeCount={0} onClick={vi.fn()} />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("shows active filter count badge when count > 0", () => {
    render(<FilterTrigger activeCount={3} onClick={vi.fn()} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show badge when count is 0", () => {
    const { container } = render(
      <FilterTrigger activeCount={0} onClick={vi.fn()} />
    );
    expect(container.querySelector(".rounded-full")).toBeNull();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<FilterTrigger activeCount={0} onClick={onClick} />);
    fireEvent.click(screen.getByText("Filters"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
