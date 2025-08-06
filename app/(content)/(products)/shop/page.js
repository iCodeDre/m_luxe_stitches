import { getPageDetails } from "@/util/util";
import ShopWrapper from "@/components/productPageServerWrappers/shopWrapper";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/UI/loading-skeleton";

async function ShopPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const { currentPage, sort, offsetValue } =
    getPageDetails(resolvedSearchParams);

  return (
    <Suspense fallback={<ProductGridSkeleton label="product-grid" />}>
      <ShopWrapper
        sort={sort}
        offsetValue={offsetValue}
        currentPage={currentPage}
      />
    </Suspense>
  );
}

export default ShopPage;
