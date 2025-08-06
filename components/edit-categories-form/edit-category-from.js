"use client";
import { use, useState } from "react";
import { CategoriesContext } from "@/store/category-context";
import { useActionState } from "react";

import { getSelectedCategoryAction } from "@/actions/admin/getSelectedCategoryAction";
import classes from "./edit-category-form.module.css";
import CategoryInputs from "@/components/edit-categories-form/category-inputs";
import CategoryEditPreview from "./category-edit-preview";
import CategoryAddPreview from "./category-add-preview";

function EditCategoryForm() {
  const { categories: categoryOptions } = use(CategoriesContext);
  const [selectedCategory, setSelectedCategory] = useState("add-new");

  function handleCategorySelect(name) {
    setSelectedCategory(name);
  }
  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      getSelectedCategoryAction(handleCategorySelect, prevState, formData);
    },
    {}
  );

  return (
    <div className={classes.editCategoryContainer}>
      <div>
        <form action={formAction}>
          <h2 className={classes.heading}>Select a category to edit</h2>
          <CategoryInputs
            key={selectedCategory}
            categoryOptions={categoryOptions}
            selectedCategory={selectedCategory}
          />
        </form>
        {selectedCategory !== "add-new" ? (
          <CategoryEditPreview
            selectedCategory={selectedCategory}
            key={selectedCategory}
            handleCategorySelect={handleCategorySelect}
          />
        ) : (
          <CategoryAddPreview key={selectedCategory} />
        )}
      </div>
    </div>
  );
}

export default EditCategoryForm;
