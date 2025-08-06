"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { motion } from "motion/react";

import { CartContext } from "@/store/cart-context";
import { addToCart, updateWishlistDelete } from "@/lib/cart";
import classes from "./wishlist-table.module.css";

import CartItemImage from "../UI/cart-item-image";
import DeleteIcon from "../UI/delete-icon";

import NProgress from "nprogress";
import { toast } from "sonner";
import FormSubmit from "../post-and-edit-forms/form-submit";
import { currencyFormatter, truncateText } from "@/util/util";

const rowVariants = {
  tap: { scale: 0.95 },
};

function WishlistTable({ wishlistItems, userId }) {
  const router = useRouter();
  const { setWishlist, setCart } = use(CartContext);

  async function wishlistItemDeleteAction(productId) {
    try {
      const { updatedWishlist, updatedwishlistCount } =
        await updateWishlistDelete(userId, productId);

      setWishlist({
        wishlistItems: updatedWishlist,
        wishlistCount: updatedwishlistCount,
      });
      router.refresh();
      toast.success("Wishlist updated successfully");
    } catch (error) {
      console.log(error.message);
      if (error.message === "Product is no longer in your wishlist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to update wishlist, please try again");
    }
  }

  async function moveToCart(userId, productId, quantity) {
    try {
      const { cartItems, cartCount, wishlistItems, wishlistCount } =
        await addToCart(userId, productId, quantity);

      setCart({
        cartItems,
        cartCount,
      });

      setWishlist({
        wishlistItems,
        wishlistCount,
      });
      router.refresh();
      toast.success("Item has been moved to cart successfully");
    } catch (error) {
      console.log(error.message);
      if (error.message === "Product does not exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to move item to cart, please try again");
    }
  }

  return (
    <>
      {wishlistItems.length > 0 ? (
        <>
          <table className={`${classes.cartTable} ${classes.myWishlist}`}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {wishlistItems.map((item) => (
                <motion.tr
                  key={item.product_id}
                  variants={rowVariants}
                  transition={{
                    duration: 0.5,
                  }}
                  whileHover={{
                    background: "#f0f0f0",
                  }}
                  whileTap="tap"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    NProgress.start();
                    router.push(`/products/${item.slug}`);
                  }}
                >
                  <td className={classes.tableImageContainer}>
                    <form
                      action={wishlistItemDeleteAction.bind(
                        null,
                        item.product_id
                      )}
                    >
                      <DeleteIcon
                        className={`${classes.deleteIconContainer}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </form>

                    <Link href="#">
                      <CartItemImage image={item.image_url} />
                    </Link>

                    <h1>{truncateText(item.title)}</h1>
                  </td>
                  <td className="price-highlight">
                    {currencyFormatter.format(item.price)}
                  </td>
                  <td>
                    <form
                      action={moveToCart.bind(null, userId, item.product_id, 1)}
                    >
                      <FormSubmit
                        className="action-button green-highlight"
                        onClick={(e) => e.stopPropagation()}
                        label
                      >
                        Move to cart
                      </FormSubmit>
                    </form>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          <ul className="items-list">
            {wishlistItems.map((item) => (
              <motion.li
                key={item.product_id}
                variants={rowVariants}
                transition={{
                  duration: 0.5,
                }}
                whileHover={{
                  background: "#f0f0f0",
                }}
                whileTap="tap"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  NProgress.start();
                  router.push(`/products/${item.slug}`);
                }}
              >
                <Link href="#">
                  <CartItemImage image={item.image_url} />
                </Link>

                <div>
                  <div className="item-header">
                    <h1>{truncateText(item.title)}</h1>
                    <form
                      action={wishlistItemDeleteAction.bind(
                        null,
                        item.product_id
                      )}
                    >
                      <DeleteIcon
                        className={classes.deleteIconContainer}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </form>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="row-label">PRICE:</td>
                        <td align="right">N{item.price}</td>
                      </tr>
                    </tbody>
                  </table>
                  <form
                    action={moveToCart.bind(null, userId, item.product_id, 1)}
                  >
                    <FormSubmit
                      className="action-button green-highlight"
                      onClick={(e) => e.stopPropagation()}
                      label
                    >
                      Move to cart
                    </FormSubmit>
                  </form>
                </div>
              </motion.li>
            ))}
          </ul>
        </>
      ) : (
        <div className="no-items">
          <p>
            No items in Wishlist. <Link href={`/shop`}>Continue shopping.</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default WishlistTable;
