import EditPostForm from "@/components/post-and-edit-forms/edit-post-form";
import { VerifyAuth } from "@/lib/lucia";
import { getEditProductDetails } from "@/lib/product-details";
import { notFound, redirect } from "next/navigation";

async function Page({ params }) {
  const result = await VerifyAuth();
  const { user } = result;

  if (!user) {
    return redirect("/auth");
  }
  if (user && user.role === "user") {
    return notFound();
  }

  const slug = (await params).productSlug;

  const { productDetails } = await getEditProductDetails(slug);

  return (
    <section>
      <EditPostForm product={productDetails} />
    </section>
  );
}

export default Page;
