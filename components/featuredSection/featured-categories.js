import { Suspense } from "react";
import { VerifyAuth } from "@/lib/lucia";
import classes from "./featured-categories.module.css";
import CategoryHeader from "./category-header";
import EditIcon from "../UI/edit-icon";
import FeaturedCategoriesWrapper from "./features-categories-wrapper";
import LoadingIndicator from "../UI/loading-indicator";

async function FeaturedCategories() {
  const result = await VerifyAuth();
  return (
    <section className={classes.featuredCategoriesSection}>
      <CategoryHeader label="Featured Categories" />

      {result?.user?.role === "admin" && (
        <EditIcon href={`/admin/edit-categories`} />
      )}

      <Suspense
        fallback={
          <div style={{ alignSelf: "center" }}>
            <LoadingIndicator />
          </div>
        }
      >
        <FeaturedCategoriesWrapper />
      </Suspense>
    </section>
  );
}

export default FeaturedCategories;
