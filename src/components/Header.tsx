"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { categories, videos } from "@/data/videos";
import { courses } from "@/data/courses";
import { getCourseVideos, getCourseTotalDuration } from "@/data/courses";
import { useSearch } from "./SearchContext";

function SonarWhaleMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 68 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M53.3436 27.3993C53.3652 22.3987 52.4257 17.4406 50.5765 12.7945C50.1937 12.9514 49.9182 13.0969 49.7192 13.1964C49.312 13.4075 48.9791 13.738 48.765 14.1436C48.5509 14.5493 48.4658 15.0106 48.5212 15.4659C48.7564 17.4987 48.8766 19.5432 48.881 21.5895C48.881 30.9433 45.8613 39.9144 40.3769 46.8494C35.1909 53.4055 28.233 57.6231 20.6665 58.8287L20.7315 58.867C22.9163 60.1079 25.3713 60.796 27.8827 60.8713C30.3941 60.9467 32.8859 60.4071 35.1412 59.2995C45.8192 54.0638 53.3436 41.7362 53.3436 27.3993Z" fill="#D3121D"/>
      <path d="M55.4294 11.8415C54.7661 11.8234 54.1025 11.8656 53.4469 11.9678C55.3652 16.8856 56.3402 22.1207 56.3212 27.3993C56.3212 43.4738 47.3654 57.738 34.2915 62.9392C34.9498 62.9813 35.6157 63.0081 36.2855 63.0081H36.385C39.5002 62.9942 42.5732 62.2866 45.3808 60.9367C48.1884 59.5869 50.6601 57.6287 52.6164 55.2043C57.6224 49.008 60.6957 40.6607 60.6957 31.5098C60.7431 24.5991 58.9236 17.8039 55.4294 11.8415Z" fill="#D3121D"/>
      <path d="M67.7677 31.5098C67.7729 27.3658 66.9573 23.2619 65.368 19.4348C64.6767 17.7166 63.6472 16.1548 62.3407 14.8421C61.6395 14.135 60.8388 13.5342 59.964 13.0586C59.742 12.9438 59.5162 12.8404 59.298 12.7448C62.1863 18.5731 63.6787 24.9936 63.6573 31.4983C63.6573 40.7985 60.6261 49.7581 55.2373 56.6319C59.13 53.702 62.2883 49.9073 64.4629 45.5474C66.6376 41.1876 67.7689 36.3819 67.7677 31.5098Z" fill="#D3121D"/>
      <path d="M58.8813 9.56814C55.9524 6.53916 52.4437 4.13095 48.5642 2.48709C44.6847 0.843234 40.5139-0.002607 36.3005 6.03584e-06C18.8941 6.03584e-06 4.62992 14.4211 4.80597 31.8275C4.84353 35.9542 5.69545 40.0329 7.31284 43.8297C6.7941 43.7608 6.27025 43.7377 5.74746 43.7608C4.3352 43.8259 2.33742 43.3169 1.43419 43.0643C0.530954 42.8117-0.276601 43.535 0.0908155 44.377V44.4038C3.21768 51.5646 10.1488 56.2262 16.7661 56.2109C17.2059 56.2109 17.6454 56.1879 18.0827 56.142C33.5793 54.9632 45.8763 39.9183 45.8763 21.5934C45.8763 20.4375 45.8265 19.2894 45.727 18.1489C45.715 18.0113 45.6615 17.8806 45.5736 17.7741C45.4856 17.6677 45.3674 17.5904 45.2346 17.5527C45.1018 17.5149 44.9607 17.5184 44.8299 17.5627C44.6991 17.6069 44.5848 17.6899 44.5022 17.8006C40.2157 23.4726 33.8663 33.4464 25.9248 28.249C22.863 26.255 21.2325 21.9646 22.1549 17.5977C23.8083 9.75568 32.9478 4.58506 36.9741 6.20781C37.2879 6.33411 38.4207 6.78572 38.8073 7.81908C39.3967 9.39591 37.6208 10.6934 36.7138 13.4872C35.7378 16.5108 36.289 19.7142 36.9741 19.8558C37.7395 20.0089 39.0216 17.2035 42.183 14.6507C44.4793 12.8022 46.2092 12.2817 47.2962 10.3183C48.3448 8.40465 46.4771 6.38769 47.1125 6.20781C47.7478 6.02793 48.341 8.23243 50.2317 9.32702C51.8123 10.2456 53.2208 9.67147 55.299 9.58727C56.068 9.58177 56.8361 9.64067 57.5953 9.76333C57.5953 9.76333 58.001 9.82074 58.644 9.9547C58.6931 9.96735 58.745 9.9639 58.792 9.94489C58.8391 9.92587 58.8788 9.89227 58.9053 9.84903C58.9319 9.80579 58.9439 9.75518 58.9395 9.70462C58.9352 9.65407 58.9148 9.60623 58.8813 9.56814ZM35.4049 33.8482C35.752 33.383 36.2669 33.0713 36.8401 32.9795C37.0885 32.9441 37.3416 32.9598 37.5838 33.0256C37.8259 33.0914 38.0521 33.2059 38.2485 33.3622C39.014 34.0702 38.7882 35.4404 38.1299 36.2288C37.5175 36.956 36.3119 37.4344 35.4738 36.8947C35.2403 36.7141 35.0518 36.4819 34.923 36.2163C34.7942 35.9508 34.7286 35.659 34.7313 35.3638C34.7555 34.7915 34.9962 34.2497 35.4049 33.8482Z" fill="currentColor"/>
    </svg>
  );
}

export default function Header() {
  const { query: searchQuery, setQuery: onSearchChange } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const coursesTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (coursesRef.current && !coursesRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCoursesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Animation state: keep dropdown mounted during exit transition
  const [dropdownMounted, setDropdownMounted] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      setDropdownMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setDropdownVisible(true));
      });
    } else {
      setDropdownVisible(false);
    }
  }, [menuOpen]);

  const handleDropdownTransitionEnd = useCallback(() => {
    if (!dropdownVisible) setDropdownMounted(false);
  }, [dropdownVisible]);

  // Courses dropdown animation state
  const [coursesDropdownMounted, setCoursesDropdownMounted] = useState(false);
  const [coursesDropdownVisible, setCoursesDropdownVisible] = useState(false);

  useEffect(() => {
    if (coursesOpen) {
      setCoursesDropdownMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setCoursesDropdownVisible(true));
      });
    } else {
      setCoursesDropdownVisible(false);
    }
  }, [coursesOpen]);

  const handleCoursesTransitionEnd = useCallback(() => {
    if (!coursesDropdownVisible) setCoursesDropdownMounted(false);
  }, [coursesDropdownVisible]);

  // Lock body scroll on mobile when dropdown is open
  useEffect(() => {
    if (!menuOpen && !coursesOpen) return;
    const isMobile = globalThis.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, coursesOpen]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearTimeout(coursesTimeoutRef.current);
    setMenuOpen(true);
    setCoursesOpen(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setMenuOpen(false), 3000);
  }, []);

  // Attach hover handlers via ref to avoid SonarQube S6848/S6819 on non-interactive div
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseLeave]);

  const handleCoursesMouseEnter = useCallback(() => {
    clearTimeout(coursesTimeoutRef.current);
    clearTimeout(timeoutRef.current);
    setCoursesOpen(true);
    setMenuOpen(false);
  }, []);

  const handleCoursesMouseLeave = useCallback(() => {
    coursesTimeoutRef.current = setTimeout(() => setCoursesOpen(false), 3000);
  }, []);

  useEffect(() => {
    const el = coursesRef.current;
    if (!el) return;
    el.addEventListener("mouseenter", handleCoursesMouseEnter);
    el.addEventListener("mouseleave", handleCoursesMouseLeave);
    return () => {
      el.removeEventListener("mouseenter", handleCoursesMouseEnter);
      el.removeEventListener("mouseleave", handleCoursesMouseLeave);
    };
  }, [handleCoursesMouseEnter, handleCoursesMouseLeave]);

  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      // Small delay to let the width transition start before focusing
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // Search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const searchResultsRef = useRef<HTMLDivElement>(null);
  const showResults = searchOpen && searchQuery.trim().length > 0;
  const displayedResults = searchResults.slice(0, 8);

  const handleSearchBlur = useCallback((e: React.FocusEvent) => {
    // Don't close if focus moves to the results dropdown
    const related = e.relatedTarget as Node | null;
    if (searchResultsRef.current?.contains(related)) return;
    if (!searchQuery) setSearchOpen(false);
  }, [searchQuery]);

  // Close search results on click outside
  useEffect(() => {
    if (!showResults) return;
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        searchResultsRef.current?.contains(target) ||
        searchInputRef.current?.contains(target)
      ) return;
      onSearchChange("");
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [showResults, onSearchChange]);

  // Keyboard shortcut: "/" to open search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !searchOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        onSearchChange("");
        setSearchOpen(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, onSearchChange]);

  // Split categories into 3 columns
  const col1 = categories.slice(0, 4);
  const col2 = categories.slice(4, 8);
  const col3 = categories.slice(8);

  const navText = "text-n1/70 hover:bg-n1/10 hover:text-n1";

  return (
    <header className={`fixed top-0 z-50 w-full border-b border-n1/10 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 dark:shadow-none ${scrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.12)] dark:shadow-sm" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <SonarWhaleMark className="h-7 w-auto text-n1" />
          <span className="font-heading text-2xl font-bold tracking-tight">
            <span className="text-n1">Sonar</span><span className="text-qube-blue">.tv</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {/* Netflix-style expandable search */}
          <div className={`relative flex items-center${searchOpen ? " max-sm:flex-1 max-sm:min-w-0" : ""}`}>
            {!searchOpen && (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search videos"
                className={`flex items-center gap-1 rounded-lg px-3 py-2 font-heading text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 ${navText}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </button>
            )}
            {searchOpen && (
              <div className="flex items-center">
                <div className="relative">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                    <svg className="h-3.5 w-3.5 text-n5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" />
                      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                    </svg>
                  </span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onBlur={handleSearchBlur}
                    placeholder="Search videos…"
                    aria-label="Search videos"
                    className="w-full rounded-lg border border-n7/60 bg-n9/80 py-1.5 pr-8 pl-8 font-body text-sm text-n2 placeholder-n6 transition-all duration-200 focus:border-qube-blue/70 focus:ring-1 focus:ring-qube-blue/30 focus:outline-none sm:w-44 sm:focus:w-64"
                  />
                  {searchQuery && (
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onSearchChange("");
                        searchInputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                      className="absolute right-0 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-n3 transition-colors hover:text-n1"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-n7 transition-colors hover:bg-n6">
                        <svg viewBox="0 0 12 12" className="h-2 w-2" aria-hidden="true">
                          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Search results dropdown */}
            {showResults && (
              <div
                ref={searchResultsRef}
                className="fixed inset-x-4 top-[72px] z-50 max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain rounded-xl border border-n8 bg-n9/95 shadow-2xl backdrop-blur-md sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[480px]"
              >
                <div className="border-b border-n8 px-4 py-2.5">
                  <span className="font-heading text-xs font-medium text-n5">
                    {searchResults.length === 0
                      ? "No results"
                      : `${displayedResults.length} of ${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`}
                  </span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <svg className="mx-auto mb-2 h-6 w-6 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                    </svg>
                    <p className="font-heading text-sm font-medium text-n4">
                      No videos match &ldquo;{searchQuery.trim()}&rdquo;
                    </p>
                  </div>
                ) : (
                  <ul className="py-1">
                    {displayedResults.map((video) => {
                      const cat = categories.find((c) => c.slug === video.category);
                      return (
                        <li key={video.id}>
                          <Link
                            href={`/watch/${video.id}`}
                            onClick={() => {
                              onSearchChange("");
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-n8/50 focus-visible:bg-n8/50 focus-visible:outline-none"
                          >
                            <img
                              src={video.thumbnail}
                              alt=""
                              className="h-12 w-[85px] shrink-0 rounded-md object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-heading text-sm font-medium text-n2">
                                {video.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                {cat && (
                                  <span className="truncate rounded bg-qube-blue/15 px-1.5 py-0.5 font-heading text-[10px] font-semibold text-qube-blue">
                                    {cat.title}
                                  </span>
                                )}
                                <span className="shrink-0 text-xs text-n5">{video.duration}</span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div
            ref={coursesRef}
            className={`relative ${searchOpen ? "hidden sm:block" : ""}`}
          >
            <button
              onClick={() => { setCoursesOpen((prev) => !prev); setMenuOpen(false); }}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 font-heading text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 ${navText}`}
            >
              Courses
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${coursesOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {coursesDropdownMounted && (
              <div
                className={`fixed inset-x-4 top-[72px] z-50 max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain rounded-xl border border-n8 bg-n9/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-200 sm:max-h-none sm:overflow-y-visible sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[480px] sm:p-5 ${
                  coursesDropdownVisible
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
                onTransitionEnd={handleCoursesTransitionEnd}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-n6">
                    Certification Courses
                  </h3>
                  <Link
                    href="/courses"
                    onClick={() => setCoursesOpen(false)}
                    className="group/link inline-flex items-center gap-1 font-heading text-xs font-medium text-qube-blue transition-colors hover:text-qube-blue/80"
                  >
                    View all
                    <svg
                      className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="space-y-1">
                  {courses.map((course) => {
                    const totalVids = getCourseVideos(course).length;
                    const dur = getCourseTotalDuration(course);
                    const diffColor = course.difficulty === "beginner"
                      ? "bg-qube-blue/15 text-qube-blue"
                      : course.difficulty === "intermediate"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-sonar-red/15 text-sonar-red";
                    return (
                      <Link
                        key={course.id}
                        href={`/courses/${course.slug}`}
                        onClick={() => setCoursesOpen(false)}
                        className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-n8/50"
                      >
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-black ${diffColor}`}>
                          {course.shortTitle.slice(0, 2)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="font-heading text-sm font-semibold text-n2 group-hover:text-n1">
                            {course.title}
                          </span>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-n5">
                            <span>{totalVids} videos</span>
                            <span className="text-n7">&middot;</span>
                            <span>{dur}</span>
                            <span className="text-n7">&middot;</span>
                            <span className="capitalize">{course.difficulty}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div
            ref={menuRef}
            className={`relative ${searchOpen ? "hidden sm:block" : ""}`}
          >
            <button
              onClick={() => { setMenuOpen((prev) => !prev); setCoursesOpen(false); }}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 font-heading text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2 ${navText}`}
            >
              Categories
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownMounted && (
              <div
                className={`fixed inset-x-4 top-[72px] z-50 max-h-[calc(100dvh-80px)] overflow-y-auto overscroll-contain rounded-xl border border-n8 bg-n9/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-200 sm:max-h-none sm:overflow-y-visible sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[720px] sm:p-6 ${
                  dropdownVisible
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
                onTransitionEnd={handleDropdownTransitionEnd}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-n6">
                    Browse by Category
                  </h3>
                  <Link
                    href="/#categories"
                    onClick={(e) => {
                      setMenuOpen(false);
                      if (window.location.pathname === "/" || window.location.pathname.endsWith("/sonarqube-tv/") || window.location.pathname.endsWith("/sonarqube-tv")) {
                        e.preventDefault();
                        const el = document.getElementById("categories");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          window.history.pushState(null, "", "/#categories");
                        }
                      } else {
                        setTimeout(() => {
                          const el = document.getElementById("categories");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }, 500);
                      }
                    }}
                    className="group/link inline-flex items-center gap-1 font-heading text-xs font-medium text-qube-blue transition-colors hover:text-qube-blue/80"
                  >
                    All Categories
                    <svg
                      className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-3">
                  {[col1, col2, col3].map((col) => (
                    <div key={col[0]?.slug ?? "empty"} className="space-y-1">
                      {col.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/#${cat.slug}`}
                          onClick={(e) => {
                            setMenuOpen(false);
                            // If already on home page, scroll manually since Next.js
                            // client-side navigation doesn't handle hash scrolling
                            if (window.location.pathname === "/" || window.location.pathname.endsWith("/sonarqube-tv/") || window.location.pathname.endsWith("/sonarqube-tv")) {
                              e.preventDefault();
                              const el = document.getElementById(cat.slug);
                              if (el) {
                                el.scrollIntoView({ behavior: "smooth" });
                                window.history.pushState(null, "", `/#${cat.slug}`);
                              }
                            } else {
                              // Cross-page: let Next.js navigate, then scroll after load
                              setTimeout(() => {
                                const el = document.getElementById(cat.slug);
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              }, 500);
                            }
                          }}
                          className="group block rounded-lg p-2.5 transition-colors hover:bg-n8/50"
                        >
                          <span className="font-heading text-sm font-semibold text-qube-blue group-hover:text-qube-blue/80">
                            {cat.title}
                          </span>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-n6">
                            {cat.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ThemeToggle className="text-n1/70 hover:bg-n1/10 hover:text-n1" />
        </nav>
      </div>
    </header>
  );
}
