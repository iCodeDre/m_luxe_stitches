import sql from "../db";

export async function updateProduct(product) {
  await sql.begin(async (tx) => {
    await tx`
      UPDATE products
      SET title = ${product.title},
          slug = ${product.slug},
          description = ${product.description},
          price = ${product.price},
          updated_at = NOW()
      WHERE id = ${product.id}
    `;

    await tx`DELETE FROM product_images WHERE product_id = ${product.id}`;
    await tx`DELETE FROM categories_products WHERE product_id = ${product.id}`;

    for (const img of product.images) {
      await tx`
        INSERT INTO product_images (product_id, image_url, public_id)
        VALUES (${product.id}, ${img.secure_url || img.image_url}, ${
        img.public_id
      })
      `;
    }

    let catIds = [];

    for (const cat of product.categories) {
      const [{ id }] = await tx`
        SELECT id
        FROM categories 
        WHERE name = ${cat}
      `;

      catIds.push(id);
    }

    for (const catId of catIds) {
      await tx`
        INSERT INTO categories_products (category_id, product_id)
        VALUES (${catId}, ${product.id})
      `;
    }
  });
}
