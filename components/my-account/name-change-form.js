"use client";

import { useActionState, use, useState } from "react";
import { updateNames } from "@/actions/edit-acount-details-action";

import { UserContext } from "@/store/user-context";

import classes from "./account-form.module.css";
import { toast } from "sonner";
import FormSubmit from "../post-and-edit-forms/form-submit";

function NameChangeForm() {
  const { user, setUser } = use(UserContext);
  const { userId, displayName, firstName, lastName, phoneNumber, email } = user;

  const [inputs, setInputs] = useState({
    firstName: firstName,
    lastName: lastName,
    displayName: displayName,
    phoneNumber: phoneNumber,
    email: email,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    email: "",
  });

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await updateNames(userId, prevState, formData);

        if (!res.errors) {
          setUser({
            userId: res.user.id,
            firstName: res.user.first_name,
            lastName: res.user.last_name,
            displayName: res.user.display_name,
            email: res.user.email,
            phoneNumber: res.user.phone_number,
            role: res.user.role,
          });
          toast.success("Acount details updated successfully");
          return {};
        }
        setErrors((prev) => {
          const newErrors = { ...prev, ...res.errors };
          return newErrors;
        });
        return {};
      } catch (error) {
        if (error.message === "User with the provided email already exist") {
          toast.error(`${error.message}`);
          return;
        }
        toast.error("Failed to update account details, please try again");
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
      <h2 className={classes.heading}>My account</h2>
      <p className={classes.subheading}>
        Edit your account details or change your password
      </p>

      <div className={classes.row}>
        <div className={classes.field}>
          <label htmlFor="firstName">First name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={inputs.firstName}
            onChange={(e) => {
              handleInputChange(e, "firstName");
            }}
            onFocus={() => {
              handleInputFocus("firstName");
            }}
            required
          />
          {errors.firstName && (
            <p className="form-error-message">{errors.firstName}</p>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor="lastName">Last name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={inputs.lastName}
            onChange={(e) => {
              handleInputChange(e, "lastName");
            }}
            onFocus={() => {
              handleInputFocus("lastName");
            }}
          />
          {errors.lastName && (
            <p className="form-error-message">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className={classes.row}>
        <div className={classes.field}>
          <label htmlFor="displayName">Display name *</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={inputs.displayName}
            onChange={(e) => {
              handleInputChange(e, "displayName");
            }}
            onFocus={() => {
              handleInputFocus("displayName");
            }}
          />
          {errors.displayName && (
            <p className="form-error-message">{errors.displayName}</p>
          )}
          <small className={classes.note}>
            This will be how your name will be displayed in the account section
            and in reviews
          </small>
        </div>

        <div className={classes.field}>
          <label htmlFor="phoneNumber">Phone number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={inputs.phoneNumber}
            onChange={(e) => {
              handleInputChange(e, "phoneNumber");
            }}
            onFocus={() => {
              handleInputFocus("phoneNumber");
            }}
          />
          {errors.phoneNumber && (
            <p className="form-error-message">{errors.phoneNumber}</p>
          )}
          <small className={classes.note}>
            This will be where you will be contacted on whatsapp
          </small>
        </div>
      </div>

      <div className={classes.field}>
        <label htmlFor="email">Email *</label>
        <input
          type="text"
          id="email"
          name="email"
          value={inputs.email}
          onChange={(e) => {
            handleInputChange(e, "email");
          }}
          onFocus={() => {
            handleInputFocus("email");
          }}
        />
        {errors.email && <p className="form-error-message">{errors.email}</p>}
      </div>

      <FormSubmit label type="submit" className={classes.saveButton}>
        Save
      </FormSubmit>
    </form>
  );
}

export default NameChangeForm;
