"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import NoProducts from "@/components/UI/no-items/no-products";
import Button from "@/components/UI/button";
import NProgress from "nprogress";

export default function Error({ error, reset }) {
  useEffect(() => {
    toast.error("Something went wrong. Try reload.");
    NProgress.done();

    return () => {
      NProgress.done();
    };
  }, [error]);

  return (
    <div className="error-boundary">
      <NoProducts>
        {error?.message === "Product does not exist!"
          ? error.message
          : "Something went wrong. Try again."}
      </NoProducts>

      <Button
        onClick={() => {
          NProgress.start();
          reset();
        }}
      >
        Try again
      </Button>
    </div>
  );
}
