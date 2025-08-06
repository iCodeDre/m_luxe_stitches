"use client";

import { use, useState } from "react";
import { motion } from "motion/react";
import classes from "./featured-header.module.css";

import { FeaturedContext } from "@/store/featured-context";

const tabs = ["Top rated", "New arrivals", "Best selling"];

function FeaturedHeader({ label }) {
  const {switchProducts} = use(FeaturedContext);
  // const switchProducts = featured?.switchProducts;
  const [mode, setMode] = useState("Top rated");

  // console.log(featured);
  async function handleModeSwitch(navMode) {
    
    await switchProducts(navMode);
    setMode(navMode);
  }
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
      <nav>
        <ul>
          {tabs.map((tab) => (
            <motion.li key={tab}>
              <motion.button
                onClick={() => handleModeSwitch(tab)}
                whileHover={{
                  color: "#eb07a2",
                }}
              >
                {tab}
                {mode === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={classes.activeTabIndicator}
                  />
                )}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}

export default FeaturedHeader;
