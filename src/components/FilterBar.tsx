"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

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
            aria-pressed={value === opt.value}
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
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const setIsOpen = onOpenChange;

  // Animation state: keep modal mounted during exit transition
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let raf1: number | null = null;
    let raf2: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      setMounted(true);
      // Trigger enter animation on next frame so the transition fires
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (!cancelled) setVisible(true);
        });
      });
    } else {
      setVisible(false);
      // Fallback: unmount after transition + buffer in case transitionend doesn't fire
      // (e.g. when isOpen→false before the enter animation even started)
      timer = setTimeout(() => {
        if (!cancelled) setMounted(false);
      }, 250);
    }

    return () => {
      cancelled = true;
      if (raf1 !== null) cancelAnimationFrame(raf1);
      if (raf2 !== null) cancelAnimationFrame(raf2);
      if (timer !== null) clearTimeout(timer);
    };
  }, [isOpen]);

  // Keep a ref to the latest `visible` value so handleTransitionEnd never
  // reads a stale closure — critical when the modal is rapidly closed then
  // re-opened and child transitionend events bubble up before React has
  // committed the new `visible = true` state update.
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    // Ignore transitionend events that bubble up from child elements
    // (e.g. filter pill buttons with transition-colors) to prevent premature
    // unmounts caused by stale closures on rapid open/close cycles.
    if (e.target !== e.currentTarget) return;
    if (!visibleRef.current) setMounted(false);
  }, []); // stable — reads from ref, not stale closure

  // Focus management: save the trigger's focus, move focus into modal on open,
  // restore focus to the trigger when modal closes (WCAG 2.4.3 Focus Order).
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // rAF ensures the modal panel is in the DOM before we try to focus
      requestAnimationFrame(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      });
    } else {
      // Restore focus to the element that triggered the dialog
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Keyboard: Escape to close + Tab focus trap (WCAG 2.1.2 No Keyboard Trap).
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      // Focus trap: cycle Tab/Shift+Tab within the modal panel
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
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
          aria-labelledby="filter-dialog-title"
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-200 ${
            visible ? "bg-black/60" : "bg-black/0"
          }`}
          onTransitionEnd={handleTransitionEnd}
        >
          <button
            type="button"
            className="absolute inset-0 -z-10 cursor-default appearance-none border-none bg-transparent p-0"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
            tabIndex={-1}
          />
          <div
            ref={modalRef}
            className={`w-full bg-background shadow-2xl transition-all duration-200 sm:mx-4 sm:max-w-md sm:rounded-xl sm:border sm:border-n8 ${
              visible
                ? "max-sm:translate-y-0 sm:scale-100 opacity-100"
                : "max-sm:translate-y-full sm:scale-95 opacity-0"
            } max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[90dvh] max-sm:overflow-y-auto rounded-t-2xl max-sm:px-6 max-sm:pt-6 max-sm:pb-safe sm:p-6 sm:rounded-xl`}
          >
            {/* Mobile drag handle */}
            <div className="mb-4 flex justify-center sm:hidden">
              <div className="h-1 w-10 rounded-full bg-n7" />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <h2 id="filter-dialog-title" className="font-heading text-lg font-semibold text-n1">
                Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close filters"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-n6 transition-colors hover:bg-n8 hover:text-n3"
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
        </div>
      )}
    </>
  );
}

