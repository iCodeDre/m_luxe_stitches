"use client";
import { use, useEffect } from "react";

import { ProductReviewContext } from "@/store/product-review-contex";

import classes from "./product-info.module.css";

import SubNav from "@/components/product-detail/sub-nav";
import ReviewList from "./review-list";
import ReviewForm from "./review-form";
import { useState } from "react";
import { SearchModalContext } from "@/store/search-modal-context";

function ProductInfo({ productTitle, productDescription, productId }) {
  const { isSearchModal, setIsSearchModal } = use(SearchModalContext);
  const { reviews } = use(ProductReviewContext);
  const [mode, setMode] = useState(true);
  
  useEffect(() => {
    if (isSearchModal) {
      setIsSearchModal(false);
    }
  }, []);

  function handleModeClick() {
    setMode(!mode);
  }
  return (
    <section className={classes.productInfo}>
      <SubNav
        onModeClick={handleModeClick}
        mode={mode}
        label="description&review"
        totalReviews={reviews.length}
      />

      {mode && (
        <p className={classes.productDescription}>{productDescription}</p>
      )}

      {!mode && (
        <div className={classes.reviewSection}>
          <div className={classes.reviews}>
            <header>
              <h1>Reviews</h1>
            </header>

            <ReviewList reviews={reviews} />
          </div>

          <ReviewForm
            productId={productId}
            productTitle={productTitle}
            isReview={reviews.length > 0}
          />
        </div>
      )}
    </section>
  );
}

export default ProductInfo;
