
import OrderCompleteModal from "@/components/order-complete-modal";

async function OrderComplete({ params }) {
  const orderId = (await params).orderSlug;

  return (
    <>
      <OrderCompleteModal orderId={orderId} />
    </>
  );
}

export default OrderComplete;
