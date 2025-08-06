import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import classes from "./loading-skeleton.module.css";

export function ProductCardSkeleton() {
  return (
    <div className={classes.cardImageContainer}>
      <Skeleton></Skeleton>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12, label }) {
  let className = classes.homeGrid;

  if (label && label === "product-grid") className = classes.productGrid;
  return (
    <div className={className}>
      {[...Array(count)].map((_, index) => (
        <div className={classes.card} key={index}>
          <Skeleton className={classes.image} />

          <div className={classes.info}>
            <Skeleton className={classes.category} width="50%" />
            <Skeleton className={classes.name} width="80%" />
            <Skeleton className={classes.rating} width="40%" />
            <Skeleton className={classes.price} width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}
