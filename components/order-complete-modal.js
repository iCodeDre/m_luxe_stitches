"use client";

import { motion } from "motion/react";

import classes from "./order-complete-modal.module.css";

import checkIcon from "@/assets/UI/successfull-check.svg";
import { use, useEffect, useRef, useState } from "react";
import { UserContext } from "@/store/user-context";
import LinkWithProgress from "./UI/link-with-progress";
import Button from "./UI/button";

import { toast } from "sonner";
import { CartContext } from "@/store/cart-context";
import { verifyCheckout } from "@/lib/verify-checkout";
import { useRouter } from "next/navigation";
import NoProducts from "./UI/no-items/no-products";

function OrderCompleteModal({ orderId }) {
  const { user } = use(UserContext);
  const { userId } = user;
  const { setCart } = use(CartContext);

  const router = useRouter();

  const [verified, setVerified] = useState(false);

  const hasRun = useRef(false);

  useEffect(() => {
    async function verifyAndClearCheckout() {
      if (hasRun.current) return;
      hasRun.current = true;
      try {
        const res = await verifyCheckout(userId, orderId);

        if (!res.success) {
          toast.error("Invalid or expired order. Redirecting...");
          router.replace("/shop");
          return;
        }
        setCart({
          cartItems: [],
          cartCount: 0,
        });
        setVerified(true);
        toast.success("Order was placed successfully");
      } catch (error) {
        console.log(error.message);
        toast.error("Invalid or expired order. Redirecting...");
        router.replace("/shop");
      }
    }

    verifyAndClearCheckout();

    return;
  }, []);

  if (!verified) return <NoProducts>Verifying request...</NoProducts>;

  return (
    <div className={classes.orderCompletePage}>
      <div>
        <motion.img
          src={checkIcon.src}
          alt="check-icon"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
          viewport={{ once: true }}
        />
        <h1>Order successfull</h1>
        <p>
          You have successfully placed an order. Your order number is{" "}
          <b>({orderId})</b>. You will be contacted on whatsapp by M.luxe
          stitches for further discussion on this number:{" "}
          <b>{user.phoneNumber}</b> or you can change your number here:{" "}
          <LinkWithProgress
            href={
              user.role !== "admin"
                ? "/my-account/edit-account"
                : "/admin-account/edit-account"
            }
          >
            edit number.{" "}
          </LinkWithProgress>
          You can track your order status here:{" "}
          <LinkWithProgress
            href={
              user.role !== "admin"
                ? "/my-account/my-orders"
                : "/admin-account/all-orders"
            }
          >
            track order.
          </LinkWithProgress>
          <br />
        </p>
        <span>
          Thanks for your patronage, we hope to see you again. <b> M.luxe</b>
        </span>
        <LinkWithProgress href="/shop">
          <Button>Continue shopping</Button>
        </LinkWithProgress>
      </div>
    </div>
  );
}

export default OrderCompleteModal;
