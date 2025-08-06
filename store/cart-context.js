"use client";

import { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartContextProvider({
  children,
  cartItems = [],
  cartCount = 0,
  wishlistItems = [],
  wishlistCount = 0,
}) {
  const [cart, setCart] = useState({
    cartItems,
    cartCount,
  });
  const [wishlist, setWishlist] = useState({
    wishlistItems,
    wishlistCount,
  });

  const [isCartModal, setIsCartModal] = useState(false);

  const value = {
    cart,
    wishlist,
    setCart,
    setWishlist,
    isCartModal,
    setIsCartModal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
