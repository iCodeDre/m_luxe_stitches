import { use } from "react";
import { CartContext } from "@/store/cart-context";
import { motion } from "motion/react";

import Badge from "./badge";

import wishlistIcon from "@/assets/UI/wishlist-icon.svg";
import { UserContext } from "@/store/user-context";
import LinkWithProgress from "./link-with-progress";

function WishlistIcon() {
  const { wishlist } = use(CartContext);
  const { user } = use(UserContext);
  const { wishlistCount } = wishlist;

  return (
    <li className="badge-container">
      <LinkWithProgress
        href={
          user.role === "user"
            ? "/my-account/my-wishlist"
            : "/admin-account/my-wishlist"
        }
      >
        <motion.img
          src={wishlistIcon.src}
          alt="wishlist-icon"
          whileTap={{
            scale: 1.6,
          }}
        />
        <Badge>{wishlistCount}</Badge>
      </LinkWithProgress>
    </li>
  );
}

export default WishlistIcon;
