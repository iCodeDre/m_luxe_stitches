"use server";

import sql from "./db";

import { NotFoundError } from "./errors/custom-errors";

export async function getCartAndWishlist(userId) {
  if (!userId) {
    return {
      cartItems: [],
      cartCount: 0,
      wishlist: [],
      wishlistCount: 0,
    };
  }
  const cartItems = await sql`
SELECT c_i.cart_id,
    c_i.quantity,
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM cart_items as c_i
    LEFT JOIN cart as c ON c.id = c_i.cart_id
    LEFT JOIN products as p ON p.id = c_i.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE c.user_id = ${userId}
GROUP BY c_i.cart_id,
c_i.quantity,
p.id,
p.slug,
p.title,
p.price,
c_i.created_at
ORDER BY c_i.created_at DESC
  `;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const wishlist = await sql`
SELECT 
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM wishlist as w
    LEFT JOIN products as p ON p.id = w.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE w.user_id = ${userId}
GROUP BY
p.id,
p.slug,
p.title,
w.created_at,
p.price
ORDER BY w.created_at DESC
  `;

  const wishlistCount = wishlist.length;

  return {
    cartItems,
    cartCount,
    wishlist,
    wishlistCount,
  };
}

export async function getWishlist(userId, offsetValue) {
  const wishlistItems = await sql`
SELECT 
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM wishlist as w
    LEFT JOIN products as p ON p.id = w.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE w.user_id = ${userId}
GROUP BY
p.id,
p.slug,
p.title,
w.created_at,
p.price
ORDER BY w.created_at DESC
LIMIT 12
OFFSET ${offsetValue}
  `;

  const [result] = await sql`
    SELECT COUNT(*) as number_of_products FROM wishlist
    `;

  const wishlistCount = +result.number_of_products;

  return {
    wishlistItems,
    wishlistCount,
  };
}

export async function addToCart(userId, productId, quantity) {
  const [id] = await sql`
    WITH inserted AS (
    INSERT INTO cart (user_id)
    VALUES (${userId}) ON CONFLICT (user_id) DO NOTHING
    RETURNING id)
    SELECT id as cart_id
    FROM inserted
    UNION
    SELECT id as cart_id
    FROM cart
    WHERE user_id = ${userId}
    LIMIT 1;
    `;

  const cartId = id.cart_id;

  const isProduct = await sql`
    SELECT 1
    FROM products as p
    WHERE p.id = ${productId}
    LIMIT 1
    `;

  const productExists = isProduct.length > 0;

  if (!productExists) throw new NotFoundError("Product does not exist!");

  const result = await sql.begin(async (tx) => {
    const isWishlist = await tx`
  SELECT 1
  FROM wishlist as w
  WHERE w.user_id =${userId} AND w.product_id = ${productId}
  `;

    const wishlistExists = isWishlist.length > 0;

    if (wishlistExists) {
      await tx`
    DELETE FROM wishlist as w
    WHERE w.user_id =${userId} AND w.product_id = ${productId}
    `;
    }

    await tx`
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES (${cartId}, ${productId}, ${quantity}) ON CONFLICT (cart_id, product_id)
DO NOTHING
  `;

    const cartItems = await tx`
SELECT c_i.cart_id,
    c_i.quantity,
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM cart_items as c_i
    LEFT JOIN cart as c ON c.id = c_i.cart_id
    LEFT JOIN products as p ON p.id = c_i.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE c.user_id = ${userId}
GROUP BY c_i.cart_id,
c_i.quantity,
p.id,
p.slug,
p.title,
c_i.created_at,
p.price
ORDER BY c_i.created_at DESC
  `;

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const wishlistItems = await tx`
SELECT 
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM wishlist as w
    LEFT JOIN products as p ON p.id = w.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE w.user_id = ${userId}
GROUP BY
p.id,
p.slug,
p.title,
w.created_at,
p.price
ORDER BY w.created_at DESC
  `;

    const wishlistCount = wishlistItems.length;

    return {
      cartItems,
      cartCount,
      wishlistItems,
      wishlistCount,
    };
  });

  return { ...result };
}

export async function wishlistHandler(userId, productId) {
  const isProduct = await sql`
    SELECT 1
    FROM products as p
    WHERE p.id = ${productId}
    LIMIT 1
    `;

  const productExists = isProduct.length > 0;

  if (!productExists) throw new NotFoundError("Product does not exist!");

  const result = await sql.begin(async (tx) => {
    const isWishlist = await tx`
  SELECT 1
  FROM wishlist as w
  WHERE w.user_id =${userId} AND w.product_id = ${productId}
  `;

    const wishlistExists = isWishlist.length > 0;

    if (wishlistExists) {
      await tx`
    DELETE FROM wishlist as w
    WHERE w.user_id =${userId} AND w.product_id = ${productId}
    `;

      const cartItems = await tx`
SELECT c_i.cart_id,
    c_i.quantity,
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM cart_items as c_i
    LEFT JOIN cart as c ON c.id = c_i.cart_id
    LEFT JOIN products as p ON p.id = c_i.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE c.user_id = ${userId}
GROUP BY c_i.cart_id,
c_i.quantity,
p.id,
p.slug,
p.title,
c_i.created_at,
p.price
ORDER BY c_i.created_at DESC
  `;

      const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

      const wishlistItems = await tx`
SELECT 
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM wishlist as w
    LEFT JOIN products as p ON p.id = w.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE w.user_id = ${userId}
GROUP BY
p.id,
p.slug,
p.title,
w.created_at,
p.price
ORDER BY w.created_at DESC
  `;

      const wishlistCount = wishlistItems.length;

      return {
        cartItems,
        cartCount,
        wishlistItems,
        wishlistCount,
      };
    }

    const isInCart = await tx`
  SELECT c_i.cart_id
  FROM cart_items as c_i
  WHERE c_i.cart_id = (
        SELECT c.id
        FROM cart as c
            LEFT JOIN users as u ON u.id = c.user_id
        WHERE u.id = ${userId}
    ) AND c_i.product_id = ${productId}
  LIMIT 1
  `;

    const cartItemExists = isInCart.length > 0;

    if (cartItemExists) {
      const cartId = isInCart[0].cart_id;
      await tx`
    DELETE FROM cart_items as c_i
    WHERE c_i.cart_id =${cartId} AND c_i.product_id = ${productId}
    `;
    }

    await tx`
    INSERT INTO wishlist (user_id, product_id)
    VALUES (${userId}, ${productId})
    `;

    const cartItems = await tx`
SELECT c_i.cart_id,
    c_i.quantity,
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM cart_items as c_i
    LEFT JOIN cart as c ON c.id = c_i.cart_id
    LEFT JOIN products as p ON p.id = c_i.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE c.user_id = ${userId}
GROUP BY c_i.cart_id,
c_i.quantity,
p.id,
p.slug,
p.title,
c_i.created_at,
p.price
ORDER BY c_i.created_at DESC
  `;

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const wishlistItems = await tx`
SELECT 
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM wishlist as w
    LEFT JOIN products as p ON p.id = w.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE w.user_id = ${userId}
GROUP BY
p.id,
p.slug,
p.title,
w.created_at,
p.price
ORDER BY w.created_at DESC
  `;

    const wishlistCount = wishlistItems.length;

    return {
      cartItems,
      cartCount,
      wishlistItems,
      wishlistCount,
    };
  });

  console.log( result);
  

  return { ...result };
}

export async function isCartedIsWishlisted(userId, productId) {
  const [id] = await sql`
SELECT id as cart_id
FROM cart
WHERE user_id = ${userId}
    `;

  const cartId = id.cart_id;

  let isInCart = false;

  if (!cartId) return isInCart;

  const productInCart = await sql`
  SELECT 1
FROM cart_items as c_i
WHERE c_i.cart_id = ${cartId}
    AND c_i.product_id = ${productId}
  `;

  isInCart = productInCart.length > 0;

  const wishlist = await sql`
  SELECT 1
  FROM wishlist
  WHERE user_id = ${userId} AND product_id = ${productId}
  `;

  const isWishlisted = wishlist.length > 0;
  // console.log('db', isInCart);

  return {
    isInCart,
    isWishlisted,
  };
}

export async function updateQuantityInCart(userId, productId, newQuantity) {
  const [id] = await sql`
    SELECT id as cart_id
    FROM cart as c
    WHERE user_id = ${userId}
    LIMIT 1;
    `;

  const cartId = id.cart_id;

  if (!cartId) throw new NotFoundError("Cart does not exist!");

  const isProduct = await sql`
    SELECT 1
    FROM products as p
    WHERE p.id = ${productId}
    LIMIT 1
    `;

  const productExists = isProduct.length > 0;

  if (!productExists) throw new NotFoundError("Product does not exist!");

  const isProductInCart = await sql`
    SELECT 1
    FROM cart_items as c_i
    WHERE c_i.product_id = ${productId} AND c_i.cart_id = ${cartId}
    LIMIT 1
    `;

  const productExistsInCart = isProductInCart.length > 0;

  if (!productExistsInCart) throw new NotFoundError("Product is not in Cart!");

  await sql`
  UPDATE cart_items
  SET quantity = ${newQuantity}
  WHERE cart_id = ${cartId} AND product_id = ${productId}
  `;

  const updatedCartItems = await sql`
SELECT c_i.cart_id,
    c_i.quantity,
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM cart_items as c_i
    LEFT JOIN cart as c ON c.id = c_i.cart_id
    LEFT JOIN products as p ON p.id = c_i.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE c.user_id = ${userId}
GROUP BY c_i.cart_id,
c_i.quantity,
p.id,
p.slug,
p.title,
c_i.created_at,
p.price
ORDER BY c_i.created_at DESC
  `;

  const updatedCartCount = updatedCartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // console.log(updatedCartItems);

  return {
    updatedCartItems,
    updatedCartCount,
  };
}

export async function updateCartDelete(userId, productId) {
  const [id] = await sql`
    SELECT id as cart_id
    FROM cart as c
    WHERE user_id = ${userId}
    LIMIT 1;
    `;

  const cartId = id.cart_id;

  if (!cartId) throw new NotFoundError("Cart does not exist!");

  const isProductInCart = await sql`
    SELECT 1
    FROM cart_items as c_i
    WHERE c_i.product_id = ${productId} AND c_i.cart_id = ${cartId}
    LIMIT 1
    `;

  const productExistsInCart = isProductInCart.length > 0;

  if (!productExistsInCart) throw new NotFoundError("Product is not in Cart!");

  await sql`
  DELETE FROM cart_items
  WHERE cart_id = ${cartId} AND product_id = ${productId}
  `;

  const updatedCartItems = await sql`
SELECT c_i.cart_id,
    c_i.quantity,
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM cart_items as c_i
    LEFT JOIN cart as c ON c.id = c_i.cart_id
    LEFT JOIN products as p ON p.id = c_i.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE c.user_id = ${userId}
GROUP BY c_i.cart_id,
c_i.quantity,
p.id,
p.slug,
p.title,
c_i.created_at,
p.price
ORDER BY c_i.created_at DESC
  `;

  const updatedCartCount = updatedCartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // console.log("db", updatedCartItems);

  return {
    updatedCartItems,
    updatedCartCount,
  };
}
export async function updateWishlistDelete(userId, productId) {
  const isWishlist = await sql`
    SELECT 1
    FROM wishlist
    WHERE user_id = ${userId} AND product_id = ${productId}
    `;

  const wishlistExists = isWishlist.length > 0;

  if (!wishlistExists)
    throw new NotFoundError("Product is no longer in your wishlist!");

  await sql`
  DELETE FROM wishlist
  WHERE user_id = ${userId} AND product_id = ${productId}
  `;

  const updatedWishlist = await sql`
SELECT 
    p.id as product_id,
    p.slug,
    p.title,
    p.price,
   (ARRAY_AGG(DISTINCT p_i.image_url ORDER BY p_i.image_url))[1] AS image_url
FROM wishlist as w
    LEFT JOIN products as p ON p.id = w.product_id
    LEFT JOIN product_images as p_i ON p_i.product_id = p.id
WHERE w.user_id = ${userId}
GROUP BY
p.id,
p.slug,
p.title,
w.created_at,
p.price
ORDER BY w.created_at DESC
  `;

  const updatedwishlistCount = updatedWishlist.length;

  return {
    updatedWishlist,
    updatedwishlistCount,
  };
}
