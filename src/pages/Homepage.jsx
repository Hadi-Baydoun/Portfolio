import { HeroHeader } from "@/components/Homepage/hero/HeroHeader";
import { About } from "@/components/Homepage/about/About";
import { Experience } from "@/components/Homepage/Experience/Experience";
import { useHomepageInit } from "@/components/Homepage/useHomepageInit";

/** Pairs with `styles/homepage.css` (imported in `index.css`) and `scripts/homepage.js` via `useHomepageInit`. */
const Homepage = () => {
  useHomepageInit();
  return (
    <div>
      <div className="homepage-hero" id="hero">
        <HeroHeader />
        <main className="main">
          <About />
          <Experience />
        </main>
      </div>
    </div>
  );
};

export default Homepage;
