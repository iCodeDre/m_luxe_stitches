"use client";

import { useState, useActionState, use } from "react";
import { motion } from "motion/react";
import styles from "./upload-product-form.module.css";

import { CategoriesContext } from "@/store/category-context";

import submitPost from "@/actions/admin/submit-post";
import FormSubmit from "./form-submit";
import { quickAddCategory } from "@/lib/admin/add-category";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function UploadProductForm() {
  const router = useRouter();
  const { categories: categoryOptions, setCategories } = use(CategoriesContext);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCatError, setNewCatError] = useState(false);

  const [errors, setErrors] = useState({});

  const maxTitleLength = 80;
  const maxImages = 3;

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await submitPost(images, prevState, formData);

        if (!res.errors) {
          toast.success("Product uploaded successfully");
          router.replace(res.redirect);
          return {};
        }

        const errors = res.errors;
        setErrors(errors);
        return {};
      } catch (error) {
        console.log(error.message);

        if (error.message === "Product with the title already exist") {
          toast.error(`${error.message}`);
        } else {
          toast.error("Product upload failed. Please try again");
        }
      }
    },
    {}
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const totalImageSize = files.reduce((acc, file) => acc + file.size, 0);
    const totalImageSizeInMb = totalImageSize / (1024 * 1024);

    if (totalImageSizeInMb > 20) {
      toast.error(`You can only upload images of total file size below 20MB.`);
      return;
    }

    const newFiles = files.slice(0, maxImages - images.length);
    setImages((prev) => {
      const newImages = [...prev, ...newFiles];
      const totalImageSize = newImages.reduce(
        (acc, file) => acc + file.size,
        0
      );
      const totalImageSizeInMb = totalImageSize / (1024 * 1024);

      if (totalImageSizeInMb > 20) {
        toast.error(
          `You can only upload images of total file size below 20MB.`
        );
        return prev;
      }

      return newImages;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
        <h2 className={styles.heading}>Upload New Product</h2>

        <label htmlFor="title">Product Title</label>
        <input
          type="text"
          id="title"
          name="title"
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
          placeholder="Enter product title"
          // required
        />
        {errors?.title && <p className="form-error-message">{errors?.title}</p>}
        <div className={styles.characterCount}>
          {maxTitleLength - title.length} characters remaining
        </div>

        <label htmlFor="price">Product Price</label>
        <input
          type="number"
          id="price"
          name="price"
          placeholder="Enter product price"
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
        <label htmlFor="description" className={styles.formLabel}>
          Product Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Write a clear and engaging description of the product..."
          rows="6"
          value={description}
          className={styles.productTextarea}
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
          required
        />
        {errors?.description && (
          <p className="form-error-message">{errors?.description}</p>
        )}

        <label>Select Categories</label>

        <div
          key={selectedCategories.join("-")}
          className={styles.categoryOptions}
        >
          {categoryOptions.map((cat) => {
            const isChecked = selectedCategories.includes(cat.name);
            const isMaxCat = selectedCategories.length === 3;

            return (
              <div key={cat.name}>
                <input
                  type="checkbox"
                  id={`cat-${cat.name}`}
                  name="categories"
                  value={cat.name}
                  className={styles.categoryOption}
                  checked={isChecked}
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
                  disabled={!isChecked && isMaxCat}
                />
                <motion.label
                  htmlFor={`cat-${cat.name}`}
                  className={styles.categoryLabel}
                  whileHover={{
                    color: "#fff",
                    background: "#7005dc",
                  }}
                >
                  {cat.name}
                </motion.label>
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
            name="add-category"
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
          {images.map((file, index) => (
            <div key={index} className={styles.imagePreviewWrapper}>
              <img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => removeImage(index)}
              >
                &times;
              </button>
            </div>
          ))}
          {images.length < maxImages && (
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

export default UploadProductForm;
