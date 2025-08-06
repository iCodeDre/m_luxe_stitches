"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { motion } from "motion/react";

import { UserContext } from "@/store/user-context";

import classes from "./mobile-nav.module.css";

import CartModal from "./cart-modal";
import CartIcon from "./UI/cart-icon";

import userProfileIcon from "@/assets/UI/user-profile.svg";

import WishlistIcon from "./UI/wishlist-icon";
import Button from "./UI/button";
import { CartContext } from "@/store/cart-context";
import LinkWithProgress from "./UI/link-with-progress";

function MobileNav() {
  const { user } = use(UserContext);
  const { role } = user;

  const { isCartModal, setIsCartModal } = use(CartContext);

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const scrollThreshold = 10;
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      if (currentScrollY < 200) {
        setIsVisible(true);
      } else if (scrollDelta > scrollThreshold) {
        setIsVisible(false);
      } else if (scrollDelta < -scrollThreshold) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    }

    function handleClick(e) {
      if (!e.target.closest(`.${classes.mobileNavSection}`))
        setIsVisible(false);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
    };
  }, [lastScrollY]);

  function handleCartClick() {
    setIsCartModal(true);
  }

  return (
    <>
      {isCartModal && <CartModal />}

      <motion.header
        className={classes.mobileNavSection}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : "100%" }}
        transition={{ duration: 0.6 }}
      >
        <nav>
          <ul>
            <WishlistIcon />

            <CartIcon handleCartClick={handleCartClick} />

            {user.userId ? (
              <li className={classes.postion}>
                <LinkWithProgress
                  href={role !== "admin" ? "/my-account" : "/admin-account"}
                >
                  <motion.img
                    src={userProfileIcon.src}
                    alt="user-profile-icon"
                    className={classes.userIcon}
                    whileTap={{
                      scale: 1.6
                    }}
                  />
                </LinkWithProgress>
              </li>
            ) : (
              <Link href="/auth">
                <Button className="auth-button">Login</Button>
              </Link>
            )}
          </ul>
        </nav>
      </motion.header>
    </>
  );
}

export default MobileNav;
