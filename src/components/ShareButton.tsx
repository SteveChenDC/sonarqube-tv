"use client";

import { useState, useCallback } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail — clipboard access may be denied
    }
  }, []);

  return (
    <button
      onClick={handleShare}
      aria-label="Copy video link to clipboard"
      className={`relative inline-flex min-h-[36px] items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 ${
        copied
          ? "bg-qube-blue/20 text-qube-blue"
          : "bg-n8/60 text-n4 hover:bg-n8 hover:text-n2"
      }`}
    >
      {copied ? (
        <>
          {/* Checkmark icon */}
          <svg
            className="h-3.5 w-3.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Link copied!</span>
        </>
      ) : (
        <>
          {/* Share / link icon */}
          <svg
            className="h-3.5 w-3.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}
