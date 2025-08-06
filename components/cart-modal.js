import Link from "next/link";
import { use, useOptimistic } from "react";

import { CartContext } from "@/store/cart-context";

import Modal from "./UI/modal";
import CartItem from "./cart-item";
import Button from "./UI/button";
import { updateCartDelete, updateQuantityInCart } from "@/lib/cart";
import { UserContext } from "@/store/user-context";
import LinkWithProgress from "./UI/link-with-progress";
import { currencyFormatter } from "@/util/util";

function CartModal({ handleCartClose }) {
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

  const totalPrice = optimisticCartItems.reduce((acc, item) => {
    return acc + +item.price * item.quantity || 0;
  }, 0);

  return (
    <Modal onClose={handleCartClose} label="cart">
      <h1>Shopping Cart</h1>
      {optimisticCartItems.length > 0 ? (
        <>
          <ul>
            {optimisticCartItems.map((item) => (
              <CartItem
                key={item.product_id}
                itemDetails={item}
                updateQuantityAction={updateQuantityAction}
                cartItemDeletAction={cartItemDeletAction}
              />
            ))}
          </ul>
          <div className="button-section">
            <h2>
              Total <span>{currencyFormatter.format(totalPrice)}</span>
            </h2>

            <div>
              <LinkWithProgress href="/cart">
                <Button type="button" className="long-button">
                  View cart
                </Button>
              </LinkWithProgress>

              <LinkWithProgress href="/checkout">
                <Button type="button" className="long-button">
                  Checkout
                </Button>
              </LinkWithProgress>
            </div>
          </div>
        </>
      ) : (
        <div className="no-items">
          <p>
            No items in Cart. <Link href={`/shop`}>Go to shop.</Link>
          </p>
        </div>
      )}
    </Modal>
  );
}

export default CartModal;
