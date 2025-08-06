import { notFound, redirect } from "next/navigation";

import MyAccountSidebar from "@/components/my-account/my-account-sidebar";

import ProductsHeader from "@/components/products-header";
import { VerifyAuth } from "@/lib/lucia";

async function myAccountLayout({ children }) {
  const result = await VerifyAuth();
  const { user } = result;

  if (!user) {
    return redirect("/auth");
  }
  if (user && user.role === "user") {
    return notFound();
  }

  return (
    <section>
      <ProductsHeader />

      <div className="page-content account-page-content">
        <MyAccountSidebar userRole={user.role} />
        {children}
      </div>
    </section>
  );
}

export default myAccountLayout;
