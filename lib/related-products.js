import sql from "./db";

export async function getRelatedProducts(categories, userId) {

  const filter = sql`
        WHERE p.product_category && ${sql.array(categories)}::varchar[]
      `;
  const relatedProducts = await sql`
      SELECT p.product_id,
      p.slug,
      p.title,
      p.price,
      p.created_at,
      p.avg_rating as rating,
      p.image_url,
      p.product_category
  FROM (
          SELECT p.id as product_id,
              p.slug,
              p.title,
              p.price,
              p.created_at,
              COALESCE(r.rating, 0) as avg_rating,
              ARRAY_AGG(DISTINCT p_i.image_url) as image_url,
              ARRAY_AGG(DISTINCT c.name) as product_category
          FROM products as p
              LEFT JOIN product_images as p_i ON p_i.product_id = p.id
              LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
              LEFT JOIN categories as c ON c.id = c_p.category_id
              LEFT JOIN (
                  SELECT r.product_id,
                      ROUND(AVG(r.rating), 1) as rating
                  FROM ratings as r
                  GROUP BY r.product_id
              ) as r ON r.product_id = p.id
          GROUP BY p.id,
              p.slug,
              p.title,
              p.price,
              p.created_at,
              r.rating
      ) as p
  ${filter}
  ORDER BY p.created_at DESC
  LIMIT 10
      `;

  if (!userId) {
    return {
      relatedProducts,
      recentlyViewedProducts: [],
    };
  }

  const recentlyViewedProducts = await sql`
SELECT p.product_id,
    p.slug,
    p.title,
    p.price,
    p.created_at,
    p.avg_rating as rating,
    p.image_url,
    p.product_category
FROM (
        SELECT p.id as product_id,
            p.slug,
            p.title,
            p.price,
            p.created_at,
            COALESCE(r.rating, 0) as avg_rating,
            ARRAY_AGG(DISTINCT p_i.image_url) as image_url,
            ARRAY_AGG(DISTINCT c.name) as product_category
        FROM products as p
            LEFT JOIN product_images as p_i ON p_i.product_id = p.id
            LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
            LEFT JOIN categories as c ON c.id = c_p.category_id
            LEFT JOIN (
                SELECT r.product_id,
                    ROUND(AVG(r.rating), 1) as rating
                FROM ratings as r
                GROUP BY r.product_id
            ) as r ON r.product_id = p.id
        GROUP BY p.id,
            p.slug,
            p.title,
            p.price,
            p.created_at,
            r.rating
    ) as p
    INNER JOIN recently_viewed as r_c ON r_c.product_id = p.product_id
    LEFT JOIN users as u ON u.id = r_c.user_id
    WHERE u.id = ${userId}
    ORDER BY r_c.viewed_at DESC
    OFFSET 1
      `;

  return {
    relatedProducts,
    recentlyViewedProducts,
  };
}

export async function updateRecentlyViewed(userId, productId) {
  if (!userId) {
    return;
  }
  await sql`
    INSERT INTO recently_viewed (user_id, product_id, viewed_at)
VALUES (${userId}, ${productId}, NOW()) 
ON CONFLICT (user_id, product_id) 
DO UPDATE SET viewed_at = NOW()
    `;

  await sql`
    DELETE FROM recently_viewed
WHERE user_id = ${userId}
    AND product_id NOT IN (
        SELECT product_id
        FROM recently_viewed
        WHERE user_id = ${userId}
        ORDER BY viewed_at DESC
        LIMIT 10
    );
    `;

  return;
}
