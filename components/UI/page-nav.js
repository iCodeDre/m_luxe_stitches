
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import classes from "./page-nav.module.css";
import { getPageNumbers } from "@/util/util";

function PageNav({ numberOfProducts, currentPage, sort }) {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const averageProductNumber = Math.ceil(numberOfProducts / 12);
  const totalPages = averageProductNumber !== 0 ? averageProductNumber : 1;
  const range = getPageNumbers(currentPage, totalPages);

  const searchCat = searchParams.get("searchCat");

  const [isPending, startTransition] = useTransition();

  const updateQueryParams = (pageNum, method = "push") => {
    const params = new URLSearchParams(searchParams.toString());

    if (pageNum === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNum.toString());
    }

    if (sort && sort !== "default") {
      params.set("sortBy", sort);
    } else {
      params.delete("sortBy");
    }

    if (path.includes("search")) {
      if (searchCat) {
        params.set("searchCat", searchCat);
      } else {
        params.delete("searchCat");
      }
    }

    const newUrl = `${path}?${params.toString()}`;
    startTransition(() => {
      method === "replace" ? router.replace(newUrl) : router.push(newUrl);
    });
  };

  return (
    <div className={classes.pageNavContainer}>
      {isPending && <div className="gray-overlay" />}

      {currentPage > 1 && (
        <button
          onClick={() =>
            updateQueryParams(
              currentPage - 1,
              currentPage - 1 === 1 ? "replace" : "push"
            )
          }
          disabled={isPending}
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
                updateQueryParams(pageNum, pageNum === 1 ? "replace" : "push")
              }
              className={pageNum === currentPage ? classes.active : undefined}
              disabled={isPending}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {range[range.length - 1] !== currentPage && (
        <button
          onClick={() => updateQueryParams(currentPage + 1)}
          disabled={isPending}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default PageNav;

// "use client";

// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import classes from "./page-nav.module.css";
// import { getPageNumbers } from "@/util/util";

// function PageNav({ numberOfProducts, currentPage, sort }) {
//   const path = usePathname();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const averageProductNumber = Math.ceil(numberOfProducts / 12);
//   const totalPages = averageProductNumber !== 0 ? averageProductNumber : 1;
//   const range = getPageNumbers(currentPage, totalPages);

//   const searchCat = searchParams.get("searchCat");

//   const updateQueryParams = (pageNum, method = "push") => {
//     const params = new URLSearchParams(searchParams.toString());

//     if (pageNum === 1) {
//       params.delete("page");
//     } else {
//       params.set("page", pageNum.toString());
//     }

//     if (sort && sort !== "default") {
//       params.set("sortBy", sort);
//     } else {
//       params.delete("sortBy");
//     }

//     if (path.includes("search")) {
//       if (searchCat) {
//         params.set("searchCat", searchCat);
//       } else {
//         params.delete("searchCat");
//       }
//     }

//     const newUrl = `${path}?${params.toString()}`;
//     method === "replace" ? router.replace(newUrl) : router.push(newUrl);
//   };

//   return (
//     <div className={classes.pageNavContainer}>
//       {currentPage > 1 && (
//         <button
//           onClick={() =>
//             updateQueryParams(currentPage - 1, currentPage - 1 === 1 ? "replace" : "push")
//           }
//         >
//           Previous
//         </button>
//       )}

//       <div className={classes.pageNumberContainer}>
//         {range.map((pageNum) => (
//           <button
//             key={pageNum}
//             onClick={() => updateQueryParams(pageNum, pageNum === 1 ? "replace" : "push")}
//             className={pageNum === currentPage ? classes.active : undefined}
//           >
//             {pageNum}
//           </button>
//         ))}
//       </div>

//       {range[range.length - 1] !== currentPage && (
//         <button onClick={() => updateQueryParams(currentPage + 1)}>
//           Next
//         </button>
//       )}
//     </div>
//   );
// }

// export default PageNav;
