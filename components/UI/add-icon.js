"use client";
import Image from "next/image";
import { motion } from "motion/react";
import addIcon from "@/assets/UI/white-add-icon.svg";

import classes from "./add-icon.module.css";
import LinkWithProgress from "./link-with-progress";

function AddIcon() {
  return (
    <LinkWithProgress href={`/admin/post`}>
      <motion.button
        className={classes.addIconContainer}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            duration: 0.5,
          },
        }}
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 1.2,
          opacity: 1,
        }}
      >
        <Image src={addIcon} alt="add-post-icon" width={24} height={24} />
      </motion.button>
    </LinkWithProgress>
  );
}

export default AddIcon;
