"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
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
      className={`fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-n8 bg-n9/90 text-n5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-n7 hover:bg-n8 hover:text-n1 focus-visible:ring-2 focus-visible:ring-qube-blue focus-visible:outline-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Top bar — indicates "go to the very top" */}
        <line x1="5" y1="4" x2="19" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Upward arrow */}
        <path
          d="M12 20V8M12 8l-5 5M12 8l5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
