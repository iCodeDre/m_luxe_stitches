"use server";

import { uploadNewProduct } from "@/lib/admin/post-product";
import { uploadImages } from "@/lib/cloundinary";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import xss from "xss";

async function submitPost(images, prevState, formData) {
  console.log("serve");

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
  if (images.length < 1) {
    errors.images = "Provide at least one image.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const slug = slugify(title, { lower: true });
  const description = xss(rawDescription);

  let imageURLS;

  try {
    const urls = await uploadImages(images);
    imageURLS = urls;
  } catch (error) {
    console.log(error.message);
    throw new Error("Image upload failed");
  }

  const newProduct = {
    slug,
    title,
    price,
    description,
    categories,
    imageURLS,
  };

  try {
    await uploadNewProduct(newProduct);
  } catch (error) {
    console.log(error);
    if (error.message === "Product with the title already exist") {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  revalidatePath("/", "layout");
  return { redirect: "/shop" };
}

export default submitPost;
