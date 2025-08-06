"use client";
import { useEffect, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";

import Article from "../article";
import classes from "./related-carousel.module.css";

import arrowNext from "@/assets/UI/arrow.svg";
import arrowPrev from "@/assets/UI/arrow-back.svg";
import NextScroll from "../UI/next-scroll";
import PrevScroll from "../UI/prev-scroll";

const breakpoints = {
  xl: 989,
  lg: 714,
  md: 526,
};

function RelatedCarousel({ products }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const indexRef = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isNext, setIsNext] = useState(true);

  useEffect(() => {
    function updateWidth() {
      if (cardRef.current) {
        const width = cardRef.current.getBoundingClientRect().width;
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        console.log(containerWidth);
        setContainerWidth(containerWidth);
        setCardWidth(width);

        x.set(-indexRef.current * width);

        const productCount = products.length;

        let visibleItems = 5;

        if (
          containerWidth <= breakpoints.xl &&
          containerWidth > breakpoints.lg
        ) {
          visibleItems = 4;
        }
        if (
          containerWidth <= breakpoints.lg &&
          containerWidth > breakpoints.md
        ) {
          visibleItems = 3;
        }
        if (containerWidth <= breakpoints.md) {
          visibleItems = 2;
        }
        setIsNext(productCount > visibleItems);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [x, products]);

  function handleNextClick() {
    indexRef.current = indexRef.current + 1;

    if (containerWidth > breakpoints.xl) {
      if (indexRef.current > products.length - 5) {
        indexRef.current = 0;
        setIsScrolling(false);
        animate(x, -indexRef.current * cardWidth, {
          duration: 0.8,
          ease: "easeInOut",
        });
        return;
      }
    }
    if (containerWidth <= breakpoints.xl && containerWidth > breakpoints.lg) {
      if (indexRef.current > products.length - 4) {
        indexRef.current = 0;
        setIsScrolling(false);
        animate(x, -indexRef.current * cardWidth, {
          duration: 0.8,
          ease: "easeInOut",
        });
        return;
      }
    }

    if (containerWidth <= breakpoints.lg && containerWidth > breakpoints.md) {
      if (indexRef.current > products.length - 3) {
        indexRef.current = 0;
        setIsScrolling(false);
        animate(x, -indexRef.current * cardWidth, {
          duration: 0.8,
          ease: "easeInOut",
        });
        return;
      }
    }
    if (containerWidth <= breakpoints.md) {
      if (indexRef.current > products.length - 2) {
        indexRef.current = 0;
        setIsScrolling(false);
        animate(x, -indexRef.current * cardWidth, {
          duration: 0.8,
          ease: "easeInOut",
        });
        return;
      }
    }
    setIsScrolling(indexRef.current > 0);

    animate(x, -indexRef.current * cardWidth, {
      duration: 0.8,
      ease: "easeInOut",
    });
  }
  function handlePreviousClick() {
    indexRef.current = indexRef.current - 1;

    if (indexRef.current === 0) {
      indexRef.current = 0;
      setIsScrolling(false);
      animate(x, -indexRef.current * cardWidth, {
        duration: 0.8,
        ease: "easeInOut",
      });
      return;
    }
    animate(x, -indexRef.current * cardWidth, {
      duration: 0.8,
      ease: "easeInOut",
    });
  }

  return (
    <div className={classes.carouselContainer}>
      <AnimatePresence mode="wait">
        {isNext && <NextScroll onClick={handleNextClick} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isScrolling && <PrevScroll onClick={handlePreviousClick} />}
      </AnimatePresence>
      <motion.div
        style={{
          x,
        }}
        ref={containerRef}
        className={classes.carousel}
      >
        {products.map((product, index) => (
          <div key={product.product_id} ref={index === 0 ? cardRef : null}>
            <Article product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default RelatedCarousel;
