"use server";

import {
  fulfillOrder,
  updateAllApprovalStatus,
  updateApprovalStatus,
} from "@/lib/admin/orders-admin";
import { revalidatePath } from "next/cache";

export async function orderItemAction(orderId, productId, approvalUpdate) {
  try {
    const res = await updateApprovalStatus(orderId, productId, approvalUpdate);
    revalidatePath("/my-account/my-orders");
    revalidatePath("/admin-account/my-orders");

    return { success: true, redirect: res.redirect };
  } catch (error) {
    console.log(error.message);
    if (error.message === "Order no longer exist!") {
      throw new Error(`${error.message}`);
    }
    throw error;
  }
}
export async function allOrderItemsAction(orderId, approvalUpdate) {
  try {
    await updateAllApprovalStatus(orderId, approvalUpdate);
    revalidatePath("/my-account/my-orders");
    revalidatePath("/admin-account/my-orders");
    return { success: true };
  } catch (error) {
    console.log(error.message);
    if (error.message === "Order no longer exist!") {
      throw new Error(`${error.message}`);
    }
    throw error;
  }
}

export async function markFulfillAction(orderId) {
  try {
    await fulfillOrder(orderId);
    revalidatePath("/my-account/my-orders");
    revalidatePath("/admin-account/my-orders");
    return { success: true };
  } catch (error) {
    console.log(error.message);
    if (error.message === "Order no longer exist!") {
      throw new Error(`${error.message}`);
    }
    throw error;
  }
}
