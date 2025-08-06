"use client";
import { useState} from "react";

import classes from "./rating.module.css";

function Rating({ label, userRating }) {
  
  const [ratingValue, setRatingValue] = useState(userRating || 0);

  const fullStars = Math.floor(userRating);
  const hasPartial = userRating % 1 !== 0;

  const partialFill = (userRating % 1) * 100;

  let rate = [1, 2, 3, 4, 5];

  if (label === "input") {
    return (
      <div className={classes.ratingContainer}>
        {rate.map((r, index) => (
          <label htmlFor={r} key={r}>
            <svg viewBox="0 0 24 24" className={classes.ratingSvg} key={r}>
              <path
                d="M12 17.27L18.18 21l-1.63-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z"
                fill="#ddd"
                className={
                  index <= ratingValue - 1 ? classes.fillActive : undefined
                }
              />
            </svg>
            <input
              type="radio"
              name="ratings"
              id={r}
              value={+r}
              onChange={() => setRatingValue(+r)}
              checked={ratingValue === r}
            />
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className={classes.ratingContainer}>
      {rate.map((_, index) => {
        const isFull = index < fullStars;
        const isPartial = index === fullStars && hasPartial;

        return (
          <svg viewBox="0 0 24 24" className={classes.ratingSvg} key={index}>
            {isPartial && (
              <defs>
                <linearGradient id={`grad-${index}`}>
                  <stop offset={`${partialFill}%`} stopColor="#FFA500" />
                  <stop offset={`${partialFill}%`} stopColor="#ddd" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 17.27L18.18 21l-1.63-7.03L22 9.24l-7.19-.61L12 2 
        9.19 8.63 2 9.24l5.45 4.73L5.82 21z"
              fill={
                isFull ? "#ff9900" : isPartial ? `url(#grad-${index})` : "#ddd"
              }
            />
          </svg>
        );
      })}
    </div>
  );
}

export default Rating;
