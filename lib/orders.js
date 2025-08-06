"use server";

import { revalidatePath } from "next/cache";
import sql from "./db";
import { filterByClause } from "./db-util";
import { NotFoundError } from "./errors/custom-errors";
import { redirect } from "next/navigation";

export async function getOrders(userId, filterValue, offsetValue, searchTerm) {
  const filterClause = filterByClause(userId, filterValue, searchTerm);
  const orders = await sql`
    SELECT o.id as order_id,
        q.items_quantity,
        q.total_order_amount,
        o.status as order_status,
        o.created_at as order_date,
        ARRAY_AGG(DISTINCT p.title) as titles
    FROM orders as o
        INNER JOIN order_items as o_i ON o_i.order_id = o.id
        LEFT JOIN (
            SELECT order_id,
                SUM(quantity) as items_quantity,
                SUM(item_total_price) as total_order_amount
            FROM order_items
            WHERE order_items.approval = 'approved' OR order_items.approval = 'awaiting'
            GROUP BY order_id
        ) as q ON q.order_id = o.id
        LEFT JOIN products as p ON p.id = o_i.product_id
    ${filterClause}
    GROUP BY o.id,
        q.items_quantity,
        q.total_order_amount,
        o.status,
        o.created_at
ORDER BY o.created_at DESC
LIMIT 12
OFFSET ${offsetValue}
    `;

  const [result] = await sql`
   SELECT COUNT(*) as number_of_products
      FROM(
        SELECT o.id
        FROM order_items as o_i
            INNER JOIN orders as o ON o.id = o_i.order_id
            INNER JOIN products as p ON p.id = o_i.product_id
        ${filterClause}
        GROUP BY o.id
    ) as c;

    `;

  const numberOfOrders = +result.number_of_products;

  return { orders, numberOfOrders };
}

export async function getOrderDetails(orderId) {
  const isOrder = await sql`
    SELECT 1
    FROM orders AS o
    WHERE o.id = ${orderId}
    LIMIT 1
  `;

  if (isOrder.length === 0) {
    throw new NotFoundError("Order no longer exist!");
  }

  const orderItems = await sql`
    SELECT o_i.order_id,
    p.id as product_id,
    p.slug,
    p.title,
    o_i.quantity,
    o_i.item_price,
    o_i.item_total_price,
    o_i.approval as approval_status,
    (
        ARRAY_AGG(
            DISTINCT p_i.image_url
            ORDER BY p_i.image_url
        )
    ) [1] AS image_url
FROM order_items as o_i
    INNER JOIN products as p ON p.id = o_i.product_id
    INNER JOIN product_images as p_i ON p_i.product_id = o_i.product_id
WHERE o_i.order_id = ${orderId}
GROUP BY o_i.order_id,
    p.id,
    p.slug,
    p.title,
    o_i.quantity,
    o_i.item_price,
    o_i.item_total_price,
    o_i.approval
ORDER BY o_i.approval ASC
    `;

  const [{ status }] = await sql`
    SELECT status
    FROM orders
    WHERE id = ${orderId}
    `;

  const totalPrice = orderItems.reduce((acc, item) => {
    const itemTotalPrice =
      item.approval_status !== "denied" ? +item.item_total_price : 0;
    return acc + itemTotalPrice || 0;
  }, 0);

  const totalOrders = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const [buyerDetails] = await sql`
  SELECT u.id,
  u.email,
  u.phone_number
  FROM users as u
  INNER JOIN orders as o ON o.user_id = u.id
  WHERE o.id = ${orderId}
  `;

  return {
    orderItems,
    totalPrice,
    totalOrders,
    orderStatus: status,
    buyerDetails,
  };
}

export async function deleteOrder(orderId) {
  const isOrder = await sql`
    SELECT 1
    FROM orders
    WHERE id = ${orderId}
    `;

  const orderExist = isOrder.length > 0;

  if (!orderExist) throw new NotFoundError("Order does not exist!");

  await sql`
    DELETE FROM orders
    WHERE id = ${orderId}
    `;

  revalidatePath("/admin-account");
  revalidatePath("/my-account/");

  return { success: true };
}
