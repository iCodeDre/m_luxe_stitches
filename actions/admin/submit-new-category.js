"use server";

import { addCategory } from "@/lib/admin/add-category";
import { uploadCategoryImage } from "@/lib/cloundinary";
import { revalidatePath } from "next/cache";

export async function submitNewCategory(image, prevState, formData) {
  const categoryName = formData.get("category-name");

  let errors = {};

  if (!categoryName || categoryName.trim().length < 3) {
    errors.categoryName = "Title should be atleast 3 characters.";
  }
  if (!image || !image.size) {
    errors.images = "Category image is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let imageURL;

  try {
    const url = await uploadCategoryImage(image);
    imageURL = url;
  } catch (error) {
    console.log(error.message);
    throw new Error("Image upload failed");
  }

  const categoryTitle =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  let categories;
  try {
    categories = await addCategory(imageURL, categoryTitle);
  } catch (error) {
    console.log(error.message);
    if (error.message === "Category exists") {
      throw new Error("Category exists");
    } else {
      throw new Error("Something went wrong");
    }
  }

  revalidatePath("/", "layout");

  return { categories };
}
