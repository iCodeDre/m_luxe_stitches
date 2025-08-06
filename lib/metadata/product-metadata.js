import sql from "../db";

export async function getProductMetadata(slug) {
  const result = await sql`
 SELECT title, description
 FROM products
 WHERE slug = ${slug}
 `;

  if (result.length < 1) throw new Error("Product does not exist!");

  const productMetadata = result[0];
  return { productMetadata };
}

export async function getCategoryMetadata(catSlug) {
  const [categoryMetadata] = await sql`
    SELECT 
    c.name as name,
    COALESCE(COUNT(c_p.product_id), 0) as number_of_products
FROM categories as c
    LEFT JOIN categories_products as c_p ON c.id = c_p.category_id
    LEFT JOIN categories_image as c_i ON c_i.category_id = c.id
    WHERE c.name = ${catSlug}
GROUP BY c.name
    `;
  return categoryMetadata;
}
