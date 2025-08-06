"use server";
import sql from "./db";

export async function getTopRatedProducts() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = await sql`
  SELECT p.id AS product_id,
      p.slug,
    p.title,
    p.price,
    ARRAY_AGG(DISTINCT c.name) AS product_category,
    ARRAY_AGG(DISTINCT p_i.image_url) AS image_url,
    COALESCE(r.avg_rating, 0) AS rating
FROM products AS p
    LEFT JOIN categories_products AS c_p ON c_p.product_id = p.id
    LEFT JOIN categories AS c ON c.id = c_p.category_id
    LEFT JOIN product_images AS p_i ON p_i.product_id = p.id
    LEFT JOIN (
        SELECT product_id,
            ROUND(AVG(rating), 1) AS avg_rating
        FROM ratings
        GROUP BY product_id
    ) AS r ON r.product_id = p.id
GROUP BY p.id,
    p.slug,
    p.title,
    p.price,
    r.avg_rating
ORDER BY r.avg_rating IS NULL,
    r.avg_rating DESC
LIMIT 12
  `;

  return data;
}

export async function getNewArrivals() {
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = await sql`
SELECT p.id AS product_id,
    p.slug,
    p.created_at,
    p.title,
    p.price,
    ARRAY_AGG(DISTINCT c.name) AS product_category,
    ARRAY_AGG(DISTINCT p_i.image_url) AS image_url,
     COALESCE(r.avg_rating, 0) AS rating
FROM products AS p
    LEFT JOIN categories_products AS c_p ON c_p.product_id = p.id
    LEFT JOIN categories AS c ON c.id = c_p.category_id
    LEFT JOIN product_images AS p_i ON p_i.product_id = p.id
    LEFT JOIN (
        SELECT product_id,
            ROUND(AVG(rating), 1) AS avg_rating
        FROM ratings
        GROUP BY product_id
    ) AS r ON r.product_id = p.id
GROUP BY p.id,
    p.slug,
    p.title,
    p.price,
    p.created_at,
    r.avg_rating
ORDER BY p.created_at DESC
LIMIT 12
  `;

  return data;
}

export async function getBestSelling() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = await sql`
SELECT p.id AS product_id,
    p.slug,
    p.title,
    p.price,
    ARRAY_AGG(DISTINCT c.name) AS product_category,
    ARRAY_AGG(DISTINCT p_i.image_url) AS image_url,
    COALESCE(r.avg_rating, 0) AS rating,
    COALESCE(o.order_count, 0) AS order_amount
FROM products AS p
    LEFT JOIN categories_products AS c_p ON c_p.product_id = p.id
    LEFT JOIN categories AS c ON c.id = c_p.category_id
    LEFT JOIN product_images AS p_i ON p_i.product_id = p.id
    LEFT JOIN (
        SELECT product_id,
            ROUND(AVG(rating), 1) AS avg_rating
        FROM ratings
        GROUP BY product_id
    ) AS r ON r.product_id = p.id
    LEFT JOIN (
        SELECT product_id,
            COUNT(*) AS order_count
        FROM order_items
        GROUP BY product_id
    ) AS o ON o.product_id = p.id
GROUP BY p.id,
    p.slug,
    p.title,
    p.price,
    r.avg_rating,
    o.order_count
ORDER BY order_amount DESC
LIMIT 12
  `;

  return data;
}

export async function getCategories() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const data = await sql`
    SELECT c.id,
    c.name as category_name,
    COALESCE(COUNT(c_p.product_id), 0) as number_of_products,
    c_i.image_url
FROM categories as c
    LEFT JOIN categories_products as c_p ON c.id = c_p.category_id
    LEFT JOIN categories_image as c_i ON c_i.category_id = c.id
GROUP BY c.id,
    c.name,
    c_i.image_url
    
    `;

  return data;
}
