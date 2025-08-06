import classes from "./my-order-detail-total.module.css";
function BuyersInfo({ buyerDetails }) {
  console.log(buyerDetails);

  return (
    <div
      className={classes.orderDetailTotals}
      style={{ height: "fit-content", alignSelf: "flex-end" }}
    >
      <div className={classes.buyerInfoContainer}>
        <h2>Email:</h2>
        <p>{buyerDetails.email}</p>
      </div>

      <div className={classes.buyerInfoContainer}>
        <h2>whatsapp no:</h2>
        <p>{buyerDetails.phone_number}</p>
      </div>
    </div>
  );
}

export default BuyersInfo;
