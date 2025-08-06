
import classes from "./card-section.module.css";

import Cards from "./cards";
import { getCards } from "@/lib/card-section";

async function CardWrapper() {
  let cardData;
  let cardError = false;
  try {
    cardData = await getCards();
  } catch (error) {
    console.log(error.message);
    cardError = true;
  }
  return (
    <div className={classes.cardWrapper}>
      <Cards cardData={cardData} cardError={cardError} />
    </div>
  );
}

export default CardWrapper;
