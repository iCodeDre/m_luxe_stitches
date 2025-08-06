"use client";
import { use, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import CategoryArticle from "@/components/featuredSection/category-article";
import classes from "./category-carousel.module.css";
import NoProducts from "../UI/no-items/no-products";

function CategoryCarousel({ categories = [], categoreisError }) {
  const duplicated = [...categories, ...categories];
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [hovering, setHovering] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    function updateWidth() {
      if (cardRef.current) {
        const width = cardRef.current.getBoundingClientRect().width;
        setCardWidth(width);

        x.set(-indexRef.current * width);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [x]);

  useEffect(() => {
    if (!cardWidth || hovering) return;

    const interval = setInterval(() => {
      indexRef.current += 1;

      animate(x, -indexRef.current * cardWidth, {
        duration: 0.8,
        ease: "easeInOut",
        onComplete: () => {
          if (indexRef.current >= categories.length) {
            indexRef.current = 0;
            x.set(0);
          }
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [cardWidth, hovering, x, categories.length]);

  return (
    <div
      className={classes.categoriesCarousel}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {duplicated.length > 0 && !categoreisError ? (
        <motion.div
          ref={containerRef}
          style={{
            display: "flex",
            x,
          }}
        >
          {duplicated?.map((category, index) => (
            <div
              ref={index === 0 ? cardRef : null}
              key={index}
              style={{ flexShrink: 0 }}
            >
              <CategoryArticle info={category} />
            </div>
          ))}
        </motion.div>
      ) : duplicated.length <= 0 && !categoreisError ? (
        <NoProducts>No categories to show here!</NoProducts>
      ) : (
        <NoProducts label>Error fetching categories. Please try gain!</NoProducts>
      )}
    </div>
  );
}

export default CategoryCarousel;
