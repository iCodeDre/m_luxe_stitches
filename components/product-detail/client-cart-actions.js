"use client";
import Link from "next/link";
import { useState, useContext, use } from "react";
import { motion } from "motion/react";
import { CartContext } from "@/store/cart-context";

import QuantityButtons from "@/components/UI/quantity-buttons";
import WishListButton from "@/components/UI/wishlist-button";
import Button from "@/components/UI/button";

import classes from "./text-box.module.css";
import { addToCart, wishlistHandler } from "@/lib/cart";
import { UserContext } from "@/store/user-context";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import NProgress from "nprogress";
import LinkWithProgress from "../UI/link-with-progress";

function ClientCartActions({ label, productId, quantity }) {
  const router = useRouter();
  const { user } = use(UserContext);
  const { userId } = user;
  const [quantityInCart, setQuantityInCart] = useState(quantity);

  const { cart, wishlist, setCart, setWishlist } = useContext(CartContext);
  const { cartItems } = cart;
  const { wishlistItems } = wishlist;

  let isCarted = cartItems.some((item) => item.product_id === productId);
  let isWishlisted = wishlistItems.some(
    (item) => item.product_id === productId
  );

  console.log(isWishlisted);

  function handleIncreaseClick() {
    if (quantityInCart >= 10) return;
    setQuantityInCart((prevState) => prevState + 1);
  }
  function handleDecreaseClick() {
    if (quantityInCart === 1) return;
    setQuantityInCart((prevState) => prevState - 1);
  }

  async function handleWishlistClick() {
    if (!userId) {
      NProgress.start();
      return redirect("/auth");
    }
    try {
      const { cartItems, cartCount, wishlistItems, wishlistCount } =
        await wishlistHandler(userId, productId);

      setCart({
        cartItems,
        cartCount,
      });

      setWishlist({
        wishlistItems,
        wishlistCount,
      });
    } catch (error) {
      if (error.message === "Product does not exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to update to wishlist, please try again");
    }
  }

  async function handleAddToCartClick() {
    if (!userId) {
      NProgress.start();
      return redirect("/auth");
    }

    try {
      const { cartItems, cartCount, wishlistItems, wishlistCount } =
        await addToCart(userId, productId, quantityInCart);

      setCart({
        cartItems,
        cartCount,
      });

      setWishlist({
        wishlistItems,
        wishlistCount,
      });
    } catch (error) {
      if (error.message === "Product does not exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to add item to cart, please try again");
    }
  }

  function handleGoToCartClick() {
    NProgress.start();
    router.push("/cart");
  }

  return (
    <>
      <div className={classes.actionButtons}>
        <p>Quantity:</p>
        {!isCarted ? (
          <QuantityButtons
            quantity={quantityInCart}
            onIncreaseClick={handleIncreaseClick}
            onDecreaseClick={handleDecreaseClick}
          />
        ) : (
          <LinkWithProgress href="/cart" className={classes.editInCart}>
            Edit in cart
          </LinkWithProgress>
        )}
      </div>

      <div className={classes.actionButtons}>
        <Button
          className={classes.wishListButton}
          onClick={handleWishlistClick}
        >
          <WishListButton isWishlisted={isWishlisted} />
          {!isWishlisted ? <p>Add to wishlist</p> : <p>Remove from wishlist</p>}
        </Button>
        {!isCarted ? (
          <Button className="long-button" onClick={handleAddToCartClick}>
            Add to cart
          </Button>
        ) : (
          <Button className="long-button" onClick={handleGoToCartClick}>
            Go to cart
          </Button>
        )}
      </div>
    </>
  );
}

export default ClientCartActions;
