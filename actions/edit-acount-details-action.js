"use server";

import { hashUserPassword, verifyPassword } from "@/lib/hash";
import {
  getUserPassword,
  updateUserNames,
  updateUserPassword,
} from "@/lib/user";

export async function updateNames(userId, prevState, formData) {
  const firstName = formData.get("firstName")?.trim() || "";
  const lastName = formData.get("lastName")?.trim() || "";
  const displayName = formData.get("displayName")?.trim() || "";
  const phoneNumber = formData.get("phoneNumber")?.trim() || "";
  const email = formData.get("email");

  console.log(email);

  let errors = {};

  if (firstName.length < 3) {
    errors.firstName = "Firstname must be at least 3 characters long.";
  }

  if (lastName.length < 3) {
    errors.lastName = "Lastname must be at least 3 characters long.";
  }

  if (displayName.length < 3) {
    errors.displayName =
      "Your dispaly name must be at least 3 characters long.";
  }

  if (phoneNumber.length < 11) {
    errors.phoneNumber = "Phone numbers must be atleast 11 digits.";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const user = await updateUserNames({
      userId,
      firstName:
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
      lastName:
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase(),
      displayName,
      phoneNumber,
      email,
    });
    return { success: true, user };
  } catch (error) {
    console.log(error.message);
    if (error.constraint_name === "users_email_key") {
      throw new Error("User with the provided email already exist");
    }

    throw error;
  }
}

export async function updatePassword(userId, prevState, formData) {
  const currentPassword = formData.get("currentPassword")?.trim() || "";
  const newPassword = formData.get("newPassword")?.trim() || "";
  const confirmPassword = formData.get("confirmPassword")?.trim() || "";

  let errors = {};

  if (currentPassword.length < 1) {
    errors.currentPassword = "Input required";
    return { errors };
  }

  const storedPassword = await getUserPassword(userId);

  const isValidPassword = verifyPassword(storedPassword, currentPassword);

  if (!isValidPassword) {
    errors.currentPassword = "Invalid current password";

    return { errors };
  }

  if (newPassword.length < 8) {
    errors.newPassword = "New password must be at least 8 characters long.";
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Password must match with new password.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedNewPassword = hashUserPassword(newPassword);

  await updateUserPassword(userId, hashedNewPassword);

  return { success: true };
}
