"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import classes from "./image-box.module.css";

import NextScroll from "../UI/next-scroll";
import PrevScroll from "../UI/prev-scroll";

function ImageBox({ imageUrl }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isMax = selectedImageIndex + 1 === imageUrl.length;

  function handleImageClick(imageIndex) {
    setSelectedImageIndex(imageIndex);
  }

  function handleNextImageClick() {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex + 1 === imageUrl.length) return prevIndex;
      return prevIndex + 1;
    });
  }
  function handlePreviousImageClick() {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === 0) return prevIndex;
      return prevIndex - 1;
    });
  }

  return (
    <div className={classes.imageBox}>
      <div className={classes.imageThumbnailContainer}>
        {imageUrl.map((url, index) => (
          <div
            key={url}
            onClick={() => {
              handleImageClick(index);
            }}
            className={
              selectedImageIndex === index ? classes.active : undefined
            }
          >
            <Image
              src={url}
              alt="product-image"
              sizes="200"
              fill
              className={
                selectedImageIndex === index ? classes.activeImage : undefined
              }
            />
          </div>
        ))}
      </div>
      <div className={classes.bigImageContainer}>
        <AnimatePresence mode="wait">
          {!isMax && (
            <NextScroll
              className={classes.nextIcon}
              onClick={handleNextImageClick}
            />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {selectedImageIndex !== 0 && (
            <PrevScroll
              className={classes.previousIcon}
              onClick={handlePreviousImageClick}
            />
          )}
        </AnimatePresence>
        <Image
          src={imageUrl[selectedImageIndex]}
          alt="product-image"
          sizes="(max-width: 768px) 100vw, 50vw"
          fill
          priority
        />
      </div>
    </div>
  );
}

export default ImageBox;
