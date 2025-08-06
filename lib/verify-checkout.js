"use server";

import sql from "./db";

export async function verifyCheckout(userId, orderId) {
  const deleted = await sql`
    DELETE FROM checkout_completed
    WHERE user_id = ${userId} AND order_id = ${orderId}
    RETURNING *
  `;

  if (deleted.length === 0) {
    return { success: false };
  }

  return { success: true };
}
