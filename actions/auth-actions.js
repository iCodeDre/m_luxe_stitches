"use server";

import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createAuthSession, destroySession } from "@/lib/lucia";
import { createUser, getUserByEmail } from "@/lib/user";


export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");
  const phoneNumber = formData.get("phone-number");
  const displayName = email.split("@")[0];

  let errors = {};

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }
  if (password.trim() !== confirmPassword.trim()) {
    errors.confirmPassword = "Passwords must match.";
  }
  if (!phoneNumber || phoneNumber.trim().length < 11) {
    errors.phoneNumber = "Phone numbers must be atleast 11 digits.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const hashedPassword = hashUserPassword(password);

    const userId = await createUser(
      displayName,
      email,
      hashedPassword,
      phoneNumber
    );

    await createAuthSession(userId);
    return { success: true };
  } catch (error) {
    if (error.constraint_name === "users_email_key") {
      throw new Error("Account already exist, sign in instead");
    }

    throw error;
  }
}

export async function signin(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be atleast 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error("Account does not exist, sign up instead");
    }

    const isValidPassword = verifyPassword(existingUser.password, password);

    if (!isValidPassword) {
      return {
        errors: {
          password: "incorrect email or password, try again.",
        },
      };
    }

    await createAuthSession(existingUser.id);
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  await destroySession();
  return { success: true };
}
