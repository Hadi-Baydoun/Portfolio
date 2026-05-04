import { HeroHeader } from "./hero/HeroHeader";
import { HeroMain } from "./hero/HeroMain";
import { useHomepageInit } from "./hero/useHomepageInit";

/** Pairs with `styles/homepage.css` (imported in `index.css`) and `scripts/homepage.js` via `useHomepageInit`. */
const Hero = () => {
  useHomepageInit();
  return (
    <div className="homepage-hero" id="hero">
      <HeroHeader />
      <HeroMain />
    </div>
  );
};

export default Hero;
