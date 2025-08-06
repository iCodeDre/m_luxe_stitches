import classes from "./user-product-relations-section.module.css";

import SubNav from "./sub-nav";
import { getRelatedProducts } from "@/lib/related-products";
import RelatedCarousel from "./related-carousel";

async function UserProductRelationsSection({ categories, userId }) {
  const { relatedProducts, recentlyViewedProducts } = await getRelatedProducts(
    categories,
    userId
  );

  return (
    <section className={classes.relationsSection}>
      <div className={classes.relatedProducts}>
        <SubNav label="Related products" />
        <RelatedCarousel products={relatedProducts} />
      </div>

      {recentlyViewedProducts.length > 0 && (
        <div className={classes.relatedProducts}>
          <SubNav label="Recently viewed" />
          <RelatedCarousel products={recentlyViewedProducts} />
        </div>
      )}
    </section>
  );
}

export default UserProductRelationsSection;
