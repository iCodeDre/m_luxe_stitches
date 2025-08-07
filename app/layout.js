import { Toaster } from "sonner";

import "./globals.css";

export const metadata = {
  title: "M.luxe Stitches",
  description: "Browse through our  catalogue of luxurious women's wear.",
  openGraph: {
    title: "M.luxe Stitches",
    description: "Browse through our catalogue of luxurious women's wear.",
    url: "https://m-luxe-stitches.vercel.app/",
    siteName: "M.luxe Stitches",
    images: [
      {
        url: "https://m-luxe-stitches.vercel.app/logo/m-luxe-light-icon.jpg",
        width: 1200,
        height: 630,
        alt: "M.luxe Stitches Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M.luxe Stitches",
    description: "Browse through our catalogue of luxurious women's wear.",
    images: ["https://m-luxe-stitches.vercel.app/logo/m-luxe-light-icon.jpg"],
  },
};

export default async function GeneralLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
