import classes from "./page.module.css";

import { VerifyAuth } from "@/lib/lucia";

import ProductReviewContextProvider from "@/store/product-review-contex";

import ProductHeader from "@/components/product-detail/product-header";

import ProductInfo from "@/components/product-detail/product-info";
import UserProductRelationsSection from "@/components/product-detail/user-product-relations-section";
import { getProductDetails } from "@/lib/product-details";
import { updateRecentlyViewed } from "@/lib/related-products";
import { getProductMetadata } from "@/lib/metadata/product-metadata";

export async function generateMetadata({ params }) {
  const slug = (await params).productSlug;
  const { productMetadata } = await getProductMetadata(slug);
  console.log(productMetadata);

  return {
    title: `${productMetadata.title} by M.luxe`,
    description: `${productMetadata.description}`,
  };
}

async function ProductPage({ params }) {
  const slug = (await params).productSlug;

  const result = await VerifyAuth();

  let userId;

  if (result.user) {
    const { userId: id } = result.user;
    userId = id;
  }

  const { productDetails, reviews, rating, productId } =
    await getProductDetails(slug, userId);

  await updateRecentlyViewed(userId, productId);

  return (
    <section>
      <div className={classes.pageContent}>
        <ProductHeader productDetails={productDetails} />
        <ProductReviewContextProvider reviewItems={reviews} rating={rating}>
          <ProductInfo
            productTitle={productDetails.title}
            productDescription={productDetails.description}
            productId={productId}
          />
        </ProductReviewContextProvider>
        <UserProductRelationsSection
          categories={productDetails.product_category}
          userId={userId}
        />
      </div>
    </section>
  );
}

export default ProductPage;
