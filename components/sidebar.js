"use client";

import { use, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

import classes from "./sidebar.module.css";

import SidebarLinks from "./UI/sidebar-links";
import { CategoriesContext } from "@/store/category-context";

function Sidebar() {
  const path = usePathname();
  const { categories: allCategories } = use(CategoriesContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCategories = allCategories.slice(0, 7);
  const hiddenCategories = allCategories.slice(7);

  return (
    <div className={classes.sidebar}>
      <div className={classes.sidebarInner}>
        <h1>Product Catogories</h1>
        <AnimatePresence mode="popLayout">
          <motion.ul
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {visibleCategories.map((category) => (
              <SidebarLinks
                key={category.name}
                href={`/categories/${category.name}`}
                isActive={path === `/categories/${category.name}`}
              >
                {category.name}
              </SidebarLinks>
            ))}
            <AnimatePresence mode="popLayout">
              {isExpanded &&
                hiddenCategories.map((category) => (
                  <SidebarLinks
                    key={category.name}
                    href={`/categories/${category.name}`}
                    label="hidden"
                    isActive={path === `/categories/${category.name}`}
                  >
                    {category.name}
                  </SidebarLinks>
                ))}
            </AnimatePresence>
          </motion.ul>
        </AnimatePresence>

        {allCategories.length > 8 && (
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.p
                key="show-more"
                className={classes.showAmount}
                onClick={() => setIsExpanded(true)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.01,
                  opacity: 0.8,
                }}
              >
                &#43; show more
              </motion.p>
            ) : (
              <motion.p
                key="show-fewer"
                className={classes.showAmount}
                onClick={() => setIsExpanded(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.01,
                  opacity: 0.8,
                }}
              >
                &#45; show fewer
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
