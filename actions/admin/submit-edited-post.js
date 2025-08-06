"use server";

import { updateProduct } from "@/lib/admin/update-product";
import { deleteImages, uploadImages } from "@/lib/cloundinary";
import slugify from "slugify";
import xss from "xss";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";

export default async function submitEditedPost(
  productId,
  newImages,
  existingImages,
  prevState,
  formData
) {
  const rawtitle = formData.get("title");
  const lowerCaseTitle = rawtitle.toLowerCase();
  const title =
    lowerCaseTitle?.charAt(0).toUpperCase() + lowerCaseTitle?.slice(1);
  const price = formData.get("price");
  const rawDescription = formData.get("description");
  const categories = formData.getAll("categories");

  let errors = {};

  if (!title || title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  if (price < 1000) {
    errors.price = "Price must be at least ₦1000.";
  }
  if (!rawDescription || rawDescription.trim().length < 8) {
    errors.description = "Description must be at least 8 characters.";
  }

  if (categories.length < 1) {
    errors.categories = "Select at least one category.";
  }

  if (newImages.length + existingImages.length < 1) {
    errors.images = "Provide at least one image.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  const slug = slugify(title, { lower: true });
  const description = xss(rawDescription);

  let uploadedImages = [];

  if (newImages.length > 0) {
    try {
      uploadedImages = await uploadImages(newImages);
    } catch (err) {
      console.error(err.message);
      throw new Error("Image upload failed");
    }
  }

  const finalImages = [...existingImages, ...uploadedImages];

  const oldImages = await sql`
    SELECT public_id FROM product_images WHERE product_id = ${productId}
  `;

  const oldPublicIds = oldImages.map((img) => img.public_id);
  const keptPublicIds = existingImages.map((img) => img.public_id);
  const removedPublicIds = oldPublicIds.filter(
    (id) => id && !keptPublicIds.includes(id)
  );

  if (removedPublicIds.length > 0) {
    try {
      await deleteImages(removedPublicIds);
    } catch (err) {
      console.error("Failed to delete images from Cloudinary:", err.message);
      throw new Error("Image delete failed");
    }
  }

  const product = {
    id: productId,
    title,
    slug,
    price,
    description,
    categories,
    images: finalImages,
  };

  try {
    await updateProduct(product);
  } catch (error) {
    console.error("per", error);
    if (error.constraint_name) {
      throw new Error("Product with the title already exist");
    } else {
      throw new Error("Product update failed");
    }
  }

  revalidatePath("/", "layout");
  return { redirect: "/shop" };
}
