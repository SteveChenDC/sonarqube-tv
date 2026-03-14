const STORAGE_KEY = "sonarqube-tv-theme";
type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof globalThis.window === "undefined") return "dark";
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof globalThis.window === "undefined") return null;
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
  setTheme(next);
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
