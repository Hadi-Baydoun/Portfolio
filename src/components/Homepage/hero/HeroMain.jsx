import { Fragment, useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

import {
  HERO_RELLAX_RIGHT,
  HERO_RELLAX_TREE,
  TREE_BLUR_DECOR_AFTER_DESIGN,
  TREE_BLUR_DECOR_FINAL,
} from "./heroLayersData";
import { MAIN_IMG } from "./mainAssets";
import processStepConnectorSrc from "@/assets/Homepage/work_1.webm";
import rightArrowImg from "@/assets/right_arrow.png";
import { LazySwapImage } from "./LazySwapImage";
import { LinearProcessRow } from "./LinearProcessRow";
import { TreeBlurDecor } from "./TreeBlurDecor";
import TextEffect from "@/components/motion-primitives/text-effect";
import CircularText from "@/components/motion-primitives/circular-text";
import RotatingText from "@/components/motion-primitives/rotating-text";
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
        Completed advanced training in ReactJS, APIs, databases, cybersecurity, cloud computing, and modern software architecture. Improved skills in building secure web applications, writing better APIs, using Git & GitHub, testing software, and working in Agile teams. </>
    ),
  },
];

const creativeSignals = [
  "Modern UI",
  "Animated",
  "Fast",
  "Pixel Perfect",
  "SEO-Friendly",
  "Performance",
  "Responsive",
];
const creativeSignalsCircularText = `${creativeSignals.join(" · ")} · `;

const HERO_HEADLINE_CHAR_STAGGER_S = 0.04;
const HERO_HEADLINE_PREFIX = "Websites that feel ";
/** Rotating highlight after the prefix; longest entry drives suffix stagger timing. */
const HERO_HEADLINE_ROTATING = ["alive", "fresh"];
const HERO_HEADLINE_HIGHLIGHT_STAGGER_CHARS = Math.max(
  ...HERO_HEADLINE_ROTATING.map((w) => w.length),
);
const HERO_HEADLINE_SUFFIX = "before users even click.";

/** Ring diameter is a fraction of the intro stack width (sits behind the bordered card). */
const INTRO_RING_MIN_PX = 240;
const INTRO_RING_WIDTH_RATIO = 0.72;
const INTRO_RING_SPIN_S = 35;
const INTRO_WORD_STAGGER_S = 0.075;
const INTRO_WORD_DURATION_S = 0.72;
/** Hide rotating circular text at this viewport width and below (matches intro mobile tweaks). */
const INTRO_CIRCULAR_MAX_WIDTH_PX = 640;

function useIntroCircularRingVisible() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia(
      `(max-width: ${INTRO_CIRCULAR_MAX_WIDTH_PX}px)`,
    ).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${INTRO_CIRCULAR_MAX_WIDTH_PX}px)`,
    );
    const sync = () => setVisible(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return visible;
}

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

const introParts = [
  { text: "Hey there! I'm ", highlight: false },
  { text: "Hadi Baydoun", highlight: true },
  { text: ", a ", highlight: false },
  { text: "Computer Engineer", highlight: true },
  { text: " and ", highlight: false },
  { text: "Front-End Developer", highlight: true },
  {
    text: " focused on building modern, fast, and highly animated web experiences with ReactJS. I create responsive interfaces, smooth interactions, and scalable frontend solutions with strong attention to performance, SEO, and clean development practices.",
    highlight: false,
  },
];
const introTotalWords = introParts.reduce(
  (acc, part) => acc + part.text.split(" ").filter(Boolean).length,
  0,
);
const introTagsDelay = introTotalWords * INTRO_WORD_STAGGER_S + 0.3;




function TiltCard({ children, className, ...props }) {
  return (
    <motion.article className={className} {...props}>
      {children}
    </motion.article>
  );
}

// ─── Word-by-word reveal ──────────────────────────────────────────────────────

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: INTRO_WORD_DURATION_S,
      ease: [0.22, 1, 0.36, 1],
      delay: i * INTRO_WORD_STAGGER_S,
    },
  }),
};

function AnimatedParagraph({ parts }) {
  let wordIndex = 0;
  return (
    <motion.p
      className="hero-creative__intro-text"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {parts.map((part, pi) =>
        part.text.split(" ").map((word, wi, arr) => {
          if (!word) return null;
          const idx = wordIndex++;
          const isLast = pi === parts.length - 1 && wi === arr.length - 1;
          return (
            <span
              key={`${pi}-${wi}`}
              style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
            >
              <motion.span
                display="inline-block"
                style={{ display: "inline-block" }}
                variants={wordVariants}
                custom={idx}
              >
                {part.highlight ? (
                  <motion.strong
                    className="hero-creative__intro-highlight"
                    whileHover={{ scale: 1.06, rotate: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    {word}
                  </motion.strong>
                ) : word}
              </motion.span>
              {!isLast && "\u00A0"}
            </span>
          );
        })
      )}
    </motion.p>
  );
}

// ─── Cursor glow ──────────────────────────────────────────────────────────────

function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });
  const springX = useSpring(0, { stiffness: 120, damping: 20 });
  const springY = useSpring(0, { stiffness: 120, damping: 20 });


  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    springX.set(e.clientX - rect.left);
    springY.set(e.clientY - rect.top);
    setPos(p => ({ ...p, visible: true }));
  };

  return { onMove, onLeave: () => setPos(p => ({ ...p, visible: false })), springX, springY, visible: pos.visible };
}

function HeroCreativeHead() {
  return (
    <div className="hero-creative__head-stack">
      <div className="title-content hero-creative__copy">
        <h2 className="font-bushcraft">
          <span className="hero-headline__line hero-headline__line--intro">
            <TextEffect
              text={HERO_HEADLINE_PREFIX}
              type="chars"
              inView
              inViewOnce
              proximityHover
            />
            <TextEffect
              type="chars"
              inView
              inViewOnce
              delay={
                HERO_HEADLINE_PREFIX.length *
                HERO_HEADLINE_CHAR_STAGGER_S *
                1000
              }
            >
              <span className="hero-headline__rotating-pill">
                <RotatingText
                  texts={HERO_HEADLINE_ROTATING}

                  splitBy="characters"
                  mainClassName="inline-flex flex-wrap items-baseline"
                  rotationInterval={2500}
                  transition={{ type: "spring", damping: 22, stiffness: 400 }}
                  staggerDuration={0.08}
                  staggerFrom="last"
                  auto
                  loop
                />
              </span>
            </TextEffect>
          </span>
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_SUFFIX}
              type="chars"
              inView
              inViewOnce
              proximityHover
              delay={
                (HERO_HEADLINE_PREFIX.length +
                  HERO_HEADLINE_HIGHLIGHT_STAGGER_CHARS) *
                HERO_HEADLINE_CHAR_STAGGER_S *
                1000
              }
            />
          </span>
        </h2>
      </div>
    </div>
  );
}

function HeroCreativeIntro() {
  const stackRef = useRef(null);
  const [ringDiameter, setRingDiameter] = useState(INTRO_RING_MIN_PX);
  const glow = CursorGlow();
  const showCircularRing = useIntroCircularRingVisible();

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    if (!showCircularRing) return undefined;

    const measure = () => {
      const w = Math.round(
        el.getBoundingClientRect().width * INTRO_RING_WIDTH_RATIO,
      );
      setRingDiameter(Math.max(INTRO_RING_MIN_PX, w));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showCircularRing]);

  return (
    <div ref={stackRef} className="hero-creative__intro-stack">
      {showCircularRing ? (
        <motion.div
          className="hero-creative__intro-orbit"
          initial={{ opacity: 0, scale: 0.86, rotate: -6 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <CircularText
            text={creativeSignalsCircularText}
            spinDuration={INTRO_RING_SPIN_S}
            diameter={ringDiameter}
            interactive={false}
            className="hero-creative__intro-circular-text"
          />
        </motion.div>
      ) : null}

      <TiltCard
        className="content align--center hero-creative__intro"
        onMouseMove={glow.onMove}
        onMouseLeave={glow.onLeave}
      >

        <span className="hero-creative__intro-shine" aria-hidden />

        <AnimatedParagraph parts={introParts} />

        {/* animated divider line */}
        <motion.div
          className="hero-creative__intro-divider"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: introTagsDelay }}
          style={{ originX: 0 }}
        />

      </TiltCard>
    </div>
  );
}

export function HeroMain() {
  const showProcessEndArrow = useProcessEndArrowVisible();

  return (
    <main className="main">
      <div className="container">
        <section className="section margin-top--large hero-creative">


          <HeroCreativeHead />


        </section>

        <div className="section margin-top--large">
          <HeroCreativeIntro />
        </div>
      </div>

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
    </main>
  );
}
