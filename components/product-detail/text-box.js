import classes from "./text-box.module.css";

import MiniNav from "./mini-nav";
import ShareLinks from "./share-links";
import Rating from "../UI/rating";
import ClientCartActions from "./client-cart-actions";
import { currencyFormatter } from "@/util/util";

function TextBox({ productDetails }) {
  return (
    <div className={classes.textBox}>
      <MiniNav productTitle={productDetails.title} slug={productDetails.slug} />
      <header>
        <h1>{productDetails.title}</h1>
        <p>{currencyFormatter.format(productDetails.price)}</p>
      </header>

      <ClientCartActions
        label="text-box"
        productId={productDetails.product_id}
        quantity={1}
      />

      <div className={classes.cta}>
        <div className={classes.actionButtons}>
          <p>Categories:</p>
          <span>
            {productDetails.product_category[0] !== "NULL"
              ? productDetails.product_category?.join(" / ")
              : "No category assigned"}
          </span>
        </div>

        <div className={classes.actionButtons}>
          <p>Rating:</p>
          <Rating userRating={productDetails.avg_rating} />
          <span className={classes.avgRating}>
            ({productDetails.avg_rating})
          </span>
        </div>

        <div className={classes.actionButtons}>
          <p>Share:</p>
          <ShareLinks />
        </div>
      </div>
    </div>
  );
}

export default TextBox;
