"use client";

import {
  getBestSelling,
  getNewArrivals,
  getTopRatedProducts,
} from "@/lib/featured";

import { createContext, useState } from "react";

export const FeaturedContext = createContext();

export default function FeaturedContextProvider({
  children,
  topRatedItems = [],
  productsError,
}) {

  const [featuredProducts, setFeaturedProducts] = useState(topRatedItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(productsError);

  async function switchProducts(mode) {
    setIsLoading(true);
    if (mode === "Top rated") {
      let topRated;

      try {
        topRated = await getTopRatedProducts();
        setFeaturedProducts(topRated);
      } catch (error) {
        console.log(error.message);
        setFeaturedProducts([]);
        setIsError(true);
      }
    }
    if (mode === "New arrivals") {
      let newArrivals;

      try {
        newArrivals = await getNewArrivals();
        setFeaturedProducts(newArrivals);
      } catch (error) {
        console.log(error.message);
        setFeaturedProducts([]);
        setIsError(true);
      }
    }
    if (mode === "Best selling") {
      let bestSelling;
      try {
        bestSelling = await getBestSelling();
        setFeaturedProducts(bestSelling);
      } catch (error) {
        console.log(error.message);
        setFeaturedProducts([]);
        setIsError(true);
      }
    }
    setIsLoading(false);
  }

  const value = {
    featuredProducts,
    switchProducts,
    isLoading,
    isError,
  };

  return <FeaturedContext value={value}>{children}</FeaturedContext>;
}
