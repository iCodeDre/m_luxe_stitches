"use client";
import { motion } from "motion/react";
import prevIcon from "@/assets/UI/arrow-back.svg";

function PrevScroll({...props}) {
  return (
    <motion.img
      src={prevIcon.src}
      alt="previous-image-button"
      {...props}
      initial={{
        x: -10,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
      }}
      whileHover={{
        background: "#ff8cdbff",
        scale: 1.1,
        x: -3,
      }}
      transition={{
        duration: 0.5,
      }}
      exit={{
        x: -10,
        opacity: 0,
        scale: 0,
      }}
      whileTap={{
        scale: 1.5,
      }}
    />
  );
}

export default PrevScroll;
