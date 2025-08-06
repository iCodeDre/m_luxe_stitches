import { getCategories } from "@/lib/featured";
import CategoryCarousel from "./category-carousel";

async function FeaturedCategoriesWrapper() {
  let categories;
  let categoreisError = false;

  try {
    categories = await getCategories();
  } catch (error) {
    console.log(error.message);
    categoreisError = true;
  }
  return (
    <CategoryCarousel
      categories={categories}
      categoreisError={categoreisError}
    />
  );
}

export default FeaturedCategoriesWrapper;
