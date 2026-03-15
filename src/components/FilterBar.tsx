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
            className={`rounded-full px-4 py-2.5 sm:px-3 sm:py-1.5 font-heading text-sm sm:text-xs font-medium transition-colors ${
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
        <dialog
          open={mounted || undefined}
          aria-modal="true"
          className={`m-0 max-h-none max-w-none border-none bg-transparent p-0 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-200 ${
            visible ? "bg-black/60" : "bg-black/0"
          }`}
          onTransitionEnd={handleTransitionEnd}
        >
          <button
            type="button"
            className="fixed inset-0 -z-10 cursor-default appearance-none border-none bg-transparent p-0"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
            tabIndex={-1}
          />
          <div
            ref={modalRef}
            className={`relative w-full bg-background shadow-2xl transition-all duration-200 sm:mx-4 sm:max-w-md sm:rounded-xl sm:border sm:border-n8 ${
              visible
                ? "max-sm:translate-y-0 sm:scale-100 opacity-100"
                : "max-sm:translate-y-full sm:scale-95 opacity-0"
            } fixed inset-x-0 bottom-0 rounded-t-2xl p-6 sm:static sm:rounded-t-xl`}
          >
            {/* Mobile drag handle */}
            <div className="mb-4 flex justify-center sm:hidden">
              <div className="h-1 w-10 rounded-full bg-n7" />
            </div>
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

            <div className="mt-6 flex flex-col gap-3 border-t border-n8 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-qube-blue px-5 py-3 font-heading text-sm font-medium text-white transition-colors hover:bg-qube-blue/80 sm:order-2 sm:w-auto sm:py-2"
              >
                Apply
              </button>
              {hasActiveFilters && (
                <button
                  onClick={onReset}
                  className="w-full rounded-lg py-2 font-heading text-sm font-medium text-n6 transition-colors hover:text-n3 sm:order-1 sm:w-auto sm:py-0"
                >
                  Reset all
                </button>
              )}
            </div>
          </div>
        </dialog>
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
