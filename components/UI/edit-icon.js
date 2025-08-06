"use client";
import { motion } from "motion/react";

import editIcon from "@/assets/UI/edit-icon.svg";
import LinkWithProgress from "./link-with-progress";

function EditIcon({ href }) {
  return (
    <LinkWithProgress href={href}>
      <motion.img
        src={editIcon.src}
        alt="edit-icon"
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
          scale: 1.4,
        }}
        whileTap={{
          scale: 1.6,
          opacity: 1,
        }}
      />
    </LinkWithProgress>
  );
}

export default EditIcon;
