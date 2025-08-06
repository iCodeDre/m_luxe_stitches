import sql from "./db";

export async function getCategoryLinks() {
  const links = await sql`
    SELECT c.id,
    c.name, 
    c_i.image_url
    FROM categories as c
    LEFT JOIN categories_image as c_i
    ON c.id = c_i.category_id


    `;

  return links;
}
