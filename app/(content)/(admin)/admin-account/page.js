"use client";
import Link from "next/link";
import classes from "./page.module.css";
import { use } from "react";
import { UserContext } from "@/store/user-context";

function MyAccountPage() {
  const { user } = use(UserContext);
  const { email } = user;

  const userEmail = email.split("@")[0];

  return (
    <section className={classes.myAccountPageSection}>
      <header>
        Hello <b>{userEmail}</b> (not <b>{userEmail}</b>?
        <Link href="/auth"> Logout</Link>)
      </header>
      <p>
        From your admin dashboard you can view/edit
        <Link href="/admin-account/all-orders"> all orders</Link> and
        <Link href="/admin-account/edit-account">
          {" "}
          edit your password or account details.
        </Link>
      </p>
    </section>
  );
}

export default MyAccountPage;
