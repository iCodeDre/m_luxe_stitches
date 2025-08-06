import classes from "../all-orders/page.module.css";

import { getProfilePageDetails } from "@/util/util";
import { getWishlist } from "@/lib/cart";

import WishlistTable from "@/components/tables/wishlist-table";
import ProfilePageNav from "@/components/profile-client-actions/profile-page-nav";
import { VerifyAuth } from "@/lib/lucia";

async function WishListPage({ searchParams }) {
  const result = await VerifyAuth();

  let userId;

  if (result.user) {
    const { userId: id } = result.user;
    userId = id;
  }

  const resolvedSearchParams = await searchParams;

  const { currentPage, filterValue, offsetValue } =
    getProfilePageDetails(resolvedSearchParams);

  const { wishlistItems, wishlistCount } = await getWishlist(
    userId,
    offsetValue
  );

  return (
    <section className={classes.myOrderSecton} key={searchParams}>
      <h1>My Wishlist</h1>
      <WishlistTable wishlistItems={wishlistItems} userId={userId} />

      <ProfilePageNav
        numberOfProducts={wishlistCount}
        currentPage={currentPage}
        filterValue={filterValue}
      />
    </section>
  );
}

export default WishListPage;
