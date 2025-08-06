import classes from "./edit-category-form.module.css";
import { use, useState, useActionState } from "react";
import { CategoriesContext } from "@/store/category-context";
import Image from "next/image";
import replaceImage from "@/assets/UI/replace-image.svg";
import { editCategoryAction } from "@/actions/admin/edit-category-action";
import FormSubmit from "../post-and-edit-forms/form-submit";
import { toast } from "sonner";
import placeHolder from "@/public/placeholder/no-image-placeholder.jpg";

function CategoryEditPreview({ selectedCategory, handleCategorySelect }) {
  const { categories: categoryOptions, setCategories } = use(CategoriesContext);
  const [newImage, setNewImage] = useState(null);

  const [categoryTitle, setCategoryTitle] = useState(selectedCategory);

  const [errors, setErrors] = useState({ categoryName: "" });

  const maxTitleLength = 20;

  let catId;

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await editCategoryAction(
          catId,
          newImage,
          prevState,
          formData
        );

        if (!res.errors) {
          setCategories(res.updatedCategories);
          setNewImage(null);
          toast.success("Category edited successfully");
          const activeCategory = res.updatedCategories.find(
            (cat) => cat.id === catId
          );
          handleCategorySelect(activeCategory.name);
          return {};
        }

        setErrors(res.errors);
        return {};
      } catch (error) {
        console.log("drr", error);
        if (error.message === "Category does not exist") {
          toast.error(`${error.message}`);
        } else if (error.message === "Category already exist") {
          toast.error(`${error.message}`);
        } else {
          toast.error("Failed to edit category. Please try again");
        }
      }
    },
    {}
  );

  function handleImageChange(e) {
    const file = Array.from(e.target.files)[0];
    if (!file) return;
    const fileSize = file.size / (1024 * 1024);

    if (fileSize > 20) {
      alert("Total image size must be below 20MB.");
      setNewImage((prev) => prev);
    }

    setNewImage(file);
  }

  function handleCancelClick() {
    setCategoryTitle(selectedCategory);
    setNewImage(null);
    setErrors({ categoryName: "" });
  }

  let content = (
    <form>
      <h2 className={classes.heading}>{"Select a category"}</h2>
    </form>
  );

  if (selectedCategory) {
    const categoryDetails = categoryOptions.find(
      (category) => category.name === selectedCategory
    );

    if (!categoryDetails) return;
    catId = categoryDetails?.id;

    content = (
      <form action={formAction}>
        <h2 className={classes.heading}>{selectedCategory}</h2>

        <article>
          <label
            htmlFor="replace-cat-image"
            className={classes.replaceImageButton}
          >
            <Image src={replaceImage.src} width='50' height='50' alt="replace-image-icon" />
            <input
              type="file"
              id="replace-cat-image"
              name="new-cat-image"
              accept="image/*"
              hidden
              onChange={(e) => handleImageChange(e)}
            />
          </label>

          <div className={classes.categoryPreviewImage}>
            {!newImage ? (
              <Image
                src={categoryDetails.image_url || placeHolder}
                alt="category-image"
                fill
                sizes="30vw"
                placeholder="empty"
              />
            ) : (
              <Image
                src={URL.createObjectURL(newImage)}
                alt="category-image"
                fill
                placeholder="empty"
              />
            )}
          </div>

          <div className={classes.categoryTitleWrapper}>
            <input
              type="text"
              name="category-name"
              value={categoryTitle}
              placeholder="Enter new category name..."
              onChange={(e) => {
                setErrors((prev) => {
                  const newErrors = prev;
                  newErrors.categoryName = "";
                  return newErrors;
                });
                setCategoryTitle(e.target.value);
              }}
            />
            {errors?.categoryName && (
              <p className="form-error-message" style={{ fontSize: ".6rem" }}>
                {errors?.categoryName}
              </p>
            )}
            <p className={classes.characterCount}>
              {maxTitleLength - categoryTitle.length}
            </p>
          </div>
        </article>

        <button type="button" onClick={handleCancelClick}>
          cancel
        </button>
        <FormSubmit type="submit">Save</FormSubmit>
      </form>
    );
  }

  return <>{content}</>;
}

export default CategoryEditPreview;
