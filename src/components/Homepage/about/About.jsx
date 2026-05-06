import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ParticleCanvas } from "@/components/motion-primitives/particle-canvas";
import TextEffect from "@/components/motion-primitives/text-effect";
import CircularText from "@/components/motion-primitives/circular-text";
import RotatingText from "@/components/motion-primitives/rotating-text";
import MarqueeBanner from "@/components/Homepage/Projects/MarqueeBanner";


const creativeSignals = [
  "Modern UI", "Animated", "Fast",
  "Pixel Perfect", "SEO-Friendly", "Performance", "Responsive",
];

const stats = [
  {
    value: "35", suffix: "+", label: "Projects Delivered",
    description: "I successfully completed over 35 projects — continuously improving and growing.",
    pct: 88,
  },
  {
    value: "40", suffix: "%", label: "Performance Improvement",
    description: "Up to 40%+ faster load times through performance optimization.",
    pct: 40,
  },
  {
    value: "2", suffix: "+", label: "Years Experience",
    description: "More than 2 Years of Hands-On Experience in Front-end development.",
    pct: 25,
  },
];

const STAT_ICONS = [
  <path key="0" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M13 10V3L4 14h7v7l9-11h-7z" />,
  <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
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

const INTRO_RING_MIN_PX = 175;
const INTRO_RING_WIDTH_RATIO = 0.48;
const INTRO_RING_SPIN_S = 35;
const INTRO_CIRCULAR_MAX_WIDTH_PX = 640;
/** Off: skip mounting spinning circular text (layout + RAF). CSS `display:none` alone still ran the animation. */
const INTRO_CIRCULAR_RING_ENABLED = false;

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function useIntroCircularRingVisible() {
  const [visible, setVisible] = useState(() => {
    if (!INTRO_CIRCULAR_RING_ENABLED) return false;
    if (typeof window === "undefined") return true;
    return !window.matchMedia(`(max-width: ${INTRO_CIRCULAR_MAX_WIDTH_PX}px)`).matches;
  });

  useEffect(() => {
    if (!INTRO_CIRCULAR_RING_ENABLED) return undefined;
    const mq = window.matchMedia(`(max-width: ${INTRO_CIRCULAR_MAX_WIDTH_PX}px)`);
    const sync = () => setVisible(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return visible;
}

function HeroStatCounter({ value, suffix, staggerDelay, triggerCount }) {
  const wrapRef = useRef(null);
  const numRef = useRef(null);
  const animRef = useRef(0);
  const inView = useInView(wrapRef, { once: true, amount: 0.35 });
  const target = Number.parseFloat(String(value));

  const runCount = useCallback((dur = 1300, delay = 0) => {
    cancelAnimationFrame(animRef.current);
    const start = performance.now() + delay;
    function frame(now) {
      const t = Math.min(Math.max((now - start) / dur, 0), 1);
      if (numRef.current)
        numRef.current.textContent = String(Math.round(easeOutExpo(t) * target));
      if (t < 1) animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
  }, [target]);

  // Initial count-in when card scrolls into view
  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { if (numRef.current) numRef.current.textContent = String(Math.round(target)); return; }
    runCount(1300, staggerDelay * 1000);
  }, [inView]);

  // Re-count on every hover
  useEffect(() => {
    if (triggerCount === 0 || !inView) return;
    runCount(800, 0);
  }, [triggerCount]);

  return (
    <div ref={wrapRef} className="flex items-baseline gap-0.5">
      <span
        ref={numRef}
        className="text-6xl leading-none tracking-tight font-inter"
        style={{ transition: "color .3s ease" }}
      >
        0
      </span>
      <span className="text-[#F15533] text-5xl font-bold leading-none">{suffix}</span>
    </div>
  );
}

function HeroStatCard({ stat, index }) {
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const [triggerCount, setTriggerCount] = useState(0);

  const handleMouseEnter = () => {
    if (reduceMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCardSize({ w: r.width, h: r.height });
    setHovered(true);
    setTriggerCount((c) => c + 1);
  };

  const handleMouseMove = (e) => {
    if (reduceMotion) return;
    const r = cardRef.current.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    setMousePos({ x: mx, y: my });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: 24,
        padding: "1.25rem",
        background: hovered ? "rgba(255,247,240,1)" : "rgba(255,255,255,0.92)",
        border: `2px dashed ${hovered ? "#F15533" : "rgb(212,212,212)"}`,
        boxShadow: hovered
          ? "0 20px 52px rgba(255,100,100,0.14)"
          : "0 2px 12px rgba(0,0,0,0.045)",
        overflow: "hidden",
        cursor: "default",
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "transform .25s ease, border-color .4s ease, background .4s ease, box-shadow .4s ease",
        transform: hovered ? "scale(1.04)" : "scale(1)",
      }}
    >
      {/* Particle constellation */}
      <ParticleCanvas active={hovered} mousePos={mousePos} size={cardSize} />

      {/* Icon badge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px dashed #F15533",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "scale(1) rotate(0deg)"
            : "scale(0.4) rotate(-25deg)",
          transition: "all .45s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{ width: 14, height: 14 }}
          fill="none"
          stroke="#F15533"
        >
          {STAT_ICONS[index]}
        </svg>
      </div>

      {/* Counter */}
      <HeroStatCounter
        value={stat.value}
        suffix={stat.suffix}
        staggerDelay={index * 0.08}
        triggerCount={triggerCount}
      />

      {/* Label */}
      <div
        className="text-md font-inter mt-1.5"
        style={{ fontWeight: 600, color: "#000000" }}
      >
        {stat.label}
      </div>

      {/* Progress bar */}
      {/* <div
        style={{
          height: 3,
          background: "rgba(0,0,0,0.08)",
          borderRadius: 2,
          overflow: "hidden",
          marginTop: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            background: "#F15533",
            width: `${barWidth}%`,
            transition: "width 1.1s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </div> */}
    </div>
  );
}

function HeroStats() {
  return (
    <div id="projects" className="relative z-2">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-col text-start gap-3">
              <HeroStatCard stat={stat} index={index} />
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

function HeroCreativeHead() {
  const reduceMotion = useReducedMotion();

  const [
    dL1Pre,
    dL1Highlight,
    dL1Mid,
    dRotate,
    dL2,
    dL3,
    dL4Pre,
    dL4Highlight,
  ] = useMemo(() => {
    const staggerMs = HERO_HEADLINE_MOTION_VARIANTS.stagger * 1000;
    const lengths = [
      HERO_HEADLINE_L1_PRE.length,
      HERO_HEADLINE_L1_HIGHLIGHT.length,
      HERO_HEADLINE_L1_MID.length,
      HERO_HEADLINE_ROTATING_STAGGER_CHARS,
      HERO_HEADLINE_L2.length,
      HERO_HEADLINE_L3.length,
      HERO_HEADLINE_L4_PRE.length,
      HERO_HEADLINE_L4_HIGHLIGHT.length,
    ];
    let offset = 0;
    return lengths.map((len) => {
      const delay = offset * staggerMs;
      offset += len;
      return delay;
    });
  }, []);

  return (
    <div className="hero-creative__head-stack max-w-4xl mx-auto">
      <div className="title-content hero-creative__copy">
        <h2 className="font-inter">
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L1_PRE}
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL1Pre}
              proximityHover={!reduceMotion}
            />
            <TextEffect
              text={HERO_HEADLINE_L1_HIGHLIGHT}
              segmentClassName="highlight"
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL1Highlight}
              proximityHover={!reduceMotion}
            />
            <TextEffect
              text={HERO_HEADLINE_L1_MID}
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL1Mid}
              proximityHover={!reduceMotion}
            />
            <TextEffect
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dRotate}
              proximityHover={!reduceMotion}
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
                  auto loop
                />
              </span>
            </TextEffect>
          </span>
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L2}
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL2}
              proximityHover={!reduceMotion}
            />
          </span>
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L3}
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL3}
              proximityHover={!reduceMotion}
            />
          </span>
          <span className="hero-headline__line">
            <TextEffect
              text={HERO_HEADLINE_L4_PRE}
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL4Pre}
              proximityHover={!reduceMotion}
            />
            <TextEffect
              text={HERO_HEADLINE_L4_HIGHLIGHT}
              segmentClassName="highlight"
              type="chars" inView inViewOnce
              motionVariants={HERO_HEADLINE_MOTION_VARIANTS}
              delay={dL4Highlight}
              proximityHover={!reduceMotion}
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
    if (!el || typeof ResizeObserver === "undefined" || !showCircularRing) return undefined;

    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width * INTRO_RING_WIDTH_RATIO);
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
            className="hero-creative__intro-circular-text"
          />
        </motion.div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <>
      <div className="container">
        <section id="about" className="section margin-top--large hero-creative">
          <HeroCreativeHead />
        </section>

        <HeroStats />

        <HeroCreativeRing />
      </div>
      {/* <MarqueeBanner /> */}

    </>
  );
}