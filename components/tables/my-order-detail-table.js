"use client";
import Link from "next/link";
import { motion } from "motion/react";

import { UserContext } from "@/store/user-context";

import classes from "./my-order-detail-table.module.css";

import CartItemImage from "../UI/cart-item-image";
import { use } from "react";
import { orderItemAction } from "@/actions/admin/order-actions";
import { currencyFormatter, truncateText } from "@/util/util";
import FormSubmit from "../post-and-edit-forms/form-submit";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MyOrderDetailTable({ orderItems, orderId }) {
  const router = useRouter();
  const { user } = use(UserContext);
  const { role } = user;

  async function handleOrderItemAction(orderId, productId, actionType) {
    try {
      const res = await orderItemAction(orderId, productId, actionType);
      if (res.success) {
        toast.success("Order updated successfully");
        if (res.redirect !== null) {
          router.replace(res.redirect);
        }
      }
      return;
    } catch (error) {
      console.log(error.message);
      if (error.message === "Order no longer exist!") {
        toast.error(`${error.message}`);
      }
      toast.error("Failed to update order, please try again");
    }
  }
  return (
    <>
      <table className={classes.orderDetailTable}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total price</th>
            <th>Approval status</th>
          </tr>
        </thead>

        <tbody>
          {orderItems.map((item) => {
            const isAnimated = item.approval_status === "awaiting";
            const isDenied = item.approval_status === "denied";

            return (
              <tr
                key={item.product_id}
                style={isDenied ? { filter: "grayscale(1)" } : null}
              >
                <td className={classes.tableImageContainer}>
                  <Link href="#">
                    <CartItemImage image={item.image_url} />
                  </Link>

                  <h1>{truncateText(item.title)}</h1>
                </td>
                <td className="price-highlight">
                  {currencyFormatter.format(item.item_price)}
                </td>
                <td>{item.quantity}</td>
                <td className="price-highlight">
                  {currencyFormatter.format(item.item_total_price)}
                </td>
                <td className={item.approval_status}>
                  {role === "admin" && isAnimated ? (
                    <div className={classes.adminActionButtonContainer}>
                      <form
                        action={handleOrderItemAction.bind(
                          null,
                          orderId,
                          item.product_id,
                          "approved"
                        )}
                      >
                        <FormSubmit type="submit" label>
                          Approve
                        </FormSubmit>
                      </form>
                      <form
                        action={handleOrderItemAction.bind(
                          null,
                          orderId,
                          item.product_id,
                          "denied"
                        )}
                      >
                        <FormSubmit type="submit" label>
                          Deny
                        </FormSubmit>
                      </form>
                    </div>
                  ) : (
                    <motion.p
                      initial={{
                        scale: 1,
                        opacity: 1,
                      }}
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
                      {item.approval_status}
                    </motion.p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="items-list">
        {orderItems.map((item) => {
          const isAnimated = item.approval_status === "awaiting";
          const isDenied = item.approval_status === "denied";
          return (
            <li
              key={item.product_id}
              style={isDenied ? { filter: "grayscale(1)" } : null}
            >
              <Link href="#">
                <CartItemImage image={item.image_url} />
              </Link>

              <div>
                <div className="item-header">
                  <h1>{truncateText(item.title)}</h1>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td className="row-label">PRICE:</td>
                      <td align="right">
                        {currencyFormatter.format(item.item_price)}
                      </td>
                    </tr>
                    <tr>
                      <td className="row-label">QUANTITY ORDERED: </td>
                      <td align="right">{item.quantity}</td>
                    </tr>
                    <tr>
                      <td className="row-label">TOTAL PRICE:</td>
                      <td align="right">
                        {currencyFormatter.format(item.item_total_price)}
                      </td>
                    </tr>
                    <tr>
                      <td className="row-label">APPROVAL STATUS:</td>
                      <td align="right">
                        {role === "admin" && isAnimated ? (
                          <div className={classes.adminActionButtonContainer}>
                            <form
                              action={handleOrderItemAction.bind(
                                null,
                                orderId,
                                item.product_id,
                                "approved"
                              )}
                            >
                              <FormSubmit type="submit" label>
                                Approve
                              </FormSubmit>
                            </form>
                            <form
                              action={handleOrderItemAction.bind(
                                null,
                                orderId,
                                item.product_id,
                                "denied"
                              )}
                            >
                              <FormSubmit type="submit" label>
                                Deny
                              </FormSubmit>
                            </form>
                          </div>
                        ) : (
                          <motion.p
                            className={item.approval_status}
                            initial={{
                              scale: 1,
                              opacity: 1,
                            }}
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
                            {item.approval_status}
                          </motion.p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default MyOrderDetailTable;
