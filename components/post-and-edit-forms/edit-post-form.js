"use client";

import { useState, useActionState, use } from "react";
import styles from "./upload-product-form.module.css";
import { CategoriesContext } from "@/store/category-context";

import submitEditedPost from "@/actions/admin/submit-edited-post";
import FormSubmit from "./form-submit";
import { quickAddCategory } from "@/lib/admin/add-category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function EditPostForm({ product }) {
  const router = useRouter();
  const { categories: categoryOptions, setCategories } = use(CategoriesContext);

  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [selectedCategories, setSelectedCategories] = useState(
    product.product_category || []
  );
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product.images || []);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCatError, setNewCatError] = useState(false);

  const [errors, setErrors] = useState({});

  const maxTitleLength = 80;
  const maxImages = 3;

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await submitEditedPost(
          product.product_id,
          images,
          existingImages,
          prevState,
          formData
        );

        if (!res.errors) {
          toast.success("Product edited successfully");
          router.replace(res.redirect);
          return {};
        }

        const errors = res.errors;
        setErrors(errors);
        return {};
      } catch (error) {
        console.log(error);
        if (error.message === "Product with the title already exist") {
          toast.error(`${error.message}`);
        } else {
          toast.error("Failed to edit product. Please try again");
        }
      }
    },
    {}
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(
      0,
      maxImages - images.length - existingImages.length
    );

    const totalSize =
      [...images, ...newFiles].reduce((acc, f) => acc + f.size, 0) /
      (1024 * 1024);
    if (totalSize > 20) {
      toast.error("Total image size must be below 20MB.");
      return;
    }

    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeNewImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const removeExistingImage = (index) =>
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  async function handleCategoryAddClick() {
    if (newCategoryName.length < 3) return setNewCatError(true);
    const name =
      newCategoryName.charAt(0).toUpperCase() +
      newCategoryName.slice(1).toLowerCase();

    try {
      const result = await quickAddCategory(name);
      setCategories(result);
      setNewCategoryName("");
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to add category. Please try again");
    }
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} action={formAction}>
        <h2 className={styles.heading}>Edit Product</h2>
        <input type="hidden" name="productId" value={product.id} />

        <label htmlFor="title">Product Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          maxLength={maxTitleLength}
          onChange={(e) => {
            if (errors.title) {
              setErrors((prev) => {
                const newErrors = prev;
                newErrors.title = "";
                return newErrors;
              });
            }
            setTitle(e.target.value);
          }}
          required
        />
        {errors?.title && <p className="form-error-message">{errors?.title}</p>}
        <div className={styles.characterCount}>
          {maxTitleLength - title.length} characters remaining
        </div>

        <label htmlFor="price">Product Price</label>
        <input
          type="number"
          name="price"
          id="price"
          min={1000}
          value={price}
          onChange={(e) => {
            if (errors.price) {
              setErrors((prev) => {
                const newErrors = prev;
                newErrors.price = null;
                return newErrors;
              });
            }
            setPrice(e.target.value);
          }}
          required
        />
        {errors?.price && <p className="form-error-message">{errors?.price}</p>}

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          rows="6"
          value={description}
          onChange={(e) => {
            if (errors.description) {
              setErrors((prev) => {
                const newErrors = prev;
                newErrors.description = "";
                return newErrors;
              });
            }
            setDescription(e.target.value);
          }}
          className={styles.productTextarea}
          required
        />
        {errors?.description && (
          <p className="form-error-message">{errors?.description}</p>
        )}

        <label>Categories</label>
        <div
          className={styles.categoryOptions}
          key={selectedCategories.join("-")}
        >
          {categoryOptions.map((cat) => {
            const checked = selectedCategories.includes(cat.name);
            const isMax = selectedCategories.length === 3;

            return (
              <div key={cat.name}>
                <input
                  type="checkbox"
                  id={`cat-${cat.name}`}
                  name="categories"
                  value={cat.name}
                  className={styles.categoryOption}
                  checked={checked}
                  onChange={() => {
                    if (errors.categories) {
                      setErrors((prev) => {
                        const newErrors = prev;
                        newErrors.categories = "";
                        return newErrors;
                      });
                    }
                    toggleCategory(cat.name);
                  }}
                  disabled={!checked && isMax}
                />
                <label
                  htmlFor={`cat-${cat.name}`}
                  className={styles.categoryLabel}
                >
                  {cat.name}
                </label>
              </div>
            );
          })}
          {errors?.categories && (
            <p className="form-error-message">{errors?.categories}</p>
          )}
        </div>

        <div className={styles.addCategorySection}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => {
              setNewCatError(false);
              setNewCategoryName(e.target.value);
            }}
            placeholder="Add new category"
          />
          <button type="button" onClick={handleCategoryAddClick}>
            Add
          </button>
        </div>
        {newCatError && (
          <p className="form-error-message">
            Title must be atleast 3 characters!
          </p>
        )}

        <label>Product Images</label>
        {errors?.images && (
          <p className="form-error-message">{errors?.images}</p>
        )}
        <div className={styles.previewImages}>
          {existingImages.map((img, index) => (
            <div
              key={`existing-${index}`}
              className={styles.imagePreviewWrapper}
            >
              <img src={img.image_url} alt="existing-image" />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => removeExistingImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
          {images.map((file, index) => (
            <div key={`new-${index}`} className={styles.imagePreviewWrapper}>
              <img src={URL.createObjectURL(file)} alt="New preview" />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => removeNewImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
          {existingImages.length + images.length < maxImages && (
            <label className={styles.imageUploadBox}>
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (errors.images) {
                    setErrors((prev) => {
                      const newErrors = prev;
                      newErrors.images = "";
                      return newErrors;
                    });
                  }
                  handleImageChange(e);
                }}
              />
              <div>Add Image</div>
            </label>
          )}
        </div>

        <FormSubmit type="submit" className={styles.submitButton}>
          Submit Product
        </FormSubmit>
      </form>
    </div>
  );
}

export default EditPostForm;
