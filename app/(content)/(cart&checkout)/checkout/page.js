"use client";

import { use, useEffect } from "react";

import classes from "./page.module.css";

import { CartContext } from "@/store/cart-context";

import CartTotal from "@/components/cart-totals";
import NoProducts from "@/components/UI/no-items/no-products";

function Checkout() {
  const { cart, isCartModal, setIsCartModal } = use(CartContext);
  const cartItems = cart.cartItems;

  useEffect(() => {
    if (isCartModal) {
      setIsCartModal(false);
    }
  }, [isCartModal, setIsCartModal]);

  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + +item.price * item.quantity || 0;
  }, 0);

  return (
    <section className={classes.checkoutSection}>
      <div className={classes.checkoutContentsContainer}>
        {totalPrice !== 0 ? (
          <CartTotal
            cartItems={cartItems}
            cartTotal={totalPrice}
            label="checkout"
          />
        ) : (
          <NoProducts>Nothing to see here</NoProducts>
        )}
      </div>
    </section>
  );
}

export default Checkout;
