const STORAGE_KEY = "sonarqube-tv-theme";
type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (globalThis.window === undefined) return "dark";
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (globalThis.window === undefined) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return null;
  } catch {
    return null;
  }
}

export function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function setTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function toggleTheme(): Theme {
  const current = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  const next: Theme = current === "dark" ? "light" : "dark";

  // Enable smooth color transition only during intentional toggle,
  // not on page load or navigation
  document.documentElement.classList.add("theme-transitioning");
  setTheme(next);

  // Remove after transition completes to avoid unwanted transitions elsewhere
  const cleanup = () => {
    document.documentElement.classList.remove("theme-transitioning");
  };
  document.documentElement.addEventListener("transitionend", cleanup, { once: true });
  // Fallback in case transitionend doesn't fire
  setTimeout(cleanup, 600);

  return next;
}

export function subscribeToSystemTheme(
  callback: (theme: Theme) => void
): () => void {
  const mql = globalThis.matchMedia("(prefers-color-scheme: dark)");
  function handler(e: MediaQueryListEvent) {
    if (!getStoredTheme()) {
      const theme: Theme = e.matches ? "dark" : "light";
      setTheme(theme);
      callback(theme);
    }
  }
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}
