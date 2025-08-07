"use client";

import Image from "next/image";

import classes from "./quantity-buttons.module.css";

import Button from "./button";

import addIcon from "@/assets/UI/add-icon.svg";
import removeIcon from "@/assets/UI/remove-icon.svg";

function QuantityButtons({
  quantity,
  onIncreaseClick,
  onDecreaseClick,
  productId,
  updateQuantityAction
}) {
  if (productId) {
    return (
      <span className={classes.quanityButtonsContainer}>
        <form action={updateQuantityAction.bind(null, productId, "decrease")}>
          <Button className={classes.button}>
            <Image src={removeIcon} alt="remove-icon" priority />
          </Button>
        </form>
        <p>{quantity}</p>

        <form action={updateQuantityAction.bind(null, productId, "increase")}>
          <Button className={classes.button}>
            <Image src={addIcon} alt="add-icon" priority />
          </Button>
        </form>
      </span>
    );
  }

  return (
    <span className={classes.quanityButtonsContainer}>
      <Button className={classes.button} onClick={onDecreaseClick}>
        <Image src={removeIcon} alt="remove-icon" priority />
      </Button>
      <p>{quantity}</p>
      <Button className={classes.button} onClick={onIncreaseClick}>
        <Image src={addIcon} alt="add-icon" priority />
      </Button>
    </span>
  );
}

export default QuantityButtons;
