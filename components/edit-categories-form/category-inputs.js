import { use } from "react";
import classes from "./edit-category-form.module.css";
import { CategoriesContext } from "@/store/category-context";
import { removeCategory } from "@/lib/admin/add-category";
import { motion } from "motion/react";

function CategoryInputs({ categoryOptions, selectedCategory }) {
  const { setCategories } = use(CategoriesContext);
  function handleCategorySelect(e) {
    e.target.form.requestSubmit();
  }

  const isAddChecked = selectedCategory === "add-new";

  async function handleCategoryRemoveClick(catId) {
    try {
      const result = await removeCategory(catId);
      setCategories(result);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div key={selectedCategory} className={classes.categoryOptions}>
        {categoryOptions.map((cat) => {
          const isChecked = selectedCategory === cat.name;

          return (
            <div key={cat.name}>
              <input
                type="radio"
                id={`cat-${cat.name}`}
                name="categories"
                value={cat.name}
                className={classes.categoryOption}
                checked={isChecked}
                onChange={(e) => handleCategorySelect(e)}
              />
              <motion.label
                htmlFor={`cat-${cat.name}`}
                className={classes.categoryLabel}
                whileHover={{
                  color: "#fff",
                  background: "#7005dc",
                }}
              >
                {cat.name}
              </motion.label>
              <motion.button
                type="button"
                className={classes.removeImageButton}
                onClick={() => handleCategoryRemoveClick(cat.id)}
                whileHover={{
                  scale: 1.2,
                }}
              >
                &times;
              </motion.button>
            </div>
          );
        })}

        <div>
          <input
            type="radio"
            id="cat-add-new"
            name="categories"
            value="add-new"
            className={classes.categoryOption}
            checked={isAddChecked}
            onChange={(e) => handleCategorySelect(e)}
          />
          <motion.label
            htmlFor="cat-add-new"
            className={classes.categoryLabel}
            whileHover={{
             opacity: 0.8
            }}
          >
            Add new
          </motion.label>
        </div>
      </div>
    </>
  );
}

export default CategoryInputs;
