"use client";
import { createContext, useState } from "react";

export const SearchModalContext = createContext();

export default function SearchModalContextProvider({ children }) {
  const [isSearchModal, setIsSearchModal] = useState(false);

  const value = {
    isSearchModal,
    setIsSearchModal,
  };

  return <SearchModalContext value={value}>{children}</SearchModalContext>;
}
