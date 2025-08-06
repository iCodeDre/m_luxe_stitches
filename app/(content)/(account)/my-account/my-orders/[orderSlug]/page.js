export const dynamic = "force-dynamic";

import classes from "./page.module.css";

import { getOrderDetails } from "@/lib/orders";

import MyOrderDetailTable from "@/components/tables/my-order-detail-table";
import MyOrderDetailTotal from "@/components/my-account/my-order-detail-total";
import OrderSubHeader from "@/components/profile-client-actions/order-sub-header";

async function OrderDetailPage({ params }) {
  const orderId = (await params).orderSlug;
  const { orderItems, totalPrice, totalOrders } = await getOrderDetails(orderId);

  return (
    <section className={classes.orderDetailSection}>
      <div className={classes.orderContentsContainer}>
        <OrderSubHeader
          totalProducts={totalOrders}
          currentPage={1}
          orderId={orderId}
          label='order-detail'
        />
        <MyOrderDetailTable orderItems={orderItems} />
        <MyOrderDetailTotal orderTotal={totalPrice} orderId={orderId} />
      </div>
    </section>
  );
}

export default OrderDetailPage;
