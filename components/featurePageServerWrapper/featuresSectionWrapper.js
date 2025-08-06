import FeaturedContextProvider from "@/store/featured-context";
import FeaturedProductsSection from "../featuredSection/featured-products-section";

import { getTopRatedProducts } from "@/lib/featured";

async function FeaturedSectionWrapper() {
  let topRatedProducts;
  let productsError = false;

  try {
    topRatedProducts = await getTopRatedProducts();
  } catch (error) {
    console.log(error.message);
    productsError = true;
  }

  return (
    <>
      <FeaturedContextProvider topRatedItems={topRatedProducts} productsError={productsError}>
        <FeaturedProductsSection />
      </FeaturedContextProvider>
    </>
  );
}

export default FeaturedSectionWrapper;
