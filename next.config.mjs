/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // or higher like '20mb'
    },
  },
};

export default nextConfig;
