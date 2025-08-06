import ProductsHeader from "@/components/products-header";
import Sidebar from "@/components/sidebar";
import { getCategoryLinks } from "@/lib/category-links";

async function ProductsLayout({ children }) {

  return (
    <section>
      <ProductsHeader />
      <div className="page-content">
        <Sidebar/>
        {children}
      </div>
    </section>
  );
}

export default ProductsLayout;
