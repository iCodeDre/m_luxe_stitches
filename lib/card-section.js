import sql from "./db";

export async function getCards() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const cardData = await sql`
SELECT 
    p.id AS product_id,
    p.slug,
    p.title,
    p.description,
    ARRAY_AGG(p_i.image_url) AS image_url
FROM products AS p
    INNER JOIN product_images AS p_i ON p_i.product_id = p.id
GROUP BY p.id,
    p.slug,
    p.title,
    p.description,
    p.created_at
ORDER BY p.created_at DESC
LIMIT 2`;

  return cardData;
}
