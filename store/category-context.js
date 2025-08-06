"use client";

import { createContext, useState } from "react";

export const CategoriesContext = createContext();

export default function CategoriesContextProvider({
  allCategories = [],
  children,
}) {
  const [categories, setCategories] = useState(allCategories);

  const value = {
    categories,
    setCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
