"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop({ hidden = false }: Readonly<{ hidden?: boolean }>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-n8 bg-n9/90 text-n5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-n7 hover:bg-n8 hover:text-n1 focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:outline-none ${
        visible && !hidden
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="19" x2="12" y2="6" />
        <polyline points="6 11 12 5 18 11" />
        <line x1="5" y1="3" x2="19" y2="3" />
      </svg>
    </button>
  );
}
