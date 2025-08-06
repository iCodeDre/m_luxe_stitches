"use client";

import Link from "next/link";

import classes from "./cart-table.module.css";

import CartItemImage from "./UI/cart-item-image";
import DeleteIcon from "./UI/delete-icon";
import QuantityButtons from "./UI/quantity-buttons";

import { use, useOptimistic } from "react";
import { CartContext } from "@/store/cart-context";
import { updateCartDelete, updateQuantityInCart } from "@/lib/cart";
import { UserContext } from "@/store/user-context";
import { currencyFormatter, truncateText } from "@/util/util";

function CartTable() {
  const { user } = use(UserContext);
  const { userId } = user;
  const { cart, setCart } = use(CartContext);
  const cartItems = cart.cartItems;

  const [optimisticCartItems, updateOptimisticCartItems] = useOptimistic(
    cartItems,
    (prevCartItems, action) => {
      const { mode, productIndex, newQuantity, updatedCartItems } = action;

      if (productIndex === -1) {
        return prevCartItems;
      }
      if (mode !== "delete") {
        const updatedCartItem = { ...prevCartItems[productIndex] };
        updatedCartItem.quantity = newQuantity;
        const newCartItems = [...prevCartItems];
        newCartItems[productIndex] = updatedCartItem;

        return newCartItems;
      }

      return updatedCartItems;
    }
  );

  async function updateQuantityAction(productId, mode) {
    const productIndex = optimisticCartItems.findIndex(
      (item) => item.product_id === productId
    );

    let newQuantity = optimisticCartItems[productIndex].quantity;

    if (mode === "increase") {
      newQuantity = newQuantity + 1;
      if (newQuantity > 10) return;
    }
    if (mode === "decrease") {
      newQuantity = newQuantity - 1;
      if (newQuantity < 1) return;
    }

    updateOptimisticCartItems({ mode, productIndex, newQuantity });

    try {
      const { updatedCartItems, updatedCartCount } = await updateQuantityInCart(
        userId,
        productId,
        newQuantity
      );

      setCart({
        cartItems: updatedCartItems,
        cartCount: updatedCartCount,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async function cartItemDeletAction(productId, mode) {
    const productIndex = optimisticCartItems.findIndex(
      (item) => item.product_id === productId
    );

    const updatedCartItems = optimisticCartItems.filter(
      (item) => item.product_id !== productId
    );

    updateOptimisticCartItems({ mode, productIndex, updatedCartItems });

    try {
      const { updatedCartItems, updatedCartCount } = await updateCartDelete(
        userId,
        productId
      );

      setCart({
        cartItems: updatedCartItems,
        cartCount: updatedCartCount,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      {optimisticCartItems.length > 0 ? (
        <>
          <table className={classes.cartTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {optimisticCartItems.map((item) => (
                <tr key={item.product_id}>
                  <td className={classes.tableImageContainer}>
                    <form
                      action={cartItemDeletAction.bind(
                        null,
                        item.product_id,
                        "delete"
                      )}
                    >
                      <DeleteIcon className={classes.deleteIconContainer} />
                    </form>

                    <Link href="#">
                      <CartItemImage image={item.image_url} />
                    </Link>

                    <h1>{truncateText(item.title)}</h1>
                  </td>
                  <td className="price-highlight">
                    {currencyFormatter.format(item.price * item.quantity)}
                  </td>
                  <td>
                    <QuantityButtons
                      quantity={item.quantity}
                      productId={item.product_id}
                      updateQuantityAction={updateQuantityAction}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="items-list order-items-list">
            {optimisticCartItems.map((item) => {
              return (
                <li key={item.product_id}>
                  <Link href="#">
                    <CartItemImage image={item.image_url} />
                  </Link>
                  <div>
                    <div className="item-header">
                      <h1>{truncateText(item.title)}</h1>
                      <form
                        action={cartItemDeletAction.bind(
                          null,
                          item.product_id,
                          "delete"
                        )}
                      >
                        <DeleteIcon className={classes.deleteIconContainer} />
                      </form>
                    </div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="row-label">QUANTITY:</td>
                          <td align="right">
                            <QuantityButtons
                              quantity={item.quantity}
                              productId={item.product_id}
                              updateQuantityAction={updateQuantityAction}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="row-label">PRICE:</td>
                          <td align="right" className="price-highlight">
                            {currencyFormatter.format(
                              item.price * item.quantity
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="no-items">
          <p>
            No items in Cart. <Link href={`/shop`}>Go to shop.</Link>
          </p>
        </div>
      )}
    </>
  );
}

export default CartTable;
