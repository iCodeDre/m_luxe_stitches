"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import nProgress from "nprogress";

import classes from "./card-section.module.css";
import NoProducts from "../UI/no-items/no-products";
import { truncateText } from "@/util/util";

export default function Cards({ cardData = [], cardError }) {
  const router = useRouter();
  function handlecardClick() {
    nProgress.start();
    router.push("/shop");
  }
  return (
    <>
      {cardData.length > 0 ? (
        cardData.map((cardItem, index) => (
          <motion.div
            className={classes.cardImageContainer}
            key={cardItem.product_id}
            onClick={handlecardClick}
            initial={{
              opacity: 0,
              y: 50,
              x: 20,
              rotate: index === 0 ? 3 : -3,
            }}
            transition={{ duration: 1, type: "tween" }}
            whileInView={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Image
              src={cardItem.image_url[0]}
              alt="product-image"
              className={classes.cardImage}
              sizes="(max-width: 768px) 50vw, 35vw"
              fill
              priority
            />
            <div className={classes.cardDescriptionOverlay}>
              <div className={classes.cardDescriptionContainer}>
                <header>
                  <h3>{truncateText(cardItem.title, 10)}</h3>
                </header>
                <p>{truncateText(cardItem.description, 25)}</p>

                <motion.button
                  transition={{
                    duration: 1,
                    bounce: 0.5,
                    stiffness: 200,
                    type: "spring",
                  }}
                  whileHover={{
                    color: "#eb07a2",
                    borderColor: "#eb07a2",
                    scale: 1.05,
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{
                    scale: 1,
                  }}
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))
      ) : cardData.length <= 0 && !cardError ? (
        <NoProducts>No products to show here!</NoProducts>
      ) : (
        <NoProducts label>Error fetching cards. Please try again!</NoProducts>
      )}
    </>
  );
}
