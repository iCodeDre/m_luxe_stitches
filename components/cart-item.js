import Image from "next/image";
import classes from "./cart-item.module.css";

import QuantityButtons from "./UI/quantity-buttons";
import CartItemImage from "./UI/cart-item-image";
import DeleteIcon from "./UI/delete-icon";

import closeIcon from "@/assets/UI/close-icon.svg";
import { currencyFormatter, truncateText } from "@/util/util";

function CartItem({
  label,
  itemDetails,
  updateQuantityAction,
  cartItemDeletAction,
}) {
  if (label === "checkout") {
    return (
      <li className={`${classes.cartItem} ${classes.checkoutItem}`}>
        <div className={classes.cartItemImage}>
          <CartItemImage image={itemDetails.image_url} />
        </div>
        <div className={classes.cartItemDetails}>
          <h2 className={classes.truncate}>
            {truncateText(itemDetails.title, 7)}
          </h2>

          <div className={classes.priceSection}>
            <p>
              {itemDetails.quantity}
              <Image src={closeIcon} alt="multiply-icon" width="12" />
            </p>
            <p>
              {currencyFormatter.format(
                itemDetails.price * itemDetails.quantity
              )}
            </p>
          </div>
        </div>
      </li>
    );
  } else {
    return (
      <li className={classes.cartItem}>
        <div style={{ display: "flex" }}>
          <form
            action={cartItemDeletAction.bind(
              null,
              itemDetails.product_id,
              "delete"
            )}
          >
            <DeleteIcon className={classes.deleteIconContainer} />
          </form>

          <div className={classes.cartItemImage}>
            <CartItemImage image={itemDetails.image_url} />
          </div>
        </div>
        <div className={classes.cartItemDetails}>
          <h2 className={classes.truncate}>
            {truncateText(itemDetails.title, 3)}
          </h2>
          <QuantityButtons
            quantity={itemDetails.quantity}
            updateQuantityAction={updateQuantityAction}
            productId={itemDetails.product_id}
          />

          <div className={classes.priceSection}>
            <p>
              {itemDetails.quantity}
              <Image src={closeIcon} alt="multiply-icon" width="12" />
            </p>
            <p>
              {currencyFormatter.format(
                itemDetails.price * itemDetails.quantity
              )}
            </p>
          </div>
        </div>
      </li>
    );
  }
}

export default CartItem;
