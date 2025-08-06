import ArticleContainer from "../article-container";
import Article from "../article";
import PageNav from "../UI/page-nav";
import ProductsSubHeader from "../products-sub-header";
import { getProductByCategory } from "@/lib/category";
import NoProducts from "../UI/no-items/no-products";

async function CategoryWrapper({
  sort,
  offsetValue,
  currentPage,
  selectedCategory,
}) {
  const { products, numberOfProducts } = await getProductByCategory(
    sort,
    offsetValue,
    selectedCategory
  );

  return (
    <section className="all-product-section">
      <ProductsSubHeader
        label="Shop"
        totalProducts={numberOfProducts}
        currentPage={currentPage}
      />
      {products.length > 0 ? (
        <ArticleContainer label="productsSection">
          {products.map((product) => (
            <Article key={product.product_id} product={product} />
          ))}
        </ArticleContainer>
      ) : (
        <NoProducts>No products assigned to this category was found</NoProducts>
      )}

      <PageNav
        numberOfProducts={numberOfProducts}
        currentPage={currentPage}
        sort={sort}
      />
    </section>
  );
}

export default CategoryWrapper;
