import classes from "./product-header.module.css";

import ImageBox from "./image-box";

import TextBox from "./text-box";

function ProductHeader({ productDetails}) {
  return (
    <section className={classes.productHeader}>
      <ImageBox imageUrl={productDetails.image_url} />
      <TextBox productDetails={productDetails}  />
    </section>
  );
}

export default ProductHeader;
