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

  it("calls onOpenChange(false) when the close (X) button is clicked", () => {
    const { props } = renderFilterBar();
    // The close button is inside the modal header, next to the "Filters" heading
    const closeButton = screen.getByText("Filters").parentElement?.querySelector("button");
    if (!closeButton) throw new Error("Close button not found");
    fireEvent.click(closeButton);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when Escape is pressed", () => {
    const { props } = renderFilterBar();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when clicking the backdrop", () => {
    const { props } = renderFilterBar();
    const backdrop = screen.getByLabelText("Close filters");
    if (!backdrop) throw new Error("Backdrop button not found");
    fireEvent.click(backdrop);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("FilterBar — accessibility & active state", () => {
  it("modal has role='dialog' and aria-modal='true' when open", () => {
    renderFilterBar();
    const dialog = document.querySelector("[role='dialog']");
    expect(dialog).not.toBeNull();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("active upload date button has highlight class (bg-qube-blue)", () => {
    renderFilterBar({ uploadDate: "this-week" });
    const activeBtn = screen.getByText("This week");
    expect(activeBtn.className).toContain("bg-qube-blue");
  });

  it("inactive upload date buttons do NOT have the highlight class", () => {
    renderFilterBar({ uploadDate: "this-week" });
    const inactiveBtn = screen.getByText("Any time");
    expect(inactiveBtn.className).not.toContain("bg-qube-blue");
  });

  it("active duration button has highlight class", () => {
    renderFilterBar({ duration: "short" });
    const activeBtn = screen.getByText("Under 4 min");
    expect(activeBtn.className).toContain("bg-qube-blue");
  });

  it("active sort button has highlight class", () => {
    renderFilterBar({ sortBy: "oldest" });
    const activeBtn = screen.getByText("Oldest");
    expect(activeBtn.className).toContain("bg-qube-blue");
  });
});

describe("FilterBar — animation state lifecycle (mounted/visible)", () => {
  it("modal stays mounted in the DOM immediately after isOpen transitions from true to false", () => {
    // Open the modal first
    const { props, rerender } = renderFilterBar({ isOpen: true });
    expect(document.querySelector("[role='dialog']")).not.toBeNull();

    // Close the modal — mounted stays true while exit animation plays
    rerender(<FilterBar {...props} isOpen={false} />);

    // Modal must still be in the DOM — handleTransitionEnd hasn't fired yet
    expect(document.querySelector("[role='dialog']")).not.toBeNull();
  });

  it("modal unmounts from the DOM after transitionend fires when closing", () => {
    const { props, rerender } = renderFilterBar({ isOpen: true });

    // Transition to closed state
    rerender(<FilterBar {...props} isOpen={false} />);

    // Confirm still mounted during exit animation
    const dialog = document.querySelector("[role='dialog']")!;
    expect(dialog).not.toBeNull();

    // Simulate CSS transition completing — should trigger handleTransitionEnd → setMounted(false)
    fireEvent.transitionEnd(dialog);

    // Modal should now be fully unmounted
    expect(document.querySelector("[role='dialog']")).toBeNull();
  });

  it("backdrop has transparent class when isOpen transitions to false (visible=false)", () => {
    const { props, rerender } = renderFilterBar({ isOpen: true });

    rerender(<FilterBar {...props} isOpen={false} />);

    const dialog = document.querySelector("[role='dialog']")!;
    // visible=false → backdrop should use the transparent class, not the opaque one
    expect(dialog.className).toContain("bg-black/0");
    expect(dialog.className).not.toContain("bg-black/60");
  });

  it("re-opening the modal after close re-mounts and shows content", () => {
    const { props, rerender } = renderFilterBar({ isOpen: true });

    // Close
    rerender(<FilterBar {...props} isOpen={false} />);
    const dialog = document.querySelector("[role='dialog']")!;
    fireEvent.transitionEnd(dialog); // fully unmount

    expect(document.querySelector("[role='dialog']")).toBeNull();

    // Re-open
    rerender(<FilterBar {...props} isOpen={true} />);
    expect(document.querySelector("[role='dialog']")).not.toBeNull();
    expect(screen.getByText("Filters")).toBeInTheDocument();
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
