"use server";

import { updateCategory } from "@/lib/admin/add-category";
import { deleteCategoryImage, uploadCategoryImage } from "@/lib/cloundinary";
import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function editCategoryAction(catId, newImage, prevState, formData) {
  const categoryName = formData.get("category-name");

  let errors = {};

  if (!categoryName || categoryName.trim().length < 3) {
    errors.categoryName = "Title should be atleast 3 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let uploadedImage;

  if (newImage) {
    try {
      uploadedImage = await uploadCategoryImage(newImage);
    } catch (err) {
      console.error(err.message);
      throw new Error("Image upload failed");
    }
  }

  const result =
    await sql`SELECT image_url, public_id FROM categories_image WHERE category_id = ${catId}`;

  const existingImage = result[0];

  if (result.length > 0 && uploadedImage) {
    try {
      await deleteCategoryImage(existingImage.public_id);
    } catch (error) {
      console.log(error.message);
      throw new Error("Image delete failed");
    }
  }

  const newCatName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  let updatedCategories;

  try {
    updatedCategories = await updateCategory(
      catId,
      uploadedImage || existingImage,
      newCatName
    );
  } catch (error) {
    console.log("server", error);
    if (error.message === "Category does not exist") {
      throw new Error(" Category does not exist");
    } else if (error.constraint_name) {
      throw new Error("Category already exist");
    } else {
      throw new Error("Error updating category");
    }
  }

  revalidatePath("/", "layout");

  return { updatedCategories };
}
