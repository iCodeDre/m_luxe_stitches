import classes from "./article-container.module.css";

function ArticleContainer({ children, label }) {
  let className = `${classes.articleContainer}`;
  if (label) {
    className += ` ${classes.dynamicWidthProductsSection}`;
  } else {
    className += ` ${classes.dynamicWidthHome}`;
  }
  return <div className={className}>{children}</div>;
}

export default ArticleContainer;
