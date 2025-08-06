"use client";

import { createContext, useState } from "react";

export const ProductReviewContext = createContext();

export default function ProductReviewContextProvider({
  children,
  reviewItems = [],
  rating,
}) {
  const [reviews, setReviews] = useState(reviewItems);
  const [userRating, setUserRating] = useState(rating || 0);

  const value = {
    reviews,
    userRating,
    setUserRating,
    setReviews,
  };

  return <ProductReviewContext value={value}>{children}</ProductReviewContext>;
}
