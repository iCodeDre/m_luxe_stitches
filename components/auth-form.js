"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useActionState, useState } from "react";
import { toast } from "sonner";

import { signup, signin } from "@/actions/auth-actions";

import classes from "./auth-form.module.css";
import FormSubmit from "@/components/post-and-edit-forms/form-submit";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const mode = searchParams.get("mode") || "login";

  let authAction = signin;

  if (mode !== "login") {
    authAction = signup;
  }

  const [formState, formAction] = useActionState(
    async (prevState, formData) => {
      try {
        const res = await authAction(prevState, formData);

        if (!res.errors) {
          if (mode === "login") {
            router.replace("/");
            toast.success("login successfull");
          } else {
            router.replace("/");
            toast.success("Account created successfully");
          }
          return {};
        }

        setErrors((prev) => {
          const newErrors = { ...prev, ...res.errors };
          return newErrors;
        });
      } catch (error) {
        if (error.message === "Account already exist, sign in instead") {
          toast.error(`${error.message}`);
          return;
        }
        if (error.message === "Account does not exist, sign up instead") {
          toast.error(`${error.message}`);
          return;
        }
        if (mode === "login") {
          toast.error("Login failed, please try again");
        } else {
          toast.error("Failed to create account, please try again");
        }
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

  function handleClearInputs() {
    setInputs((prev) => {
      const clearedInputs = {};
      Object.keys(prev).forEach((key) => {
        clearedInputs[key] = "";
      });
      return clearedInputs;
    });

    setErrors((prev) => {
      const clearedErrors = {};
      Object.keys(prev).forEach((key) => {
        clearedErrors[key] = "";
      });
      return clearedErrors;
    });
  }

  return (
    <div className={classes.authContainer}>
      <div className={classes.card}>
        <h2 className={classes.title}>
          {mode === "login" ? "Sign In" : "Sign Up"}
        </h2>


        <form className={classes.form} action={formAction}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={classes.input}
            value={inputs.email}
            onChange={(e) => {
              handleInputChange(e, "email");
            }}
            onFocus={() => {
              handleInputFocus("email");
            }}
            required
          />
          {errors.email && <p className="form-error-message">{errors.email}</p>}

          {mode !== "login" && (
            <>
              <input
                type="tel"
                name="phone-number"
                placeholder="Enter phone number"
                className={classes.input}
                value={inputs.phoneNumber}
                onChange={(e) => {
                  handleInputChange(e, "phoneNumber");
                }}
                onFocus={() => {
                  handleInputFocus("phoneNumber");
                }}
                required
              />

              {errors.phoneNumber && (
                <p className="form-error-message">{errors.phoneNumber}</p>
              )}
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className={classes.input}
            value={inputs.password}
            onChange={(e) => {
              handleInputChange(e, "password");
            }}
            onFocus={() => {
              handleInputFocus("password");
            }}
            required
          />
          {errors.password && (
            <p className="form-error-message">{errors.password}</p>
          )}
          {mode !== "login" && (
            <>
              <input
                type="password"
                name="confirm-password"
                placeholder="Confirm password"
                className={classes.input}
                value={inputs.confirmPassword}
                onChange={(e) => {
                  handleInputChange(e, "confirmPassword");
                }}
                onFocus={() => {
                  handleInputFocus("confirmPassword");
                }}
                required
              />

              {errors.confirmPassword && (
                <p className="form-error-message">{errors.confirmPassword}</p>
              )}
            </>
          )}
          {mode === "login" ? (
            <FormSubmit type="submit" label className={classes.submitButton}>
              Sign In
            </FormSubmit>
          ) : (
            <FormSubmit type="submit" label className={classes.submitButton}>
              Sign Up
            </FormSubmit>
          )}
        </form>

        <div className={classes.createAccount}>
          {mode === "login" ? (
            <>
              <span>Don&apos;t have an account? </span>
              <Link
                href="/auth/?mode=register"
                className={classes.createAccountLink}
                onClick={handleClearInputs}
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              <span>Have an account? </span>
              <Link
                href="/auth/?mode=login"
                className={classes.createAccountLink}
                onClick={handleClearInputs}
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
