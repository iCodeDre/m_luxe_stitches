import sql from "./db";

import { orderByClause } from "./db-util";

export async function getShop(sort, offsetValue) {
  const sortClause = orderByClause(sort);
  const products = await sql`
    SELECT p.id as product_id,
    p.slug,
    p.title,
    p.price,
    ARRAY_AGG(DISTINCT p_i.image_url) as image_url,
    ARRAY_AGG(DISTINCT c.name) as product_category,
    COALESCE(r.avg_rating, 0) as rating
FROM products as p
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
    LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
     LEFT JOIN categories as c ON c.id = c_p.category_id
    LEFT JOIN (
        SELECT product_id,
            ROUND(AVG(rating), 1) as avg_rating
        FROM ratings
        GROUP BY product_id
    ) as r ON r.product_id = p.id
GROUP BY p.id,
    p.slug,
    p.title,
    p.price,
    r.avg_rating
${sortClause}
LIMIT 12
OFFSET ${offsetValue}
    `;

  const [result] = await sql`
    SELECT COUNT(*) as number_of_products FROM products
    `;

  const numberOfProducts = +result.number_of_products;

  return {
    products,
    numberOfProducts,
  };
}

