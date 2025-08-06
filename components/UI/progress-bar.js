"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./nprogress.css";

let timeout;

export default function ProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
