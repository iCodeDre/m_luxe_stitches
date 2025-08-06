import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImages(images) {
  const uploads = images.map(async (image) => {
    const imageData = await image.arrayBuffer();
    const base64Data = Buffer.from(imageData).toString("base64");
    const fileUri = `data:${image.type};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "m-luxe-product-images",
    });

    return { secure_url: result.secure_url, public_id: result.public_id };
  });

  return await Promise.all(uploads);
}
export async function uploadCategoryImage(image) {
  const imageData = await image.arrayBuffer();
  const base64Data = Buffer.from(imageData).toString("base64");
  const fileUri = `data:${image.type};base64,${base64Data}`;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "m-luxe-category-images",
  });

  return { secure_url: result.secure_url, public_id: result.public_id };
}

export async function deleteImages(publicIds) {
  const deletions = publicIds.map((publicId) =>
    cloudinary.uploader.destroy(publicId)
  );
  return await Promise.all(deletions);
}
export async function deleteCategoryImage(publicId) {
  await cloudinary.uploader.destroy(publicId);
}
