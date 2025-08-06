import sql from "./db";

export async function addReview(userId, productId, message, ratingValue) {
  console.log("fdb", ratingValue);

  const isProduct = await sql`
    SELECT 1
    FROM products AS p
    WHERE p.id = ${productId}
    LIMIT 1
  `;

  if (isProduct.length === 0) {
    throw new NotFoundError("Product does not exist!");
  }

  const userRating = await sql.begin(async (tx) => {
    await sql`
    INSERT INTO reviews (user_id, product_id, message)
    VALUES (${userId}, ${productId}, ${message})
    `;

    const [ratingRow] = await tx`
      INSERT INTO ratings (user_id, product_id, rating)
      VALUES (${userId}, ${productId}, ${ratingValue})
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET rating = EXCLUDED.rating
      RETURNING rating
    `;
    console.log("db", ratingRow.rating);

    return ratingRow.rating;
  });

  const reviews = await sql`
SELECT r_v.id as review_id,
    r_v.user_id,
    u.display_name,
    r_v.message,
    r.rating,
    r_v.created_at
FROM reviews as r_v
    INNER JOIN (
        SELECT r.rating,
            r.product_id,
            r.user_id
        FROM ratings as r
        WHERE r.product_id = ${productId}
    ) as r ON r.user_id = r_v.user_id
    LEFT JOIN users as u ON u.id = r_v.user_id
WHERE r_v.product_id = ${productId}
ORDER BY r_v.created_at DESC
    `;

  return { reviews, userRating };
}
