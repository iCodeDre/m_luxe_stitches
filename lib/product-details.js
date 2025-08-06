import sql from "./db";

export async function getProductDetails(slug, userId) {
  const isProduct = await sql`
  SELECT id
  FROM products
  WHERE slug = ${slug}
  `;

  const isProductExist = isProduct.length > 0;

  if (!isProductExist) throw new Error("Product does not exist!");

  const productId = isProduct[0].id;

  const [productDetails] = await sql`
    SELECT p.id as product_id,
    p.slug,
    p.title,
    p.price,
    p.description,
    ARRAY_AGG(DISTINCT p_i.image_url) as image_url,
    ARRAY_AGG(DISTINCT c.name) as product_category,
    COALESCE(r.avg_rating, 0) as avg_rating
FROM products as p
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
    LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
    LEFT JOIN categories as c ON c.id = c_p.category_id
    LEFT JOIN (
        SELECT r.product_id,
            ROUND(AVG(r.rating), 1) AS avg_rating
        FROM ratings as r
        WHERE r.product_id = ${productId}
        GROUP BY r.product_id
    ) as r ON r.product_id = p.id
WHERE p.id = ${productId}
GROUP BY p.id,
    p.slug,
    p.title,
    p.price,
    p.description,
    r.avg_rating;
    `;

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

  if (!userId) {
    return {
      productDetails,
      reviews,
      rating: null,
      productId,
    };
  }

  const [result] = await sql`
  SELECT rating
  FROM ratings
  WHERE user_id = ${userId} AND product_id = ${productId}
  `;

  const rating = result?.rating;

  return {
    productDetails,
    reviews,
    rating,
    productId,
  };
}

export async function getEditProductDetails(slug) {
  const isProduct = await sql`
  SELECT id
  FROM products
  WHERE slug = ${slug}
  `;

  const isProductExist = isProduct.length > 0;

  if (!isProductExist) throw new Error("Product does not exist!");

  const productId = isProduct[0].id;

  const [productDetails] = await sql`
    SELECT p.id as product_id,
    p.slug,
    p.title,
    p.price,
    p.description,
    json_agg(DISTINCT jsonb_build_object(
    'image_url', p_i.image_url,
    'public_id', p_i.public_id
    )) as images,
    ARRAY_AGG(DISTINCT c.name) as product_category
FROM products as p
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
    LEFT JOIN categories_products as c_p ON c_p.product_id = p.id
    LEFT JOIN categories as c ON c.id = c_p.category_id
WHERE p.id = ${productId}
GROUP BY p.id,
    p.slug,
    p.title,
    p.price,
    p.description
    `;

  return {
    productDetails,
  };
}
