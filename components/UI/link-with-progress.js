"use client";

import Link from "next/link";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";

export default function LinkWithProgress({ href, children, ...props }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e) => {
    e.preventDefault();
    if (pathname === href) {
   
      NProgress.done();
      return;
    }

    NProgress.start();

    startTransition(() => {
      router.push(href);
    });
  };


  return (
    <Link href='#' onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
