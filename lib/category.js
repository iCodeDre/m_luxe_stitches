import sql from "./db";
import { orderByClause } from "./db-util";

export async function getProductByCategory(sort, offsetValue, categoryName) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
  const sortClause = orderByClause(sort);
  const products = await sql`  
SELECT p.id as product_id,
    p.slug,
    p.title,
    p.price,
    p.created_at,
    p.image_url,
    p.product_category,
    COALESCE(r.avg_rating, 0) as rating
FROM (
        SELECT p.id,
            p.slug,
            p.title,
            p.price,
            p.created_at,
            ARRAY_AGG(DISTINCT p_i.image_url) as image_url,
            ARRAY_AGG(DISTINCT c.name) as product_category
        FROM products as p
            LEFT JOIN product_images as p_i ON p_i.product_id = p.id
            LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
            LEFT JOIN categories as c ON c.id = c_p.category_id
        GROUP BY p.id,
            p.slug,
            p.title,
            p.price,
            p.created_at
    ) as p
    LEFT JOIN (
        SELECT product_id,
            ROUND(AVG(rating), 1) as avg_rating
        FROM ratings
        GROUP BY product_id
    ) as r ON r.product_id = p.id
WHERE ${categoryName} = ANY(p.product_category)
${sortClause}
LIMIT 12 
OFFSET ${offsetValue}
    `;

  const [result] = await sql`
    SELECT COUNT(*) as number_of_products 
    FROM categories_products as c_p
    INNER JOIN categories as c ON c.id = c_p.category_id
    WHERE c.name = ${categoryName}
    `;

  const numberOfProducts = +result.number_of_products;

  return {
    products,
    numberOfProducts,
  };
}
