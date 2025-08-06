import Image from 'next/image';

import classes from './cart-item-image.module.css'

function CartItemImage({ image }) {
  return (
    <div className={classes.cartItemImageContainer}>
      <Image src={image} alt="cart-item-image" sizes='80' fill/>
    </div>
  );
}

export default CartItemImage;
