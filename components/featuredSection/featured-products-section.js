"use client";

import { use } from "react";

import { motion } from "motion/react";

import classes from "./featured-products-section.module.css";

import { FeaturedContext } from "@/store/featured-context";

import FeaturedHeader from "./featured-header";
import ArticleContainer from "@/components/article-container";
import Article from "@/components/article";
import { ProductGridSkeleton } from "../UI/loading-skeleton";
import NoProducts from "../UI/no-items/no-products";

function Products() {
  const {
    featuredProducts: products,
    isLoading,
    isError,
  } = use(FeaturedContext);

  if (isLoading) return <ProductGridSkeleton />;

  return (
    <motion.div
      className={classes.articleWrapper}
      initial={{ opacity: 0, y: 30 }}
      transition={{
        duration: 1,
        type: "tween",
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {products.length > 0 ? (
        <ArticleContainer>
          {products.map((product) => (
            <Article key={product.product_id} product={product} />
          ))}
        </ArticleContainer>
      ) : products.length <= 0 && !isError ? (
        <NoProducts>No products to show here!</NoProducts>
      ) : (
        <NoProducts label>Error fetching products. please try again!</NoProducts>
      )}
    </motion.div>
  );
}

function FeaturedProductsSection() {
  return (
    <section className={classes.featuredProductsSection}>
      <FeaturedHeader label="Featured Products" />

      <Products />
    </section>
  );
}

export default FeaturedProductsSection;
