import sql from "../db";

export async function uploadNewProduct(newProduct) {
  //   console.log("db", newProduct);

  const isProduct = await sql`
  SELECT 1 
  FROM products
  WHERE title = ${newProduct.title}
  `;

  const isProductExist = isProduct.length > 0;

  if (isProductExist) {
    throw new Error("Product with the title already exist");
  }

  const result = await sql.begin(async (tx) => {
    const [{ id }] = await tx`
      INSERT INTO products (title, slug, description, price)
      VALUES (${newProduct.title}, ${newProduct.slug}, ${newProduct.description}, ${newProduct.price})
      RETURNING id
      `;

    for (const url of newProduct.imageURLS) {
      await tx`
        INSERT INTO product_images (product_id, image_url, public_id)
        VALUES (${id}, ${url.secure_url}, ${url.public_id})
      `;
    }

    let catIds = [];

    for (const cat of newProduct.categories) {
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
        VALUES (${catId}, ${id})
      `;
    }
  });

  return;
}
