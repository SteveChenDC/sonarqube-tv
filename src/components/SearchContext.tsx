"use client";

import { createContext, useContext, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Split-context design: two separate contexts so components can subscribe to
// only what they need.
//
//  SearchQueryContext  — holds the raw query string + mutators.
//                        Changes on every keystroke. Consumed by Header.
//  SearchIsSearchingContext — holds a stable boolean: true when query is
//                        non-empty. Only changes on empty↔non-empty
//                        transitions. Consumed by HomeContent and similar
//                        components that only care about "are we searching?",
//                        not the exact query text.
//
// Benefit: HomeContent (11 VideoRows + CourseCards) no longer re-renders on
// every character typed — only when the user starts or stops searching.
// ---------------------------------------------------------------------------

interface SearchQueryContextValue {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
}

const SearchQueryContext = createContext<SearchQueryContextValue>({
  query: "",
  setQuery: () => {},
  clearQuery: () => {},
});

const SearchIsSearchingContext = createContext<boolean>(false);

export function SearchProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [query, setQuery] = useState("");
  const clearQuery = useCallback(() => setQuery(""), []);
  const isSearching = query.trim().length > 0;

  return (
    <SearchIsSearchingContext.Provider value={isSearching}>
      <SearchQueryContext.Provider value={{ query, setQuery, clearQuery }}>
        {children}
      </SearchQueryContext.Provider>
    </SearchIsSearchingContext.Provider>
  );
}

/** Full search context — query string + mutators. Re-renders on every keystroke. */
export function useSearch(): SearchQueryContextValue {
  return useContext(SearchQueryContext);
}

/**
 * Subscribe only to the isSearching boolean.
 * Components using this hook only re-render when the user starts or stops
 * searching — NOT on every character typed.
 */
export function useIsSearching(): boolean {
  return useContext(SearchIsSearchingContext);
}
