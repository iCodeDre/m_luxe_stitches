import { Toaster } from "sonner";

import "./globals.css";

export const metadata = {
  title: "M.luxe Stitches",
  description: "Browse through our  catalogue of luxurious women's wear.",
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
