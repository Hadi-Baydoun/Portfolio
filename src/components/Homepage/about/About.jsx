import { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import icon_wrapper from "@/assets/icon_wrapper.svg";
import TextEffect from "@/components/motion-primitives/text-effect";
import CircularText from "@/components/motion-primitives/circular-text";
import RotatingText from "@/components/motion-primitives/rotating-text";

const creativeSignals = [
  "Modern UI",
  "Animated",
  "Fast",
  "Pixel Perfect",
  "SEO-Friendly",
  "Performance",
  "Responsive",
];

const stats = [
  {
    value: "35",
    suffix: "+",
    label: "Projects Delivered",
    description:
      "I successfully completed over 35 projects — continuously improving and growing.",
  },
  {
    value: "40",
    suffix: "%",
    label: "Performance Improvement",
    description:
      "Up to 40%+ faster load times through performance optimization.",
  },
  {
    value: "2",
    suffix: "+",
    label: "Years Experience",
    description:
      "More than 2 Years of Hands-On Experience in Front-end development.",
  },
];


const creativeSignalsCircularText = `${creativeSignals.join(" · ")} · `;

const HERO_HEADLINE_L1_PRE = "Building ";
const HERO_HEADLINE_L1_HIGHLIGHT = "websites";
const HERO_HEADLINE_L1_MID = " that feel ";
const HERO_HEADLINE_ROTATING = ["fresh", "alive"];
const HERO_HEADLINE_ROTATING_STAGGER_CHARS = Math.max(
  ...HERO_HEADLINE_ROTATING.map((w) => w.length),
);
const HERO_HEADLINE_L2 = "creating fast, high-performance React";
const HERO_HEADLINE_L3 = "experiences with smooth interactions";
const HERO_HEADLINE_L4_PRE = "and scalable, ";
const HERO_HEADLINE_L4_HIGHLIGHT = "clean code.";

const HERO_HEADLINE_MOTION_VARIANTS = {
  stagger: 0.025,
  transition: { duration: 0.75 },
  initial: { y: 20, rotateX: 0, scale: 0.98 },
};

/** Framer tweens interpolate these more evenly than chained CSS transitions. */
const HERO_STAT_CARD_VARIANTS = {
  rest: {
    y: 0,
    borderColor: "rgba(212, 212, 212, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.045)",
  },
  hover: {
    y: -5,
    borderColor: "rgba(241, 85, 51, 0.42)",
    backgroundColor: "rgba(255, 247, 240, 1)",
    boxShadow: "0 20px 52px rgba(255, 100, 100, 0.14)",
  },
};

const HERO_STAT_CARD_TRANSITION = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1],
};

/** Ring diameter is a fraction of the intro stack width. */
const INTRO_RING_MIN_PX = 240;
const INTRO_RING_WIDTH_RATIO = 0.72;
const INTRO_RING_SPIN_S = 35;
/** Hide rotating circular text at this viewport width and below. */
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

function HeroCreativeHead() {
  let charOffset = 0;
  const staggerMs = HERO_HEADLINE_MOTION_VARIANTS.stagger * 1000;
  const nextDelay = (len) => {
    const delay = charOffset * staggerMs;
    charOffset += len;
    return delay;
  };

  return (
    <div className="hero-creative__head-stack max-w-4xl mx-auto">
      <div className="title-content hero-creative__copy">
        <h2 className="font-inter">
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L1_PRE}
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L1_PRE.length)}
            />
            <TextEffect
              text={HERO_HEADLINE_L1_HIGHLIGHT}
              segmentClassName="highlight"
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L1_HIGHLIGHT.length)}
            />
            <TextEffect
              text={HERO_HEADLINE_L1_MID}
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L1_MID.length)}
            />
            <TextEffect
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_ROTATING_STAGGER_CHARS)}
            >
              <span className="hero-headline__rotating-pill">
                <RotatingText
                  texts={HERO_HEADLINE_ROTATING}
                  splitBy="characters"
                  mainClassName="inline-flex flex-wrap items-baseline"
                  elementLevelClassName="highlight"
                  rotationInterval={3500}
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
              text={HERO_HEADLINE_L2}
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L2.length)}
            />
          </span>
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L3}
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L3.length)}
            />
          </span>
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L4_PRE}
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L4_PRE.length)}
            />
            <TextEffect
              text={HERO_HEADLINE_L4_HIGHLIGHT}
              segmentClassName="highlight"
              type="chars"
              inView
              inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={nextDelay(HERO_HEADLINE_L4_HIGHLIGHT.length)}
            />
          </span>
        </h2>
      </div>
    </div>
  );
}

/** Counts `value` when this block enters the viewport (once per page load). */
function HeroStatCounter({ value, suffix, staggerDelay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const target = Number.parseFloat(String(value));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return undefined;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(Math.round(target));
      return undefined;
    }

    setDisplay(0);
    const controls = animate(0, target, {
      duration: 1.65,
      delay: staggerDelay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, staggerDelay, target]);

  return (
    <div
      ref={ref}
      className="text-6xl leading-none tracking-tight text-[#000000] font-inter"
    >
      {display}
      <span className="text-[#F15533]">{suffix}</span>
    </div>
  );
}

function HeroStatCard({ children }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="rounded-3xl border-2 border-dashed p-5 transform-gpu"
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? undefined : "hover"}
      variants={HERO_STAT_CARD_VARIANTS}
      transition={HERO_STAT_CARD_TRANSITION}
    >
      {children}
    </motion.div>
  );
}

function HeroStats() {
  return (
    <div id="projects" className="relative z-2">
      {/* Above intro-orbit (negative top pulls the ring over this row — z-index restores hover targets). */}
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-col text-start gap-3">
              <HeroStatCard>
                <HeroStatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  staggerDelay={index * 0.08}
                />
                <div
                  className="text-md text-[#000000] mt-1.5 font-inter"
                  style={{ fontWeight: "600" }}
                >
                  {stat.label}
                </div>
              </HeroStatCard>
              <div className="text-sm text-[#000000] font-medium leading-relaxed px-2 font-inter">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroCreativeRing() {
  const stackRef = useRef(null);
  const [ringDiameter, setRingDiameter] = useState(INTRO_RING_MIN_PX);
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

  if (!showCircularRing) return null;

  return (
    <div className="section margin-top--large relative z-0">
      <div ref={stackRef} className="hero-creative__intro-stack">
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
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="container">
      <section id="about" className="section margin-top--large hero-creative">
        {/* <div className="bg-[#F3F5F8] rounded-full py-1 flex items-center gap-3 w-fit justify-center mx-auto pr-4 pl-1 mb-8">
          <img src={icon_wrapper} alt="icon_wrapper" className="w-8 h-8" />
          <span className="text-[#0F0F0F] font-inter font-medium text-sm whitespace-nowrap">
            About Me
          </span>
        </div> */}
        <HeroCreativeHead />
      </section>

      <HeroStats />

      <HeroCreativeRing />
    </div>
  );
}
