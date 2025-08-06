import { redirect } from "next/navigation";
import { useActionState, use, useState } from "react";
import { toast } from "sonner";

import { UserContext } from "@/store/user-context";
import { ProductReviewContext } from "@/store/product-review-contex";
import { submitReview } from "@/actions/submit-review-action";

import Rating from "../UI/rating";
import classes from "./review-form.module.css";
import FormSubmit from "../post-and-edit-forms/form-submit";
import nProgress from "nprogress";

function ReviewForm({ productId, productTitle, isReview }) {
  const { user } = use(UserContext);
  const { userId } = user;
  const { setReviews, userRating, setUserRating } = use(ProductReviewContext);
  const [reviewInput, setReviewInput] = useState("");
  const [errors, setErrors] = useState({});

  const data = { userId: userId, productId: productId };

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      if (!userId) {
        nProgress.start();
        return redirect("/auth");
      }

      try {
        const res = await submitReview(data, prevState, formData);
        if (!res.errors) {
          setReviews(res.reviews);
          setUserRating(res.userRating);
          setReviewInput("");

          if (res.success) {
            toast.success("Review submitted succesfully.");
          }
          return {};
        }

        const { review } = res.errors;
        setErrors({ review });
        return res.errors;
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to submit review. Please try again.");
      }
    },
    {}
  );

  function handleReviewInputChange(e) {
    setReviewInput(e.target.value);
  }

  return (
    <div className={classes.reviewFormContainer} key={userRating}>
      <div className={classes.reviewFormHeader}>
        {isReview ? (
          <p>Add your review for &apos;{productTitle}&apos;</p>
        ) : (
          <p>Be the first to review &apos;{productTitle}&apos;</p>
        )}

        <p>
          Your email address will not be published. Required fields are marked *
        </p>
      </div>

      <form action={formAction}>
        <div className={classes.ratingContainer}>
          <label>Your rating *</label>

          <Rating label="input" userRating={userRating} />
        </div>

        <div className={classes.writeReviewContainer}>
          <label>Your review *</label>
          <textarea
            name="review"
            cols={45}
            rows={8}
            value={reviewInput}
            onChange={handleReviewInputChange}
            onFocus={() => setErrors({})}
          />
          {errors?.review && (
            <p className="form-error-message">{errors?.review}</p>
          )}
        </div>

        <FormSubmit type="submit" label>
          Submit
        </FormSubmit>
      </form>
    </div>
  );
}

export default ReviewForm;
