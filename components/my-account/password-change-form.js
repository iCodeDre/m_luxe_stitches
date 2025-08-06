"use client";

import { useActionState, use, useContext, useState } from "react";

import { UserContext } from "@/store/user-context";

import classes from "./account-form.module.css";
import { updatePassword } from "@/actions/edit-acount-details-action";
import { toast } from "sonner";
import FormSubmit from "../post-and-edit-forms/form-submit";

function PasswordChangeForm() {
  const { user } = use(UserContext);
  const userId = user.userId;

  const [inputs, setInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await updatePassword(userId, prevState, formData);
        console.log("res", res);

        if (!res.errors) {
          toast.success("Password updated successfully");
          return;
        }

        setErrors((prev) => {
          const newErrors = { ...prev, ...res.errors };
          return newErrors;
        });
        return;
      } catch (error) {
        console.log(error.message);
        toast.error("Password update failed, please try again");
      }
    },
    {}
  );

  function handleInputChange(e, field) {
    setInputs((prev) => {
      const newInputs = {
        ...prev,
        [field]: e.target.value,
      };

      return newInputs;
    });
  }

  function handleInputFocus(field) {
    setErrors((prev) => {
      const newErrors = { ...prev, [field]: "" };
      return newErrors;
    });
  }

  return (
    <form className={classes.accountForm} action={formAction}>
      <fieldset className={classes.passwordSection}>
        <legend>Password change</legend>

        <div className={classes.field}>
          <label htmlFor="currentPassword">Current password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={inputs.currentPassword}
            onChange={(e) => {
              handleInputChange(e, "currentPassword");
            }}
            onFocus={() => {
              handleInputFocus("currentPassword");
            }}
          />

          {errors.currentPassword && (
            <p className="form-error-message">{errors.currentPassword}</p>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor="newPassword">New password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={inputs.newPassword}
            onChange={(e) => {
              handleInputChange(e, "newPassword");
            }}
            onFocus={() => {
              handleInputFocus("newPassword");
            }}
          />
          {errors.newPassword && (
            <p className="form-error-message">{errors.newPassword}</p>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={inputs.confirmPassword}
            onChange={(e) => {
              handleInputChange(e, "confirmPassword");
            }}
            onFocus={() => {
              handleInputFocus("confirmPassword");
            }}
          />
          {errors.confirmPassword && (
            <p className="form-error-message">{errors.confirmPassword}</p>
          )}
        </div>
      </fieldset>

      <FormSubmit type="submit" label className={classes.saveButton}>
        Save Password
      </FormSubmit>
    </form>
  );
}

export default PasswordChangeForm;
