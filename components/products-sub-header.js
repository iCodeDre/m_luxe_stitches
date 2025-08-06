"use client";

import { use, useActionState, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import classes from "./products-sub-header.module.css";
import { SearchModalContext } from "@/store/search-modal-context";
import { CartContext } from "@/store/cart-context";

const allowedSorts = [
  "latest",
  "rating",
  "price-high-to-low",
  "price-low-to-high",
];

function ProductsSubHeader({ label, totalProducts, currentPage }) {
  const { isCartModal, setIsCartModal } = use(CartContext);
  const { isSearchModal, setIsSearchModal } = use(SearchModalContext);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [sortState, setSortState] = useState("");
  const [formState, formAction] = useActionState(sortProducts, {});

  useEffect(() => {
    if (isSearchModal) {
      setIsSearchModal(false);
    }
    if (isCartModal) {
      setIsCartModal(false);
    }
  }, []);

  useEffect(() => {
    const activeSort = searchParams.get("sortBy");

    if (!activeSort && sortState === "") return;

    if (allowedSorts.includes(activeSort)) {
      setSortState(activeSort);
    } else {
      setSortState("");
      if (!path.includes("search")) {
        router.replace(`${path}`);
      } else {
        const searchCat = searchParams.get("searchCat");
        router.replace(`${path}?searchCat=${searchCat}`);
      }
    }
  }, [path, searchParams]);

  function sortProducts(prevState, formData) {
    const sortName = formData.get("sort");

    if (sortName === "default order") {
      if (!path.includes("search")) {
        router.replace(`${path}`);
      } else {
        const searchCat = searchParams.get("searchCat");
        router.replace(`${path}?searchCat=${searchCat}`);
      }

      return;
    }

    if (!path.includes("search")) {
      router.replace(`${path}?sortBy=${sortName}`);
    } else {
      const searchCat = searchParams.get("searchCat");
      router.replace(`${path}?searchCat=${searchCat}&sortBy=${sortName}`);
    }

    return {};
  }

  return (
    <div className={classes.productsSubHeader}>
      <div>
        <p>{label}</p>{" "}
        {totalProducts <= 12 ? (
          <p>(showing all {totalProducts} products)</p>
        ) : (
          <p>
            (showing {currentPage} - 12 of {totalProducts} products)
          </p>
        )}
      </div>

      <div>
        <form action={formAction}>
          <select
            id="sort"
            name="sort"
            value={sortState || "default order"}
            onChange={(e) => {
              e.target.form.requestSubmit();
            }}
          >
            <option value="default order">Default order</option>
            <option value="latest">Sort by latest</option>
            <option value="rating">Sort by rating</option>
            <option value="price-high-to-low">
              Sort by price: High to low
            </option>
            <option value="price-low-to-high">
              Sort by price: Low to high
            </option>
          </select>
        </form>
      </div>
    </div>
  );
}

export default ProductsSubHeader;
