"use client";

import Image from "next/image";
import Link from "next/link";

import classes from "./auth-header.module.css";

import logoImg from "@/assets/m-luxe-transparen-icont.png";

import Button from "./UI/button";

function AuthHeader() {
  return (
    <>
      <header className={classes.headerSection}>
        <nav>
          <Link href="#">
            <Image
              src={logoImg}
              alt="m-luxe-log"
              width={50}
              height={50}
              priority
            />
          </Link>

          <Link href="/">
            <Button className="auth-button">Continue</Button>
          </Link>
        </nav>
      </header>
    </>
  );
}

export default AuthHeader;
