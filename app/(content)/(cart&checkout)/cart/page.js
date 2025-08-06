"use client";
import { use, useEffect } from "react";

import { CartContext } from "@/store/cart-context";

import classes from "./page.module.css";

import CartTotal from "@/components/cart-totals";

import CartTable from "@/components/cart-table";

function Cart() {
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
    <section className={classes.cartSection}>
      <div className={classes.cartContentsContainer}>
        <CartTable />
        <CartTotal cartTotal={totalPrice} label="cart" />
      </div>
    </section>
  );
}

export default Cart;
