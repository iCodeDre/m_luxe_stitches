import { getShop } from "@/lib/shop";
import ArticleContainer from "../article-container";
import Article from "../article";
import PageNav from "../UI/page-nav";
import ProductsSubHeader from "../products-sub-header";

async function ShopWrapper({ sort, offsetValue, currentPage }) {
  const { products, numberOfProducts } = await getShop(sort, offsetValue);

  return (
    <section className="all-product-section">
      <ProductsSubHeader
        label="Shop"
        totalProducts={numberOfProducts}
        currentPage={currentPage}
      />

      <ArticleContainer label="productsSection">
        {products?.map((product) => (
          <Article key={product.product_id} product={product} />
        ))}
      </ArticleContainer>

      <PageNav
        numberOfProducts={numberOfProducts}
        currentPage={currentPage}
        sort={sort}
      />
    </section>
  );
}

export default ShopWrapper;
