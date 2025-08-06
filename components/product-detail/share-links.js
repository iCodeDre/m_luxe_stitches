import Link from "next/link";

import classes from './share-links.module.css'

import whatsappIcon from "@/assets/UI/whatsapp-icon.svg";
import instagramIcon from "@/assets/UI/instagram-icon.svg";
import facebookIcon from "@/assets/UI/facebook-icon.svg";
import twitterIcon from "@/assets/UI/x-icon.svg";

function ShareLinks() {
  return (
    <span className={classes.shareLinksContainer}>
      <Link href="#">
        <img src={whatsappIcon.src} alt="whatsapp-icon" />
      </Link>
      <Link href="#">
        <img src={instagramIcon.src} alt="instagram-icon" />
      </Link>
      <Link href="#">
        <img
          src={facebookIcon.src}
          alt="facebook-icon"
          className={classes.facebookImage}
        />
      </Link>
      <Link href="#">
        <img src={twitterIcon.src} alt="twitter-icon" />
      </Link>
    </span>
  );
}

export default ShareLinks;
