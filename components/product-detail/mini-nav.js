

import classes from "./mini-nav.module.css";
import EditIcon from "../UI/edit-icon";

import LinkWithProgress from "../UI/link-with-progress";
import { VerifyAuth } from "@/lib/lucia";

async function MiniNav({ productTitle, slug }) {
  const result = await VerifyAuth();
  const { user } = result;

  return (
    <nav className={classes.miniNav}>
      <div>
        <LinkWithProgress href="/">Home /</LinkWithProgress>
        <LinkWithProgress href="/shop">Shop /</LinkWithProgress>
        <p>{productTitle}</p>
      </div>

      {user?.role === "admin" && <EditIcon href={`/admin/edit-post/${slug}`} />}
    </nav>
  );
}

export default MiniNav;
