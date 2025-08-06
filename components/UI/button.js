"use client";
import { motion, AnimatePresence } from "motion/react";

function Button({ children, className, ...props }) {
  let classes = className;
  if (children === "View cart" || children === "Add to cart") {
    classes = `${className} view-cart-bg`;
  }

  if (children === "Try again") {
    return (
      <motion.button
        className={classes}
        {...props}
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
        whileTap={{ scale: 1.2, opacity: 1 }}
      >
        {children}
      </motion.button>
    );
  }
  if (children === "Shop Now") {
    return (
      <motion.button className={classes} {...props}>
        {children}
      </motion.button>
    );
  }
  return (
    <motion.button
      className={classes}
      {...props}
      initial={{ opacity: 1 }}
      transition={{
        duration: 1,
        bounce: 0.5,
        stiffness: 200,
        type: "spring",
      }}
      whileHover={{
        scale: 1.01,
        opacity: 0.8,
        transition: { duration: 0.5 },
      }}
      whileTap={{ scale: 1.03, opacity: 1 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
