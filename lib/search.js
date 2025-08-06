import sql from "./db";
import { orderByClause } from "./db-util";

export async function getSuggestedItems(
  searchTerm,
  categoryTerm,
  sort,
  offsetValue
) {
  const SEARCH_OPTIONS = {
    byCategory: sql`
    WHERE p.title ILIKE ${"%" + searchTerm + "%"}
    AND EXISTS (
        SELECT 1
        FROM unnest(p.product_category) AS cat
        WHERE cat ILIKE ${"%" + categoryTerm + "%"}
    )`,
    all: sql`WHERE p.title ILIKE ${"%" + searchTerm + "%"}`,
  };

  let filterClause;
  let countFilterClause;

  if (categoryTerm !== "all") {
    filterClause = SEARCH_OPTIONS["byCategory"];
    countFilterClause = SEARCH_OPTIONS["byCategory"];
  } else {
    filterClause = SEARCH_OPTIONS["all"];
    countFilterClause = SEARCH_OPTIONS["all"];
  }

  if (sort) {
    console.log("sort");

    const sortClause = orderByClause(sort);
    const others = sql`
    ${sortClause}
    LIMIT 12 
    OFFSET ${offsetValue}
    `;

    filterClause = sql`${filterClause} ${others}`;
  }

  const data = await sql`
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
${filterClause}
`;

  const [result] = await sql`
    SELECT COUNT(*) as number_of_products 
    FROM (
        SELECT p.id,
               p.title,
            ARRAY_AGG(DISTINCT c.name) as product_category
        FROM products as p
            LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
            LEFT JOIN categories as c ON c.id = c_p.category_id
        GROUP BY p.id,
            p.title
    ) as p
    ${countFilterClause}
    `;
  const numberOfProducts = +result.number_of_products;
  console.log(result);

  return {
    data,
    numberOfProducts,
  };
}
