import Image from "next/image";

import classes from "./review-list.module.css";

import { formatTimeAgo } from "@/util/util";

import Rating from "@/components/UI/rating";

import placeHolder from "@/public/placeholder/profile-image-placeholder.jpg";

function ReviewList({ reviews }) {
  return (
    <ul className={classes.reviewList}>
      {reviews?.map((review) => (
        <li key={review.review_id}>
          <div className={classes.userInfo}>
            <div className={classes.imageContainer}>
              <Image src={placeHolder} alt="user-image" sizes="50" fill />
            </div>

            <div className={classes.reviewItem}>
              <div className={classes.userName}>
                <span>
                  <p className={classes.displayName}>{review.display_name} </p>
                  <p className={classes.createdAt}>
                    {formatTimeAgo(review.created_at)}
                  </p>
                </span>
                <div className={classes.starImageContainer}>
                  <Rating userRating={review.rating} />
                </div>
              </div>
              <p className={classes.reviewMessage}>{review.message}</p>
            </div>
          </div>
        </li>
      ))}
      {reviews.length === 0 && (
        <p>There are no reviews for this product yet!</p>
      )}
    </ul>
  );
}

export default ReviewList;
