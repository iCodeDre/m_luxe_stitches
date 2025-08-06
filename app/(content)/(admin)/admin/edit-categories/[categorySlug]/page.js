import { VerifyAuth } from "@/lib/lucia";
import { notFound, redirect } from "next/navigation";
import React from "react";

async function page({ params }) {
  const result = await VerifyAuth();
  const { user } = result;

  if (!user) {
    return redirect("/auth");
  }
  if (user && user.role === "user") {
    return notFound();
  }

  const selectedCategory = (await params).categorySlug;
  return <div>{selectedCategory}</div>;
}

export default page;
