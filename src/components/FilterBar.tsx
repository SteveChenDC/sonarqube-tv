"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UploadDateFilter = "anytime" | "today" | "this-week" | "this-month" | "this-year";
export type DurationFilter = "any" | "short" | "medium" | "long";
export type SortBy = "newest" | "oldest";

interface FilterBarProps {
  uploadDate: UploadDateFilter;
  duration: DurationFilter;
  sortBy: SortBy;
  onUploadDateChange: (value: UploadDateFilter) => void;
  onDurationChange: (value: DurationFilter) => void;
  onSortByChange: (value: SortBy) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const uploadDateOptions: { value: UploadDateFilter; label: string }[] = [
  { value: "anytime", label: "Any time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "this-year", label: "This year" },
];

const durationOptions: { value: DurationFilter; label: string }[] = [
  { value: "any", label: "Any duration" },
  { value: "short", label: "Under 4 min" },
  { value: "medium", label: "4\u201320 min" },
  { value: "long", label: "Over 20 min" },
];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

function SlidersIcon() {
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

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: Readonly<{
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}>) {
  return (
    <div className="space-y-2">
      <span className="font-heading text-xs font-medium uppercase tracking-wider text-n6">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1.5 font-heading text-xs font-medium transition-colors ${
              value === opt.value
                ? "bg-qube-blue text-white"
                : "bg-n8 text-n4 hover:bg-n7 hover:text-n2"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({
  uploadDate,
  duration,
  sortBy,
  onUploadDateChange,
  onDurationChange,
  onSortByChange,
  onReset,
  hasActiveFilters,
  isOpen,
  onOpenChange,
}: Readonly<FilterBarProps>) {
  const modalRef = useRef<HTMLDivElement>(null);
  const setIsOpen = onOpenChange;

  // Animation state: keep modal mounted during exit transition
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Trigger enter animation on next frame so the transition fires
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleTransitionEnd = useCallback(() => {
    if (!visible) setMounted(false);
  }, [visible]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-200 ${
            visible ? "bg-black/60" : "bg-black/0"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <div
            ref={modalRef}
            className={`mx-4 w-full max-w-md rounded-xl border border-n8 bg-background p-6 shadow-2xl transition-all duration-200 ${
              visible
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-n1">
                Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-n6 transition-colors hover:bg-n8 hover:text-n3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <FilterGroup
                label="Upload date"
                options={uploadDateOptions}
                value={uploadDate}
                onChange={onUploadDateChange}
              />
              <FilterGroup
                label="Duration"
                options={durationOptions}
                value={duration}
                onChange={onDurationChange}
              />
              <FilterGroup
                label="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={onSortByChange}
              />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-n8 pt-4">
              {hasActiveFilters ? (
                <button
                  onClick={onReset}
                  className="font-heading text-sm font-medium text-n6 transition-colors hover:text-n3"
                >
                  Reset all
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-qube-blue px-5 py-2 font-heading text-sm font-medium text-white transition-colors hover:bg-qube-blue/80"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
      className="flex items-center gap-2 rounded-lg border border-qube-blue/60 bg-qube-blue/20 px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-md shadow-qube-blue/10 backdrop-blur-md transition-all hover:border-qube-blue hover:bg-qube-blue/30 hover:shadow-lg hover:shadow-qube-blue/20 active:scale-95"
    >
      <span>Filters</span>
      <SlidersIcon />
      {activeCount > 0 && (
        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-qube-blue text-xs font-bold text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}
