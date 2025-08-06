"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import classes from "./my-order-detail-total.module.css";

import { UserContext } from "@/store/user-context";

import { deleteOrder } from "@/lib/orders";

import {
  allOrderItemsAction,
  markFulfillAction,
} from "@/actions/admin/order-actions";

import { currencyFormatter } from "@/util/util";
import FormSubmit from "../post-and-edit-forms/form-submit";
import { toast } from "sonner";

function MyOrderDetailTotal({ orderTotal, orderId, orderStatus }) {
  const router = useRouter();

  const { user } = use(UserContext);
  const { role } = user;

  async function orderDeleteAction(orderId) {
    try {
      const res = await deleteOrder(orderId);

      if (res.success) {
        if (role !== "admin") {
          router.replace("/my-account/my-orders");
        } else {
          router.replace("/admin-account/all-orders");
        }
        toast.success("Order terminated successfully");
      }
      return;
    } catch (error) {
      console.log(error.message);
      if (error.message === "Order no longer exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to terminate order, please try again");
    }
  }

  async function allOrderItems(orderId, actionType) {
    try {
      const res = await allOrderItemsAction(orderId, actionType);

      if (res.success) {
        if (actionType === "approved") {
          toast.success("Orders successfully approved");
        } else {
          router.replace("/admin-account/all-orders");
          toast.success("Orders successfully denied");
        }
        return;
      }
    } catch (error) {
      if (error.message === "Order no longer exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to update order");
    }
  }

  async function markFulfill(orderId) {
    try {
      const res = await markFulfillAction(orderId);
      if (res.success) {
        toast.success("Order marked as fulfilled, keep it up");
      }
      return;
    } catch (error) {
      if (error.message === "Order no longer exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to update order");
    }
  }
  return (
    <div
      className={classes.orderDetailTotals}
      style={{ height: "fit-content", alignSelf: "flex-end" }}
    >
      <div>
        <h2>Total</h2>
        <p
          style={
            orderStatus === "fulfilled" ? { filter: "grayscale(1)" } : undefined
          }
        >
          {currencyFormatter.format(orderTotal)}
        </p>
      </div>

      {role !== "admin" ? (
        <form action={orderDeleteAction.bind(null, orderId)}>
          <FormSubmit className="long-button" label>
            Cancel order
          </FormSubmit>
        </form>
      ) : (
        <>
          {orderStatus === "pending" ? (
            <span>
              <form action={allOrderItems.bind(null, orderId, "approved")}>
                <FormSubmit label>Approve all</FormSubmit>
              </form>
              <form action={allOrderItems.bind(null, orderId, "denied")}>
                <FormSubmit label>Deny all</FormSubmit>
              </form>
            </span>
          ) : orderStatus === "ongoing" ? (
            <span>
              <form action={markFulfill.bind(null, orderId)}>
                <FormSubmit label>Mark as fulfilled</FormSubmit>
              </form>
              <form action={orderDeleteAction.bind(null, orderId)}>
                <FormSubmit label>Terminate order</FormSubmit>
              </form>
            </span>
          ) : (
            orderStatus === "fulfilled" && (
              <span>
                <p>No action. Order was fulfilled!</p>
              </span>
            )
          )}
        </>
      )}
    </div>
  );
}

export default MyOrderDetailTotal;
