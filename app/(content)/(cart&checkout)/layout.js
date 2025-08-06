import ProductsHeader from "@/components/products-header";
import { VerifyAuth } from "@/lib/lucia";
import { redirect } from "next/navigation";

async function CartAndCheckoutLayout({ children }) {
  const result = await VerifyAuth();

  if (!result.user) {
    redirect("/auth");
  }
  return (
    <>
      <ProductsHeader />
      {children}
    </>
  );
}

export default CartAndCheckoutLayout;
