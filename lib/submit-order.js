"use server";

import sql from "./db";

export async function submitOrder(userId, orderItems) {
  const orderId = await sql.begin(async (tx) => {
    const [{ id: orderId }] = await tx`
        INSERT INTO orders (user_id)
        VALUES(${userId})
        RETURNING id
        `;

    for (const item of orderItems) {
      await tx`
          INSERT INTO order_items (order_id, product_id, quantity, item_price)
          VALUES (
          ${orderId}, 
          ${item.product_id}, 
          ${item.quantity}, 
          ${item.price}
          )
          `;

      await tx`
          DELETE FROM cart_items
          WHERE cart_id = ${item.cart_id} AND product_id = ${item.product_id}
      `;
    }

    await tx`
    INSERT INTO checkout_completed (user_id, order_id)
    VALUES(${userId}, ${orderId})
    `;

    return orderId;
  });

  return { success: true, orderId };
}
