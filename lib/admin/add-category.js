"use server";
import { revalidatePath } from "next/cache";
import sql from "../db";

export async function addCategory(image, newCategory) {
  const result = await sql.begin(async (tx) => {
    const isCategory = await tx`
        SELECT 1
        FROM categories
        WHERE name = ${newCategory}
        `;

    const isCategoryExist = isCategory.length > 0;

    if (isCategoryExist) throw new Error("Category exists");

    const [{ id }] = await tx`
    INSERT INTO categories (name)
    VALUES(${newCategory})
    RETURNING id
    `;

    await tx`
    INSERT INTO categories_image (category_id, image_url, public_id)
    VALUES(${id}, ${image.secure_url}, ${image.public_id})
    `;

    const categories = await tx`
    SELECT c.id, 
    c.name, 
    c_i.image_url
    FROM categories as c
    LEFT JOIN categories_image as c_i
    ON c.id = c_i.category_id
    `;

    return categories;
  });

  return result;
}
export async function updateCategory(catId, image, newCatName) {
  
  const result = await sql.begin(async (tx) => {
    const isCategory = await tx`
        SELECT 1
        FROM categories
        WHERE id = ${catId}
        `;

    const isCategoryExist = isCategory.length > 0;

    if (!isCategoryExist) throw new Error("Category does not exist");

    await tx`DELETE FROM categories_image WHERE category_id = ${catId}`;

    await tx`UPDATE categories
    SET name = ${newCatName}
    WHERE id = ${catId}
    `;

    await tx`
    INSERT INTO categories_image (category_id, image_url, public_id)
    VALUES(${catId}, ${image.secure_url || image.image_url}, ${image.public_id})
    `;

    const categories = await tx`
    SELECT c.id, 
    c.name, 
    c_i.image_url
    FROM categories as c
    LEFT JOIN categories_image as c_i
    ON c.id = c_i.category_id
    `;

    return categories;
  });

  return result;
}

export async function quickAddCategory(newCategory) {
  const result = await sql.begin(async (tx) => {
    const isCategory = await tx`
        SELECT 1
        FROM categories
        WHERE name = ${newCategory}
        `;

    const isCategoryExist = isCategory.length > 0;

    if (isCategoryExist) throw new Error("Category Exists!");

    await tx`
    INSERT INTO categories (name)
    VALUES(${newCategory})
    `;

    const categories = await tx`
    SELECT c.id, 
    c.name, 
    c_i.image_url
    FROM categories as c
    LEFT JOIN categories_image as c_i
    ON c.id = c_i.category_id
    `;

    return categories;
  });

  revalidatePath("/", "layout");
  return result;
}

export async function removeCategory(catId) {
  const result = await sql.begin(async (tx) => {
    const isCategory = await tx`
        SELECT 1
        FROM categories
        WHERE id = ${catId}
        `;

    const isCategoryExist = isCategory.length < 1;

    if (isCategoryExist) throw new Error("Category does not exists!");

    await tx`
    DELETE FROM categories 
    WHERE id = ${catId}
    `;

    const categories = await tx`
    SELECT c.id, 
    c.name, 
    c_i.image_url
    FROM categories as c
    LEFT JOIN categories_image as c_i
    ON c.id = c_i.category_id
    `;

    return categories;
  });

  revalidatePath("/", "layout");
  return result;
}
