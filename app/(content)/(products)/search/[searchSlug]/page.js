
import SearchWrapper from "@/components/productPageServerWrappers/searchWrapper";

import { ProductGridSkeleton } from "@/components/UI/loading-skeleton";

import { getPageDetails } from "@/util/util";
import { Suspense } from "react";

async function SearchPage({ searchParams, params }) {
  const searchTerm = (await params).searchSlug;
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.searchCat;

  const { currentPage, sort, offsetValue } =
    getPageDetails(resolvedSearchParams);

  return (
    <Suspense fallback={<ProductGridSkeleton label="product-grid" />}>
      <SearchWrapper
        sort={sort}
        offsetValue={offsetValue}
        currentPage={currentPage}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
      />
    </Suspense>
  );
}

export default SearchPage;
