"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import classes from "../products-sub-header.module.css";

import { filterOrdersAction } from "@/actions/order-sub-header-actions";

import SearchOrdersForm from "./search-order-form";

import searchImg from "@/assets/UI/search-icon.svg";

function OrderSubHeader({ label, totalProducts, currentPage, orderId }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter");
  const searchFilter = searchParams.get("searchFilter");

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        !event.target.closest("#search-form") &&
        !event.target.closest(".profileSearch")
      )
        setIsSearching(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const [formState, formAction] = useActionState(
    filterOrdersAction(router, path, searchParams),
    {}
  );

  let className = classes.productsSubHeader;

  if (label === "order-detail") {
    className = `${classes.productsSubHeader} ${classes.forOrderHeader}`;
  }

  if (orderId) {
    return (
      <div key={activeFilter} className={className}>
        <div>
          <p></p>

          <p>
            showing {totalProducts > 1 ? "all" : ""} {totalProducts}{" "}
            {totalProducts > 1 ? "orders" : "order"}
            {` for the order no: ${orderId}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div key={activeFilter} className={classes.productsSubHeader}>
      <div>
        <p>{label}</p>
        {totalProducts <= 12 ? (
          <p>
            showing {totalProducts > 1 ? "all" : ""} {totalProducts}{" "}
            {!searchFilter && activeFilter}{" "}
            {searchFilter && `${activeFilter !== null ? activeFilter : ""} `}
            {totalProducts > 1 ? "orders" : "order"}
            {searchFilter && ` for the search term: ${searchFilter}`}
          </p>
        ) : (
          <p>
            showing {currentPage} - 12 of {totalProducts}{" "}
            {!searchFilter && activeFilter} orders{" "}
            {searchFilter && `${activeFilter !== null ? activeFilter : ""} `}
            {searchFilter && `for the search term: ${searchFilter}`}
          </p>
        )}
      </div>

      {!isSearching && (
        <img
          src={searchImg.src}
          alt="search icon"
          className={`${classes.profileSearcIcon} profileSearch`}
          onClick={() => setIsSearching(true)}
        />
      )}

      <AnimatePresence>
        {isSearching && (
          <motion.div
            className={classes.formContainer}
            key="search-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <SearchOrdersForm
              activeFilter={activeFilter}
              searchFilter={searchFilter}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <form action={formAction}>
          <select
            id="filter"
            name="filter"
            value={activeFilter || "all"}
            onChange={(e) => {
              setIsSearching(false);
              e.target.form.requestSubmit();
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </form>
      </div>
    </div>
  );
}

export default OrderSubHeader;
