"use client";

import { motion } from "motion/react";

import classes from "./my-orders-table.module.css";

import { useRouter } from "next/navigation";
import { deleteOrder } from "@/lib/orders";

import DeleteIcon from "../UI/delete-icon";
import { UserContext } from "@/store/user-context";
import NProgress from "nprogress";
import LinkWithProgress from "../UI/link-with-progress";
import { use } from "react";
import { currencyFormatter } from "@/util/util";
import { toast } from "sonner";
import NoProducts from "../UI/no-items/no-products";

function MyOrdersTable({ orders }) {
  const { user } = use(UserContext);
  const { role } = user;

  const router = useRouter();

  async function orderDeleteAction(orderId) {
    try {
      const res = await deleteOrder(orderId);

      if (res.success) {
        router.refresh();
        toast.success("Order deleted successfully");
      }

      return;
    } catch (error) {
      console.log(error.message);
      if (error.message === "Order no longer exist!") {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to delete order, please try again");
    }
  }

  return (
    <>
      {orders.length > 0 ? (
        <>
          <table className={`${classes.myTableOrders}`}>
            <thead>
              <tr className={classes.headerRows}>
                <th>Order no</th>
                <th>Total items</th>
                <th>Total amount</th>
                <th>Order status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const isAnimated =
                  order.order_status === "pending" ||
                  order.order_status === "ongoing";
                return (
                  <motion.tr
                    transition={{
                      duration: 0.5,
                    }}
                    whileHover={{
                      background: "#f0f0f0",
                    }}
                    whileTap={{ scale: 0.7 }}
                    style={{ cursor: "pointer" }}
                    key={order.order_id}
                    onClick={() => {
                      NProgress.start();
                      router.push(
                        role !== "admin"
                          ? `/my-account/my-orders/${order.order_id}`
                          : `/admin-account/all-orders/${order.order_id}`
                      );
                    }}
                  >
                    <td
                      className={
                        role !== "admin" && order.order_status === "pending"
                          ? classes.tableImageContainer
                          : classes.adminTd
                      }
                    >
                      {role !== "admin" && order.order_status === "pending" ? (
                        <form
                          action={orderDeleteAction.bind(null, order.order_id)}
                        >
                          <DeleteIcon
                            className={classes.deleteIconContainer}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </form>
                      ) : null}

                      {order.order_id}
                    </td>

                    <td>{order.items_quantity}</td>
                    <td className="price-highlight">
                      {currencyFormatter.format(order.total_order_amount)}
                    </td>
                    <td>
                      <motion.p
                        className={order.order_status}
                        initial={{ scale: 1, opacity: 1 }}
                        animate={
                          isAnimated
                            ? { scale: [1, 1.02, 1], opacity: [1, 0.5, 1] }
                            : { scale: 1, opacity: 1 }
                        }
                        transition={
                          isAnimated
                            ? {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut",
                              }
                            : { duration: 0 }
                        }
                      >
                        {order.order_status}
                      </motion.p>
                    </td>
                    <td>
                      {new Date(order.order_date).toISOString().slice(0, 10)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          <ul className="items-list order-items-list">
            {orders.map((order) => {
              const isAnimated =
                order.order_status === "pending" ||
                order.order_status === "ongoing";
              return (
                <LinkWithProgress
                  key={order.order_id}
                  href={
                    role !== "admin"
                      ? `/my-account/my-orders/${order.order_id}`
                      : `/admin-account/all-orders/${order.order_id}`
                  }
                >
                  <motion.li
                    transition={{
                      duration: 0.5,
                    }}
                    whileHover={{
                      background: "#f0f0f0",
                    }}
                    whileTap={{ scale: 0.7 }}
                  >
                    <div>
                      <div className="item-header">
                        <h1>Order no: {order.order_id}</h1>

                        {role !== "admin" && (
                          <form
                            action={orderDeleteAction.bind(
                              null,
                              order.order_id
                            )}
                          >
                            <DeleteIcon
                              className={classes.deleteIconContainer}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </form>
                        )}
                      </div>
                      <table>
                        <tbody>
                          <tr>
                            <td className="order-row-label">PRICE:</td>
                            <td align="right">
                              {currencyFormatter.format(
                                order.total_order_amount
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="order-row-label">Status:</td>
                            <td align="right">
                              <motion.p
                                className={order.order_status}
                                initial={{ scale: 1, opacity: 1 }}
                                animate={
                                  isAnimated
                                    ? {
                                        scale: [1, 1.02, 1],
                                        opacity: [1, 0.5, 1],
                                      }
                                    : { scale: 1, opacity: 1 }
                                }
                                transition={
                                  isAnimated
                                    ? {
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        ease: "easeInOut",
                                      }
                                    : { duration: 0 }
                                }
                              >
                                {order.order_status}
                              </motion.p>
                            </td>
                          </tr>
                          <tr>
                            <td className="order-row-label">Order Date:</td>
                            <td align="right">
                              {new Date(order.order_date)
                                .toISOString()
                                .slice(0, 10)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.li>
                </LinkWithProgress>
              );
            })}
          </ul>
        </>
      ) : (
        <table>
          <tbody>
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                <NoProducts>No orders</NoProducts>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

export default MyOrdersTable;
