import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchProvider, useSearch } from "./SearchContext";

// Helper consumer component that exposes context values via data attributes and buttons
function Consumer() {
  const { query, setQuery, clearQuery } = useSearch();
  return (
    <div>
      <span data-testid="query">{query}</span>
      <button onClick={() => setQuery("hello")}>Set hello</button>
      <button onClick={() => setQuery("world")}>Set world</button>
      <button onClick={clearQuery}>Clear</button>
    </div>
  );
}

describe("SearchContext", () => {
  it("provides default empty query", () => {
    render(
      <SearchProvider>
        <Consumer />
      </SearchProvider>
    );
    expect(screen.getByTestId("query").textContent).toBe("");
  });

  it("renders children inside the provider", () => {
    render(
      <SearchProvider>
        <p>child content</p>
      </SearchProvider>
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("setQuery updates the query value", () => {
    render(
      <SearchProvider>
        <Consumer />
      </SearchProvider>
    );
    act(() => {
      screen.getByText("Set hello").click();
    });
    expect(screen.getByTestId("query").textContent).toBe("hello");
  });

  it("clearQuery resets query to empty string", () => {
    render(
      <SearchProvider>
        <Consumer />
      </SearchProvider>
    );
    act(() => {
      screen.getByText("Set world").click();
    });
    expect(screen.getByTestId("query").textContent).toBe("world");

    act(() => {
      screen.getByText("Clear").click();
    });
    expect(screen.getByTestId("query").textContent).toBe("");
  });

  it("setQuery can be called multiple times with different values", () => {
    render(
      <SearchProvider>
        <Consumer />
      </SearchProvider>
    );
    act(() => {
      screen.getByText("Set hello").click();
    });
    expect(screen.getByTestId("query").textContent).toBe("hello");

    act(() => {
      screen.getByText("Set world").click();
    });
    expect(screen.getByTestId("query").textContent).toBe("world");
  });

  it("useSearch returns default values when used outside provider", () => {
    // The context has default no-op values — no throw expected
    function Standalone() {
      const { query } = useSearch();
      return <span data-testid="q">{query}</span>;
    }
    render(<Standalone />);
    expect(screen.getByTestId("q").textContent).toBe("");
  });
});
