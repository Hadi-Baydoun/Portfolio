import { HeroHeader } from "@/components/Homepage/hero/HeroHeader";
import { About } from "@/components/Homepage/about/About";
import { Experience } from "@/components/Homepage/Experience/Experience";
import { useHomepageInit } from "@/components/Homepage/useHomepageInit";
import Skills from "@/components/Homepage/Skills/Skills";
import ContactGrid from "@/components/Homepage/Contact/ContactGrid";
import Projects from "@/components/Homepage/Projects/Projects";


const Homepage = () => {
  useHomepageInit();
  return (
    <div>
      <div className="homepage-hero" id="hero">
        <HeroHeader />
        <main className="main">
          <About />
          <Experience />
          <Projects />
          <Skills />
          <ContactGrid />
        </main>
      </div>
    </div>
  );
};

export default Homepage;
