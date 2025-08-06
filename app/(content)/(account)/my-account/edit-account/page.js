import classes from "./page.module.css";

import NameChangeForm from "@/components/my-account/name-change-form";
import PasswordChangeForm from "@/components/my-account/password-change-form";

async function EditAccountPage() {

  return (
    <div className={classes.formcontainer}>
      <NameChangeForm />
      <PasswordChangeForm />
    </div>
  );
}

export default EditAccountPage;
