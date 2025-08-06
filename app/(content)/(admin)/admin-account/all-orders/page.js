export const dynamic = "force-dynamic";

import classes from "./page.module.css";

import { VerifyAuth } from "@/lib/lucia";

import { getProfilePageDetails } from "@/util/util";
import { getOrders } from "@/lib/orders";

import OrderSubHeader from "@/components/profile-client-actions/order-sub-header";
import MyOrdersTable from "@/components/tables/my-orders-table";
import ProfilePageNav from "@/components/profile-client-actions/profile-page-nav";
import { getOrdersAdmin } from "@/lib/admin/orders-admin";

async function MyOrdersPage({ searchParams }) {
  const result = await VerifyAuth();

  let userId;

  if (result.user) {
    const { userId: id } = result.user;
    userId = id;
  }

  const resolvedSearchParams = await searchParams;

  const { currentPage, filterValue, searchTerm, offsetValue } =
    getProfilePageDetails(resolvedSearchParams);

  let orders;
  let numberOfOrders;

  if (result.user.role !== "admin") {
    const { orders: userOrders, numberOfOrders: totalOrder } = await getOrders(
      userId,
      filterValue,
      offsetValue,
      searchTerm
    );
    orders = userOrders;
    numberOfOrders = totalOrder;
  } else {
    const { orders: allOrders, numberOfOrders: totalOrder } =
      await getOrdersAdmin(filterValue, offsetValue, searchTerm);
    orders = allOrders;
    numberOfOrders = totalOrder;
  }
  return (
    <section className={classes.myOrderSecton}>
      <h1>{result.user.role !== "admin" ? "My Orders" : "All Orders"}</h1>
      <OrderSubHeader
        totalProducts={numberOfOrders}
        currentPage={currentPage}
      />
      <MyOrdersTable orders={orders} />

      <ProfilePageNav
        numberOfProducts={numberOfOrders}
        currentPage={currentPage}
        filterValue={filterValue}
      />
    </section>
  );
}

export default MyOrdersPage;
