import { Fragment, useRef } from "react";
import { motion } from "framer-motion";

import {
  HERO_RELLAX_RIGHT,
  HERO_RELLAX_TREE,
  TREE_BLUR_DECOR_AFTER_DESIGN,
  TREE_BLUR_DECOR_FINAL,
} from "./experienceLayersData";
import { MAIN_IMG } from "./mainAssets";
import { LazySwapImage } from "../hero/LazySwapImage";
import { LinearProcessRow } from "./LinearProcessRow";
import { TreeBlurDecor } from "./TreeBlurDecor";
import { useTypewriter } from "@/components/motion-primitives/useTypewriter";

const EXPERIENCE_TITLE_TYPEWRITER_TEXT = "Experience";

const processSteps = [
  {
    sectionClass: "mobilearts",
    eyebrow: "November 2025 - Present",
    titlePrefix: "Front-End Developer at ",
    titleHighlight: "Mobile Arts",
    body: (
      <>
        Building scalable, high-performance ReactJS websites with smooth
        animations and responsive interfaces. Focused on frontend security,
        REST API integrations, AWS Lambda workflows, and improving SEO
        performance for high-traffic platforms.
      </>
    ),
  },
  {
    sectionClass: "holdoco",
    eyebrow: "June 2025 - November 2025",
    titlePrefix: "ERP Full-Stack Developer at ",
    titleHighlight: "HoldCo Corp.",
    body: (
      <>
        Customized ERPNext modules using Python and Frappe while building
        responsive frontend components with ReactJS. Worked closely with teams
        to deliver tailored ERP solutions, business logic, reports, and API
        integrations for real business needs.
      </>
    ),
  },
  {
    sectionClass: "training",
    eyebrow: "April 2024 - August 2024",
    titlePrefix: "Software Developer Training at ",
    titleHighlight: "On-Ramp Academy",
    body: (
      <>
        Completed advanced training in ReactJS, APIs, databases, cybersecurity, cloud computing, and modern software architecture. Improved skills in building secure web applications, writing better APIs, using Git & GitHub, testing software, and working in Agile teams.{" "}
      </>
    ),
  },
];

export function Experience() {
  const experienceTitleTriggerRef = useRef(null);
  const { typedText, showCursor } = useTypewriter(
    EXPERIENCE_TITLE_TYPEWRITER_TEXT,
    {
      triggerRef: experienceTitleTriggerRef,
      charDelay: 100,
      threshold: 0.35,
    },
  );

  return (
    <>
      <section id="experience" className="section">
        <motion.div
          className="hero-visual hero-visual--creative"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="images images--left"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <LazySwapImage
              className="lazy"
              src={MAIN_IMG.heroHouse}
              dataSrc={MAIN_IMG.heroHouse}
              alt="The place where all the coding and the designing happens"
            />
            <div className="image-animation-container">
              <div className="hero-logo-lottie"></div>
            </div>
            <div
              className={HERO_RELLAX_TREE.wrapperClass}
              {...HERO_RELLAX_TREE.attrs}
            >
              <img
                className={HERO_RELLAX_TREE.imgClass}
                src={MAIN_IMG.treeBlurLeft}
                alt={HERO_RELLAX_TREE.alt}
              />
            </div>
          </motion.div>
          <motion.div
            className="images images--right hero-visual__panel"
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <div className="title-container" ref={experienceTitleTriggerRef}>
              <h3 className="xlg text-[#1a2e22]">
                Work
                <br />
                <span className="highlight" aria-label={EXPERIENCE_TITLE_TYPEWRITER_TEXT}>
                  {typedText}
                  {showCursor ? (
                    <span className="ml-0.5 inline-block font-light opacity-80" aria-hidden>
                      |
                    </span>
                  ) : null}
                </span>
              </h3>
            </div>
            <div
              className={HERO_RELLAX_RIGHT.wrapperClass}
              {...HERO_RELLAX_RIGHT.attrs}
            >
              <img
                className={HERO_RELLAX_RIGHT.imgClass}
                src={MAIN_IMG.treeBlurRight}
                alt={HERO_RELLAX_RIGHT.alt}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="hero-process-steps">
        {processSteps.map((step, index) => (
          <Fragment key={step.sectionClass}>
            <LinearProcessRow
              {...step}
              animationOnLeft={index % 2 === 1}
              stepIndex={index + 1}
            />
            {step.sectionClass === "holdoco" && (
              <TreeBlurDecor blocks={TREE_BLUR_DECOR_AFTER_DESIGN} />
            )}
            {step.sectionClass === "training" && (
              <TreeBlurDecor blocks={TREE_BLUR_DECOR_FINAL} />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
}
