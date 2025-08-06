import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import classes from "./category-article.module.css";
import LinkWithProgress from "../UI/link-with-progress";
import { truncateText } from "@/util/util";
import placeHolder from "@/public/placeholder/no-image-placeholder.jpg";

const articleVariants = {
  initial: {
    borderWidth: 0,
    boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
    scale: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },

  hover: {
    borderWidth: 10,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    scale: 1.05,
    transition: { duration: 0.5, damping: 20 },
  },
};

const imageVariants = {
  initial: {
    scale: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },

  hover: {
    scale: 1.1,
    transition: { duration: 0.5 },
  },
};
const textVariants = {
  initial: {
    color: "rgb(94, 93, 93)",
    transition: { duration: 0.5, ease: "easeInOut" },
  },

  hover: {
    color: "#eb07a2",
    transition: { duration: 0.5 },
  },
};

function CategoryArticle({ info }) {
  const { category_name, number_of_products, image_url } = info;

  return (
    <AnimatePresence>
      <LinkWithProgress href={`/categories/${category_name}`}>
        <motion.article
          className={classes.categoryArticle}
          style={{ border: "solid #fff", overflow: "hidden" }}
          variants={articleVariants}
          initial="initial"
          animate="initial"
          whileHover="hover"
          whileTap={{
            scale: 1,
          }}
        >
          <motion.div
            className={classes.categoryImageContainer}
            variants={imageVariants}
          >
            <Image
              src={image_url || placeHolder}
              alt="category-image"
              sizes="(max-width: 1270px) 20vw, (max-width: 1025px) 25vw, (max-width: 868px) 33.33vw, (max-width: 625px) 50vw, 16.66vw"
              fill
            />
          </motion.div>

          <div className={classes.categoryNameContainer}>
            <motion.h1 variants={textVariants}>
              {truncateText(category_name, 2)}
            </motion.h1>
            <p>{number_of_products} Products</p>
          </div>
        </motion.article>
      </LinkWithProgress>
    </AnimatePresence>
  );
}

export default CategoryArticle;
