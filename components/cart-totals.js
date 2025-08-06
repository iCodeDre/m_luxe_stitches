import { useRouter } from "next/navigation";

import classes from "./cart-totals.module.css";

import Button from "./UI/button";
import CartItem from "./cart-item";
import { use, useState } from "react";
import { UserContext } from "@/store/user-context";
import { submitOrder } from "@/lib/submit-order";
import LinkWithProgress from "./UI/link-with-progress";
import { currencyFormatter } from "@/util/util";
import { toast } from "sonner";

function CartTotal({ cartItems, cartTotal, label }) {
  const router = useRouter();
  const { user } = use(UserContext);
  const { userId } = user;

  const [isPending, setIsPending] = useState(false);

  async function handleOrderSubmitClick() {
    setIsPending(true);
    try {
      const res = await submitOrder(userId, cartItems);
      if (res.success) {
        return router.replace(`/order-complete/${res.orderId}`);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to place order, please try again");
    } finally {
      setIsPending(false);
    }
  }

  if (label === "checkout") {
    return (
      <div className={` ${classes.checkoutTotals}`}>
        <header>
          <h1>Your Order</h1>
        </header>
        {cartItems.map((item) => (
          <CartItem key={item.product_id} label="checkout" itemDetails={item} />
        ))}

        <div>
          <h2>Total</h2>
          <p>{currencyFormatter.format(cartTotal)}</p>
        </div>

        <Button
          className="long-button"
          onClick={handleOrderSubmitClick}
          disabled={isPending}
          style={isPending ? { opacity: 0.8 } : null}
        >
          {!isPending ? "Place Order" : "Submiting Order"}
        </Button>
      </div>
    );
  } else {
    return (
      <div className={classes.cartTotals}>
        <header>
          <h1>Cart totals</h1>
        </header>

        <div>
          <h2>Total</h2>
          <p>{currencyFormatter.format(cartTotal)}</p>
        </div>

        <LinkWithProgress href="/checkout">
          <Button className="long-button">Checkout</Button>
        </LinkWithProgress>
      </div>
    );
  }
}

export default CartTotal;
