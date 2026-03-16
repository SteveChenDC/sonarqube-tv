"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
}

const SearchContext = createContext<SearchContextValue>({
  query: "",
  setQuery: () => {},
  clearQuery: () => {},
});

export function SearchProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [query, setQuery] = useState("");
  const clearQuery = useCallback(() => setQuery(""), []);
  return (
    <SearchContext.Provider value={{ query, setQuery, clearQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
