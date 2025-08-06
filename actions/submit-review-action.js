"use server";
import { revalidatePath } from "next/cache";
import { addReview } from "@/lib/ratings-reviews";

export async function submitReview({ userId, productId }, prevState, formData) {
  const [rating] = formData.getAll("ratings");
  const ratingValue = +rating || 1;
  const message = formData.get("review");

  let errors = {};

  if (message.trim().length < 3) {
    errors.review = "Reviews must be atleast 3 characters long!";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const { reviews, userRating } = await addReview(
    userId,
    productId,
    message,
    ratingValue
  );

  revalidatePath("/", "layout");

  return { success: true, reviews, userRating };
}
