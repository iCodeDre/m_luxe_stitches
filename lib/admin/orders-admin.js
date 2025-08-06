"use server";

import { redirect } from "next/navigation";
import sql from "../db";
import { filterByClauseAdmin } from "../db-util";
import { NotFoundError } from "../errors/custom-errors";

export async function getOrdersAdmin(filterValue, offsetValue, searchTerm) {
  const filterClause = filterByClauseAdmin(filterValue, searchTerm);
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

export async function updateApprovalStatus(orderId, productId, approvalUpdate) {
  const isOrder = await sql`
    SELECT 1
    FROM orders AS o
    WHERE o.id = ${orderId}
    LIMIT 1
  `;

  if (isOrder.length === 0) {
    throw new NotFoundError("Order no longer exist!");
  }

  const result = await sql.begin(async (tx) => {
    await tx`
   UPDATE order_items
   SET approval = ${approvalUpdate}
   WHERE order_id = ${orderId} AND product_id = ${productId}
   `;

    const isAwaiting = await tx`
   SELECT 1 
   FROM order_items
   WHERE order_id = ${orderId} AND approval = 'awaiting' 
   `;

    const isAwaitingExist = isAwaiting.length > 0;

    if (isAwaitingExist) {
      return;
    }

    const isApproved = await tx`
   SELECT 1 
   FROM order_items
   WHERE order_id = ${orderId} AND approval = 'approved' 
   `;

    const isApprovedExist = isApproved.length > 0;

    if (isApprovedExist) {
      await tx`
      UPDATE orders
      SET status = 'ongoing'
      WHERE id = ${orderId}
      `;

      return;
    }

    await tx`
    DELETE FROM orders
    WHERE id = ${orderId}
    `;
    return "/admin-account/all-orders";
  });

  return { redirect: result || null };
}

export async function updateAllApprovalStatus(orderId, approvalUpdate) {
  const isOrder = await sql`
    SELECT 1
    FROM orders AS o
    WHERE o.id = ${orderId}
    LIMIT 1
  `;

  if (isOrder.length === 0) {
    throw new NotFoundError("Order no longer exist!");
  }

  await sql.begin(async (tx) => {
    await tx`
    UPDATE order_items
    SET approval = ${approvalUpdate}
    WHERE order_id = ${orderId} AND approval = 'awaiting'
    `;

    const isApproved = await tx`
   SELECT 1 
   FROM order_items
   WHERE order_id = ${orderId} AND approval = 'approved' 
   `;

    const isApprovedExist = isApproved.length > 0;

    if (isApprovedExist) {
      await tx`
      UPDATE orders
      SET status = 'ongoing'
      WHERE id = ${orderId}
      `;

      return;
    }

    await tx`
    DELETE FROM orders
    WHERE id = ${orderId}
    `;
  });
  return;
}

export async function fulfillOrder(orderId) {
  const isOrder = await sql`
    SELECT 1
    FROM orders AS o
    WHERE o.id = ${orderId}
    LIMIT 1
  `;

  if (isOrder.length === 0) {
    throw new NotFoundError("Order no longer exist!");
  }

  await sql`
  UPDATE orders
  SET status = 'fulfilled'
  WHERE id = ${orderId}
  `;

  return;
}
