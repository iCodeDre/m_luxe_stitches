// lib/actions.js
"use server";

import sql from "./db";

export async function verifyAndClearCheckout(userId, orderId) {
  const deleted = await sql`
    DELETE FROM checkout_completed
    WHERE user_id = ${userId} AND order_id = ${orderId}
    RETURNING *
  `;

  return deleted.length > 0;
}
