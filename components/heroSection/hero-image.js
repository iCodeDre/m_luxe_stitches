"use client";
import Image from "next/image";
import { motion } from "motion/react";
import classes from "./hero-section.module.css";

const images = [
  `/hero-images/brown1.png`,
  `/hero-images/brown2.png`,
  `/hero-images/red1.png`,
  `/hero-images/grade2.png`,
];

function HeroImage() {
  return (
    <>
      <motion.div
        className={classes.heroImgContainer}
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src={images[0]} alt="product-image" sizes="25vw" fill priority />
      </motion.div>

      <motion.div
        className={classes.heroImgContainer}
        initial={{ y: -20, x: 20, opacity: 0 }}
        whileInView={{ y: 0, x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src={images[1]} alt="product-image" sizes="25vw" fill priority />
      </motion.div>

      <motion.div
        className={classes.heroImgContainer}
        initial={{ y: -10, x: -30, opacity: 0 }}
        whileInView={{ y: 0, x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src={images[2]} alt="product-image" sizes="25vw" fill priority />
      </motion.div>

      <motion.div
        className={classes.heroImgContainer}
        initial={{ y: -10, x: 50, opacity: 0 }}
        whileInView={{ y: 0, x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Image src={images[3]} alt="product-image" sizes="25vw" fill priority />
      </motion.div>
    </>
  );
}

export default HeroImage;
