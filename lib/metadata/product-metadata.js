import sql from "../db";

export async function getProductMetadata(slug) {
  const result = await sql`
 SELECT p.title, 
 p.description,
 ARRAY_AGG(DISTINCT p_i.image_url) as image_url
 FROM products as p
 INNER JOIN product_images as p_i ON p_i.product_id = p.id
 WHERE slug = ${slug}
 GROUP BY p.title, 
 p.description
 `;

 

  if (result.length < 1) throw new Error("Product does not exist!");

  const productMetadata = result[0];
  return { productMetadata };
}

export async function getCategoryMetadata(catSlug) {
  const [categoryMetadata] = await sql`
    SELECT 
    c.name as name,
    c_i.image_url,
    COALESCE(COUNT(c_p.product_id), 0) as number_of_products
FROM categories as c
    LEFT JOIN categories_products as c_p ON c.id = c_p.category_id
    LEFT JOIN categories_image as c_i ON c_i.category_id = c.id
    WHERE c.name = ${catSlug}
GROUP BY c.name,
  c_i.image_url
    `;

     console.log("meta cat", categoryMetadata);
  return categoryMetadata;
}
