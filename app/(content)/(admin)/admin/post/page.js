import UploadProductForm from "@/components/post-and-edit-forms/upload-product-form";
import { VerifyAuth } from "@/lib/lucia";
import { notFound, redirect } from "next/navigation";

async function Page() {
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
      <UploadProductForm />
    </section>
  );
}

export default Page;
