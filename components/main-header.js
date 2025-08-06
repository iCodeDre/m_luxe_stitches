"use client";
import { use, useState, useEffect } from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import classes from "./main-header.module.css";

import SearchModal from "./UI/search-modal";
import CartModal from "./cart-modal";
import CartIcon from "./UI/cart-icon";

import logoImg from "@/assets/m-luxe-transparen-icont.png";
import searchIcon from "@/assets/UI/search-icon.svg";
import wishlistIcon from "@/assets/UI/wishlist-icon.svg";

import userProfileIcon from "@/assets/UI/user-profile.svg";
import ordersIcon from "@/assets/UI/orders-icon.svg";
import logoutIcon from "@/assets/UI/logout-icon.svg";
import WishlistIcon from "./UI/wishlist-icon";
import { CartContext } from "@/store/cart-context";
import { UserContext } from "@/store/user-context";
import Button from "./UI/button";
import { usePathname } from "next/navigation";
import LinkWithProgress from "./UI/link-with-progress";
import ProgressBar from "./UI/progress-bar";

import NProgress from "nprogress";
import { CategoriesContext } from "@/store/category-context";
import { SearchModalContext } from "@/store/search-modal-context";
import { handleLogoutAction } from "@/util/util";

function Header() {
  const path = usePathname();

  const { user, setUser } = use(UserContext);
  const { categories: categoryOptions } = use(CategoriesContext);
  const { isSearchModal, setIsSearchModal } = use(SearchModalContext);
  const { isCartModal, setIsCartModal, setCart, setWishlist } =
    use(CartContext);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    NProgress.done();
  }, []);

  useEffect(() => {
    function handleClick(event) {
      if (!event.target.closest(`.${classes.categoryPostion}`))
        setIsCategoryOpen(false);
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

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
      const currentScrollY = window.scrollY;
      if (
        currentScrollY > 200 &&
        !e.target.closest(`.${classes.headerSection}`)
      ) {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
    };
  }, [lastScrollY]);

  function handleSearchClick() {
    setIsSearchModal(true);
  }
  function handleSearchClose() {
    setIsSearchModal(false);
  }
  function handleCartClick() {
    setIsCartModal(true);
  }

  return (
    <>
      <ProgressBar />
      <AnimatePresence>
        {isSearchModal && (
          <SearchModal
            onClose={handleSearchClose}
            categories={categoryOptions}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{isCartModal && <CartModal />}</AnimatePresence>

      <motion.header
        className={classes.headerSection}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.6 }}
      >
        <nav>
          <LinkWithProgress href="/">
            <Image src={logoImg} alt="m-luxe-log" sizes="50" fill priority />
          </LinkWithProgress>

          <ul>
            <li className={path === "/" ? classes.active : undefined}>
              <LinkWithProgress href="/" prefetch>
                Home
              </LinkWithProgress>
            </li>
            <li
              className={path.startsWith("/shop") ? classes.active : undefined}
            >
              <LinkWithProgress href="/shop">Shop</LinkWithProgress>
            </li>
            <li
              className={`${classes.categoryPostion} ${
                path.startsWith("/categories") ? classes.active : null
              }`}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              Categories
              {isCategoryOpen && (
                <div className={classes.categoriesDropdown}>
                  {categoryOptions.map((cat) => {
                    const isChecked = path === `/categories/${cat.name}`;

                    return (
                      <div key={"main-header" + cat.name}>
                        <input
                          type="radio"
                          id={`main-header-${cat.name}`}
                          className={classes.categoryOption}
                          hidden
                          defaultChecked={isChecked}
                        />
                        <LinkWithProgress href={`/categories/${cat.name}`}>
                          <label
                            htmlFor={`main-header-${cat.name}`}
                            className={classes.categoryLabel}
                          >
                            {cat.name}
                          </label>
                        </LinkWithProgress>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          </ul>

          <li onClick={handleSearchClick} className={classes.mobileSearchIcon}>
            <motion.img
              src={searchIcon.src}
              alt="search-icon"
              whileTap={{ scale: 1.2 }}
            />
          </li>

          <ul>
            <li onClick={handleSearchClick}>
              <img src={searchIcon.src} alt="search-icon" />
            </li>

            <WishlistIcon />

            <CartIcon handleCartClick={handleCartClick} />

            {user.userId ? (
              <li className={classes.postion}>
                <LinkWithProgress
                  href={
                    user.role !== "admin" ? " /my-account" : "/admin-account"
                  }
                >
                  <img
                    src={userProfileIcon.src}
                    alt="user-profile-icon"
                    className={classes.userIcon}
                  />
                </LinkWithProgress>

                <div className={classes.dropdown}>
                  <LinkWithProgress
                    href={
                      user.role !== "admin" ? " /my-account" : "/admin-account"
                    }
                  >
                    <img src={userProfileIcon.src} alt="user-profile-icon" />
                    Profile
                  </LinkWithProgress>
                  <LinkWithProgress
                    href={
                      user.role !== "admin"
                        ? "/my-account/my-orders"
                        : "/admin-account/all-orders"
                    }
                  >
                    <img src={ordersIcon.src} alt="user-profile-icon" />
                    {user.role !== "admin" ? "My orders" : "All orders"}
                  </LinkWithProgress>
                  <LinkWithProgress
                    href={
                      user.role !== "admin"
                        ? "/my-account/my-wishlist"
                        : "/admin-account/my-wishlist"
                    }
                  >
                    <img src={wishlistIcon.src} alt="wishlist-icon" />
                    Wishlist
                  </LinkWithProgress>

                  <button
                    onClick={() =>
                      handleLogoutAction(setUser, setCart, setWishlist)
                    }
                  >
                    <img src={logoutIcon.src} alt="logout-icon" />
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <LinkWithProgress href="/auth">
                <Button className="auth-button">Login</Button>
              </LinkWithProgress>
            )}
          </ul>
        </nav>
      </motion.header>
    </>
  );
}

export default Header;
