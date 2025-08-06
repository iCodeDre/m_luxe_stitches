"use client";
import { createContext, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ children, userDetails }) {
  const [user, setUser] = useState({
    userId: userDetails?.userId || "",
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    displayName: userDetails?.displayName || "",
    email: userDetails?.email || "",
    phoneNumber: userDetails?.phoneNumber || "",
    role: userDetails?.role || "",
  });

  const value = {
    user,
    setUser,
  };

  return <UserContext value={value}>{children}</UserContext>;
}
