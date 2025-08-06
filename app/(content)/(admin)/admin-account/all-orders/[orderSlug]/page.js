export const dynamic = "force-dynamic";

import classes from "./page.module.css";

import { getOrderDetails } from "@/lib/orders";

import MyOrderDetailTable from "@/components/tables/my-order-detail-table";
import MyOrderDetailTotal from "@/components/my-account/my-order-detail-total";
import OrderSubHeader from "@/components/profile-client-actions/order-sub-header";
import BuyersInfo from "@/components/my-account/buyers-info";

async function OrderDetailPage({ params }) {
  const orderId = (await params).orderSlug;
  const { orderItems, totalPrice, totalOrders, orderStatus,  buyerDetails } =
    await getOrderDetails(orderId);

  return (
    <section className={classes.orderDetailSection}>
      <div className={classes.orderContentsContainer}>
        <OrderSubHeader
          totalProducts={totalOrders}
          currentPage={1}
          orderId={orderId}
          label="order-detail"
        />
        <MyOrderDetailTable orderItems={orderItems} orderId={orderId} />
        <BuyersInfo buyerDetails={buyerDetails}/>
        <MyOrderDetailTotal
          orderTotal={totalPrice}
          orderId={orderId}
          orderStatus={orderStatus}
        />
      </div>
    </section>
  );
}

export default OrderDetailPage;
