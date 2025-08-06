"use client";

import { usePathname } from "next/navigation";

import classes from "./products-header.module.css";

import { getPath } from "@/util/util";
import Link from "next/link";
import LinkWithProgress from "./UI/link-with-progress";


function ProductsHeader() {
  const path = usePathname();
  const pathName = getPath(path);



  if (pathName.includes("cart")) {
    return (
      <header className={classes.productsHeader}>
        <span className={classes.cartLinks}>
          {pathName.map((pathSegment, index) => (
            <span className={classes.cartLinks} key={pathSegment}>
              {pathSegment !== "Order Complete" ? (
                <Link
                  href={`/${pathSegment}`}
                  style={
                    path.includes(pathSegment)
                      ? { color: "#eb07a2" }
                      : undefined
                  }
                >
                  {pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)}
                </Link>
              ) : (
                <span
                  style={
                    path.includes("order-complete")
                      ? { color: "#eb07a2" }
                      : undefined
                  }
                >
                  {pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)}
                </span>
              )}
              {index < pathName.length - 1 && " > "}
            </span>
          ))}
        </span>
      </header>
    );
  } else {
    return (
      <header className={classes.productsHeader}>
        <h1>{pathName}</h1>
        <p>
          <LinkWithProgress href="/">Home</LinkWithProgress> /{" "}
          <LinkWithProgress href="/shop">Shop</LinkWithProgress>
        </p>
      </header>
    );
  }
}

export default ProductsHeader;
