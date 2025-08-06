import { redirect } from "next/navigation";

import MyAccountSidebar from "@/components/my-account/my-account-sidebar";

import ProductsHeader from "@/components/products-header";
import { VerifyAuth } from "@/lib/lucia";

async function myAccountLayout({ children }) {
  const result = await VerifyAuth();
  const { user } = result;

  if (!user) {
    return redirect("/auth");
  }

  return (
    <section>
      <ProductsHeader />

      <div className="page-content account-page-content">
        <MyAccountSidebar displayName={user.displayName} />
        {children}
      </div>
    </section>
  );
}

export default myAccountLayout;
