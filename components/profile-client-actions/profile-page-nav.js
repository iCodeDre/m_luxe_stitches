"use client";

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import classes from "../UI/page-nav.module.css";
import { getPageNumbers } from "@/util/util";

function ProfilePageNav({ numberOfProducts, currentPage, filterValue }) {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchFilter = searchParams.get("searchFilter");
  const averageProductNumber = Math.ceil(numberOfProducts / 12);
  const totalPages = averageProductNumber !== 0 ? averageProductNumber : 1;
  const range = getPageNumbers(currentPage, totalPages);

  const updateParamsAndNavigate = (pageNum, method = "push") => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle "page" param
    if (pageNum === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNum.toString());
    }

    // Handle "filter"
    if (filterValue && filterValue !== "all") {
      params.set("filter", filterValue);
    } else {
      params.delete("filter");
    }

    // Handle "searchFilter"
    if (searchFilter) {
      params.set("searchFilter", searchFilter);
    } else {
      params.delete("searchFilter");
    }

    const newUrl = `${path}?${params.toString()}`;
    method === "replace" ? router.replace(newUrl) : router.push(newUrl);
  };

  return (
    <div className={classes.pageNavContainer}>
      {currentPage > 1 && (
        <button
          onClick={() =>
            updateParamsAndNavigate(
              currentPage - 1,
              currentPage - 1 === 1 ? "replace" : "push"
            )
          }
        >
          Previous
        </button>
      )}

      {totalPages !== 1 && (
        <div className={classes.pageNumberContainer}>
          {range.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() =>
                updateParamsAndNavigate(
                  pageNum,
                  pageNum === 1 ? "replace" : "push"
                )
              }
              className={pageNum === currentPage ? classes.active : undefined}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {range[range.length - 1] !== currentPage && (
        <button
          onClick={() => updateParamsAndNavigate(currentPage + 1, "push")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default ProfilePageNav;
