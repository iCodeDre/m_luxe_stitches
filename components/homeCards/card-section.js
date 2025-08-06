import { Suspense } from "react";

import classes from "./card-section.module.css";

import { ProductCardSkeleton } from "../UI/loading-skeleton";
import CardTitle from "./card-title";
import CardWrapper from "./card-wrapper";

async function CardSection() {
  return (
    <section className={classes.cardContainer}>
      <CardTitle />

      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <CardWrapper />
      </Suspense>
    </section>
  );
}

export default CardSection;
