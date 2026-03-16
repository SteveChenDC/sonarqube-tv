import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Global mocks for Next.js components used across all test files
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

// Mock ResizeObserver for jsdom (used by VideoRow scroll arrows)
class MockResizeObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

// Mock IntersectionObserver for jsdom
// Immediately fires the callback with isIntersecting: true so lazy-loaded
// components (VideoRow, HomeContent floating filter) reveal their content in tests.
class MockIntersectionObserver {
  private cb: IntersectionObserverCallback;
  constructor(cb: IntersectionObserverCallback) { this.cb = cb; }
  observe(target: Element) {
    this.cb([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock scrollIntoView for jsdom (used by VideoRow keyboard navigation)
window.HTMLElement.prototype.scrollIntoView = () => { /* no-op */ };

afterEach(() => {
  cleanup();
});
