import { use } from "react";
import { motion } from "motion/react";
import { CartContext } from "@/store/cart-context";

import Badge from "./badge";

import cartIcon from "@/assets/UI/cart-icon.svg";

function CartIcon({ handleCartClick }) {
  const { cart } = use(CartContext);
  const { cartCount } = cart;
  return (
    <li onClick={handleCartClick} className="badge-container">
      <motion.img
        src={cartIcon.src}
        alt="cart-icon"
        whileTap={{
          scale: 1.6,
        }}
      />
      <Badge>{cartCount}</Badge>
    </li>
  );
}

export default CartIcon;
