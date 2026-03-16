"use client";

import { useState, useEffect } from "react";
import {
  getEffectiveTheme,
  toggleTheme,
  subscribeToSystemTheme,
} from "@/lib/theme";

export default function ThemeToggle({ className }: Readonly<{ className?: string }>) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getEffectiveTheme());
    const unsub = subscribeToSystemTheme((t) => setTheme(t));
    return unsub;
  }, []);

  function handleToggle() {
    const next = toggleTheme();
    setTheme(next);
  }

  if (!mounted) {
    return <div className="h-11 w-11" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300 active:scale-90 ${className ?? "text-n6 hover:bg-n8/50 hover:text-n1"}`}
    >
      <span className="relative block h-5 w-5">
        <svg
          className={`absolute inset-0 h-5 w-5 transition-[transform,opacity] duration-500 ease-in-out ${isDark ? "rotate-0 scale-100 opacity-100" : "rotate-180 scale-0 opacity-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          className={`absolute inset-0 h-5 w-5 transition-[transform,opacity] duration-500 ease-in-out ${isDark ? "-rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
