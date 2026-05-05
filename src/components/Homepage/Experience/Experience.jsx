import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  HERO_RELLAX_RIGHT,
  HERO_RELLAX_TREE,
  TREE_BLUR_DECOR_AFTER_DESIGN,
  TREE_BLUR_DECOR_FINAL,
} from "./experienceLayersData";
import { MAIN_IMG } from "./mainAssets";
import processStepConnectorSrc from "@/assets/Homepage/work_1.webm";
import rightArrowImg from "@/assets/right_arrow.png";
import { LazySwapImage } from "../hero/LazySwapImage";
import { LinearProcessRow } from "./LinearProcessRow";
import { TreeBlurDecor } from "./TreeBlurDecor";
import { CV_DOWNLOAD_HREF } from "@/constants/cvPublic";

const processSteps = [
  {
    sectionClass: "mobilearts",
    animationOnLeft: false,
    eyebrow: "November 2025 - Present",
    title: (
      <>
        Front-End Developer at <span className="highlight">Mobile Arts</span>
      </>
    ),
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
    animationOnLeft: true,
    eyebrow: "June 2025 - November 2025",
    title: (
      <>
        ERP Full-Stack Developer at <span className="highlight">HoldCo Corp.</span>
      </>
    ),
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
    animationOnLeft: false,
    eyebrow: "April 2024 - August 2024",
    title: (
      <>
        Software Developer Training at <span className="highlight">On-Ramp Academy</span>
      </>
    ),
    body: (
      <>
        Completed advanced training in ReactJS, APIs, databases, cybersecurity, cloud computing, and modern software architecture. Improved skills in building secure web applications, writing better APIs, using Git & GitHub, testing software, and working in Agile teams.{" "}
      </>
    ),
  },
];

/** Last-row PNG arrow: align with `homepage.css` process-step desktop breakpoint. */
const PROCESS_END_ARROW_MIN_WIDTH_PX = 1024;

function useProcessEndArrowVisible() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(
      `(min-width: ${PROCESS_END_ARROW_MIN_WIDTH_PX}px)`,
    ).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${PROCESS_END_ARROW_MIN_WIDTH_PX}px)`,
    );
    const sync = () => setVisible(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return visible;
}

export function Experience() {
  const showProcessEndArrow = useProcessEndArrowVisible();

  return (
    <>
      <section className="section">
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
            <div className="title-container">
              <h3 className="xlg">
                Work
                <br />
                <span className="highlight">Experience</span>
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
              showArrowToNext={index < processSteps.length - 1}
              endArrowSrc={
                index === processSteps.length - 1 && showProcessEndArrow
                  ? rightArrowImg
                  : undefined
              }
              cvDownloadHref={
                index === processSteps.length - 1
                  ? CV_DOWNLOAD_HREF
                  : undefined
              }
              connectorSrc={processStepConnectorSrc}
              {...step}
            />
            {index === 1 && (
              <TreeBlurDecor blocks={TREE_BLUR_DECOR_AFTER_DESIGN} />
            )}
            {index === 2 && <TreeBlurDecor blocks={TREE_BLUR_DECOR_FINAL} />}
          </Fragment>
        ))}
      </div>
    </>
  );
}
