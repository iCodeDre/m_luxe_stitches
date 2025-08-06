"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import NProgress from "nprogress";
import classes from "./no-products.module.css";

import Button from "../button";
import { toast } from "sonner";

function NoProducts({ children, label, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (label) {
      toast.error("Something went wrong. Try again.");
      if (isLoading) {
        NProgress.done();
        setIsLoading(false);
      }
    }
  }, [isLoading, label]);

  return (
    <div className={classes.NoProducts}>
      <AnimatePresence>
        <motion.p
          {...props}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          exit={{
            opacity: 0,
          }}
        >
          {children}
        </motion.p>
      </AnimatePresence>
      {label && (
        <Button
          onClick={async () => {
            setIsLoading(true);
            NProgress.start();
            router.refresh();
            NProgress.done();
            disabled = { isLoading };
          }}
        >
          {!isLoading ? "Try again" : "loading..."}
        </Button>
      )}
    </div>
  );
}

export default NoProducts;
