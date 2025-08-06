"use client";
import { motion } from "motion/react";
import classes from "./sub-nav.module.css";

function SubNav({ onModeClick, mode, label, totalReviews }) {
  const underLine = classes.underLine;
  if (label === "description&review") {
    return (
      <nav className={classes.subNav}>
        <ul>
          <motion.li
            onClick={onModeClick}
            whileHover={{
              color: "#eb07a2",
            }}
            className={mode ? underLine : undefined}
          >
            Description
          </motion.li>
          <motion.li
            onClick={onModeClick}
            whileHover={{
              color: "#eb07a2",
            }}
            className={!mode ? underLine : undefined}
          >
            Reviews ({totalReviews})
          </motion.li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className={classes.subNav}>
      <ul>
        <motion.li
          whileHover={{
            color: "#eb07a2",
          }}
          className={underLine}
        >
          {label}
        </motion.li>
      </ul>
    </nav>
  );
}

export default SubNav;
