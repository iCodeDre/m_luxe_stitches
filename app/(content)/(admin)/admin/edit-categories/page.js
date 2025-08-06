import EditCategoryForm from "@/components/edit-categories-form/edit-category-from";
import { VerifyAuth } from "@/lib/lucia";
import { notFound, redirect } from "next/navigation";

async function EditCategoryPage() {
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
      <EditCategoryForm />
    </section>
  );
}

export default EditCategoryPage;
