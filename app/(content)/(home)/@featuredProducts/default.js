import { Suspense } from "react";
import FeaturedCategories from "@/components/featuredSection/featured-categories";
import FeaturedSectionWrapper from "@/components/featurePageServerWrapper/featuresSectionWrapper";
import LoadingIndicator from "@/components/UI/loading-indicator";

import { ProductGridSkeleton } from "@/components/UI/loading-skeleton";

async function FeaturedProductsPage() {
  return (
    <>
      <Suspense
        fallback={
          <div style={{ justifySelf: "center", width: "100%" }}>
            <LoadingIndicator />
            <ProductGridSkeleton label="home-grid" />
          </div>
        }
      >
        <FeaturedSectionWrapper />
      </Suspense>
      <FeaturedCategories />
    </>
  );
}

export default FeaturedProductsPage;
