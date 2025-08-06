"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

import classes from "./hero-section.module.css";
import Button from "../UI/button";
import LinkWithProgress from "../UI/link-with-progress";
const titles = ["Women Elegance", "Classics", "2025 Styles"];

function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const titleTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 10000);

    return () => {
      clearInterval(titleTimer);
    };
  }, []);

  return (
    <>
      <div className={classes.overlay}>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          M.Luxe Stitchies
        </motion.h1>

        <motion.div
          className={classes.dynamicTextContainer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={titles[index]}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 1 }}
          
            >
              {titles[index]}
            </motion.h2>
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
  
          className={classes.subText}
        >
          New Collection
        </motion.p>

        <LinkWithProgress href="/shop">
          <Button
            className={classes.button}
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{
              duration: 1,
              bounce: 0.5,
              stiffness: 200,
              type: "spring",
            }}
            whileHover={{
              scale: 1.05,
              opacity: 0.8,
              transition: { duration: 0.5 },
            }}
             whileTap={{ scale: 1 }}
          >
            Shop Now
          </Button>
        </LinkWithProgress>
      </div>
    </>
  );
}

export default HeroTitle;
