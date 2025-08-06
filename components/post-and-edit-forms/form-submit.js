"use client";

import { useFormStatus } from "react-dom";
import { motion } from "motion/react";

function FormSubmit({ children, label, ...props }) {
  const { pending } = useFormStatus();
  return (
    <motion.button
      style={pending ? { opacity: 0.5 } : null}
      disabled={pending}
      {...props}
      whileHover={{
        scale: 1.01,
        opacity: 0.8,
      }}
      whileTap={{
        scale: 1,
        opacity: 1,
      }}
    >
      {pending && !label
        ? "Uploading"
        : pending && label
        ? "Submitting"
        : children}
    </motion.button>
  );
}

export default FormSubmit;
