import ArticleContainer from "../article-container";
import Article from "../article";
import PageNav from "../UI/page-nav";
import ProductsSubHeader from "../products-sub-header";
import { getSuggestedItems } from "@/lib/search";
import NoProducts from "../UI/no-items/no-products";

async function SearchWrapper({
  sort,
  offsetValue,
  currentPage,
  selectedCategory,
  searchTerm,
}) {
  const { data: results, numberOfProducts } = await getSuggestedItems(
    searchTerm,
    selectedCategory,
    sort,
    offsetValue
  );
  return (
    <section className="all-product-section">
      <ProductsSubHeader
        label={`Search results: '${searchTerm}'`}
        totalProducts={numberOfProducts}
        currentPage={currentPage}
      />
      {results.length > 0 ? (
        <ArticleContainer label="categories section">
          {results?.map((product) => (
            <Article key={product.product_id} product={product} />
          ))}
        </ArticleContainer>
      ) : (
        <NoProducts>
          Nothhing was found for the search term <b>&apos;{searchTerm}&apos;</b>.
        </NoProducts>
      )}

      <PageNav
        numberOfProducts={numberOfProducts}
        currentPage={currentPage}
        sort={sort}
      />
    </section>
  );
}

export default SearchWrapper;
