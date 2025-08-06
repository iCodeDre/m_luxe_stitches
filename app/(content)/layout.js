import Header from "@/components/main-header";
import Footer from "@/components/footer";

import "../globals.css";

import CartContextProvider from "@/store/cart-context";
import CategoriesContextProvider from "@/store/category-context";

import { VerifyAuth } from "@/lib/lucia";

import { getCartAndWishlist } from "@/lib/cart";
import UserContextProvider from "@/store/user-context";
import { getCategoryLinks } from "@/lib/category-links";
import MobileNav from "@/components/mobile-nav";
import AddIcon from "@/components/UI/add-icon";
import SearchModalContextProvider from "@/store/search-modal-context";

export default async function RootLayout({ children }) {
  const result = await VerifyAuth();

  let userId;

  if (result.user) {
    const { userId: id } = result.user;
    userId = id;
  }

  const { cartItems, cartCount, wishlist, wishlistCount } =
    await getCartAndWishlist(userId);

  const allCategories = await getCategoryLinks();

  return (
    <>
      <CartContextProvider
        cartItems={cartItems}
        cartCount={cartCount}
        wishlistItems={wishlist}
        wishlistCount={wishlistCount}
      >
        <UserContextProvider userDetails={result.user || null}>
          <CategoriesContextProvider allCategories={allCategories}>
            <SearchModalContextProvider>
              <Header />
              {children}
              {result?.user?.role === "admin" && <AddIcon />}

              <MobileNav />
            </SearchModalContextProvider>
          </CategoriesContextProvider>
        </UserContextProvider>
      </CartContextProvider>
      <Footer />
    </>
  );
}
