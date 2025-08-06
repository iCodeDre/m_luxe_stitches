"use client";

import { motion} from "motion/react";

import classes from "./card-section.module.css";

function CardTitle() {

  return (
    <div className={classes.cardTextContainer}>
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 50,
            delay: 0.5,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Discover Latest Styles
        </motion.h2>
        <motion.hr
          initial={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        />
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          transition={{
            duration: 1,
            type: "spring",
            stiffness: 50,
            delay: 0.5,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ...stylish and exquisite
        </motion.p>
      </div>
    </div>
  );
}

export default CardTitle;
