"use client";
import { motion } from "motion/react";

import LinkWithProgress from "./link-with-progress";

function SidebarLinks({ href, children, label, isActive }) {
  if (label !== "hidden") {
    return (
      <motion.li
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={{
          color: "#eb07a2",
        }}
      >
        <LinkWithProgress
          href={href}
          style={isActive ? { color: "#eb07a2" } : null}
        >
          <motion.p
            whileHover={{
              color: "#eb07a2",
            }}
          >
            {children}
          </motion.p>
        </LinkWithProgress>
      </motion.li>
    );
  }
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <LinkWithProgress
        href={href}
        style={isActive ? { color: "#eb07a2" } : null}
      >
        <motion.p
          whileHover={{
            color: "#eb07a2",
          }}
        >
          {children}
        </motion.p>
      </LinkWithProgress>
    </motion.li>
  );
}

export default SidebarLinks;
