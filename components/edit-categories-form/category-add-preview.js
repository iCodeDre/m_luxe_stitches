import classes from "./edit-category-form.module.css";
import { use, useState, useActionState } from "react";
import { CategoriesContext } from "@/store/category-context";
import Image from "next/image";

import { submitNewCategory } from "@/actions/admin/submit-new-category";
import FormSubmit from "../post-and-edit-forms/form-submit";
import { toast } from "sonner";

function CategoryAddPreview() {
  const { setCategories } = use(CategoriesContext);
  const [image, setImage] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [errors, setErrors] = useState({ categoryName: "", image: "" });

  const maxTitleLength = 20;

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await submitNewCategory(image, prevState, formData);

        if (!res.errors) {
          setCategories(res.categories);
          setImage(null);
          setCategoryTitle("");
          toast.success("Category added successfully");
          return {};
        }
        setErrors(res.errors);
        return {};
      } catch (error) {
        console.log(error.message);
       if (error.message === "Category exists") {
          toast.error(`${error.message}`);
        }  else {
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
      toast.error("Total image size must be below 20MB.");
      setImage((prev) => prev);
    }

    setImage(file);
  }

  function handleCancelClick() {
    setCategoryTitle("");
    setImage(null);
    setErrors({ categoryName: "", image: "" });
  }

  return (
    <form action={formAction}>
      <h2 className={classes.heading}>Add new category</h2>

      {errors?.image && (
        <p
          className="form-error-message"
          style={{ fontSize: ".6rem", alignSelf: "center" }}
        >
          {errors?.image}
        </p>
      )}
      <article>
        <div className={classes.categoryPreviewImage}>
          {!image && (
            <label htmlFor="add-cat-image" className={classes.imageUploadBox}>
              Add image
            </label>
          )}
          {image && (
            <label
              htmlFor="add-cat-image"
              className={classes.imagePreviewWrapper}
            >
              <Image
                src={URL.createObjectURL(image)}
                alt="image-preview"
                sizes="30vw"
                fill
              />
            </label>
          )}

          <input
            type="file"
            id="add-cat-image"
            name="add-cat-image"
            accept="image/*"
            hidden
            onChange={(e) => {
              setErrors((prev) => {
                const newErrors = prev;
                newErrors.image = "";
                return newErrors;
              });
              handleImageChange(e);
            }}
          />
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
        Cancel
      </button>
      <FormSubmit type="submit">Save</FormSubmit>
    </form>
  );
}

export default CategoryAddPreview;
