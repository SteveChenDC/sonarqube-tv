"use client";

export function SlidersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

export function FilterTrigger({
  activeCount,
  onClick,
}: Readonly<{ activeCount: number; onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      aria-label="Filters"
      className="flex items-center gap-2 rounded-lg border border-qube-blue bg-qube-blue px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-md shadow-qube-blue/25 transition-all hover:bg-qube-blue/85 hover:shadow-lg hover:shadow-qube-blue/35 active:scale-95"
    >
      <span>Filters</span>
      <SlidersIcon />
      {activeCount > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-qube-blue">
          {activeCount}
        </span>
      )}
    </button>
  );
}
