import Image from "next/image";

import classes from "./article.module.css";
import Rating from "@/components/UI/rating";

import LinkWithProgress from "./UI/link-with-progress";
import { currencyFormatter, truncateText } from "@/util/util";

function Article({ product }) {
  return (
    <article className={classes.productArticle}>
      <LinkWithProgress
        href={`/products/${product.slug}`}
        className={classes.articleImageContainer}
      >
        <Image
          src={product.image_url[0]}
          alt="article-image"
          fill
          quality={50}
          sizes="(max-width: 1025px) 33.33vw, (max-width: 778px) 50vw, 25vw"
        />
      </LinkWithProgress>
      <div className={classes.articleDetails}>
        <p className={classes.categoryName}>
          {product.product_category[0] !== "NULL"
            ? product.product_category?.join(" / ")
            : "No category assigned"}
        </p>
        <h1>{truncateText(product.title, 4)}</h1>
        <span>
          <Rating userRating={product.rating} />({product.rating})
        </span>

        <p className={classes.price}>
          {currencyFormatter.format(product.price)}
        </p>
      </div>
    </article>
  );
}

export default Article;
