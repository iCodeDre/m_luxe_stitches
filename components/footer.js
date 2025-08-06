import Image from "next/image";
import Link from "next/link";

import classes from "./footer.module.css";

import logoImg from "@/assets/m-luxe-transparen-icont.png";

function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerNewsLetter}>
        <div>
          <h2>Subscribe to our News letter for updates and coupons!</h2>
          <p>Subscribe today to recieve latest updates and coupons.</p>
        </div>
      </div>
      <div className={classes.footerLinks}>
        <ul>
          <li>
            <Link href="#">
              <Image
                src={logoImg}
                alt="m-luxe-log"
                width={50}
                height={50}
                priority
              />
            </Link>
          </li>
          <li>Women&apos;s Wear</li>
          <li>Nigeria</li>
          <li>+2349053895521</li>
          <li>womenswear@gmail.com</li>
          <li>Mon - Fri / 24/7</li>
        </ul>

        <div>
          <ul>
            <li>
              <h1>Information</h1>
            </li>
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">Contact Us</Link>
            </li>
          </ul>

          <ul>
            <li>
              <h1>Our Service</h1>
            </li>
            <li>
              <Link href="#">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#">Terms of Sale</Link>
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <p>© 2025 m.luxe.com - Designed By: iCodeDre.</p>
    </footer>
  );
}

export default Footer;
