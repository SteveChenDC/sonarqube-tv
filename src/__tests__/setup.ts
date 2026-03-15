import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Mock matchMedia for theme detection in tests
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock IntersectionObserver for jsdom (used by HomeContent floating filter)
class MockIntersectionObserver {
  observe() { /* no-op for test mock */ }
  unobserve() { /* no-op for test mock */ }
  disconnect() { /* no-op for test mock */ }
}
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

afterEach(() => {
  cleanup();
});
