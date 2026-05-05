import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="section margin-top--large">
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
      <section className="section margin-top--large hero-creative">
        <HeroCreativeHead />
      </section>

      <HeroCreativeRing />
    </div>
  );
}
