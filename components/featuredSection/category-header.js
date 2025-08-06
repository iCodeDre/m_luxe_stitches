"use client";
import { motion } from "motion/react";

import classes from "./featured-header.module.css";

function CategoryHeader({ label }) {
  return (
    <motion.header
      className={classes.featuredHeader}
      initial={{ opacity: 0, y: 30 }}
      transition={{
        duration: 1,
        type: "tween",
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1>{label}</h1>
    </motion.header>
  );
}

export default CategoryHeader;
