import HeroImage from "./hero-image";
import classes from "./hero-section.module.css";

import HeroTitle from "./hero-title";

function HeroSection() {
  return (
    <section className={classes.heroContainer}>
      <HeroImage />
      <HeroTitle />
    </section>
  );
}

export default HeroSection;
