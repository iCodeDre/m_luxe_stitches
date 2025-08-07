import CategoryWrapper from "@/components/productPageServerWrappers/categoryWrapper";
import { getCategoryMetadata } from "@/lib/metadata/product-metadata";

import { ProductGridSkeleton } from "@/components/UI/loading-skeleton";

import { getPageDetails } from "@/util/util";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const catSlug = (await params).slug;
  const categoryMetadata = await getCategoryMetadata(catSlug);

  return {
    title: `${categoryMetadata.name} |  M.luxe Stitches category`,
    description: `Browse through our ${categoryMetadata.number_of_products} luxurious wears in our ${categoryMetadata.name} category.`,
    openGraph: {
      title: `${categoryMetadata.name} | M.luxe Stitches category`,
      description: `Browse through our ${categoryMetadata.number_of_products} luxurious wears in our ${categoryMetadata.name} category.`,
      url: `https://m-luxe-stitches.vercel.app/categories/${catSlug}`,
      siteName: "M.luxe Stitches",
      images: {
        url: categoryMetadata.image_url,
        width: 1200,
        height: 630,
        alt: `category preview image`,
      },
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryMetadata.name} | M.luxe Stitches category`,
      description: `Browse through our ${categoryMetadata.number_of_products} luxurious wears in our ${categoryMetadata.name} category.`,
      images: [categoryMetadata.image_url],
    },
  };
}

async function CategoriesPage({ searchParams, params }) {
  const selectedCategory = (await params).slug;
  const resolvedSearchParams = await searchParams;

  const { currentPage, sort, offsetValue } =
    getPageDetails(resolvedSearchParams);

  return (
    <Suspense fallback={<ProductGridSkeleton label="product-grid" />}>
      <CategoryWrapper
        sort={sort}
        offsetValue={offsetValue}
        currentPage={currentPage}
        selectedCategory={selectedCategory}
      />
    </Suspense>
  );
}

export default CategoriesPage;
