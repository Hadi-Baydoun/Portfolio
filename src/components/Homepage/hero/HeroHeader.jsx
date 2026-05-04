import { memo, useEffect, useMemo, useRef, useState } from "react";
import { LazySwapImage } from "./LazySwapImage";
import {
  CLOUD_LAYERS,
  HEADER_TREES,
  LARGE_BIRD_SLOTS,
  SMALL_BIRD_SLOTS,
} from "./heroLayersData";
import { HEADER_IMG } from "./headerAssets";

const TITLE_ROTATE_INTERVAL_MS = 4000;

const TREE_ALT_MSG = "a close up tree of the forest";

const HANG_CHAR_STYLE = {
  display: "inline-block",
  transformOrigin: "center top",
  willChange: "transform",
};


function useHangingChars(ref) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const charEls = container.querySelectorAll(".hang-char");
    const cleanups = [];
    const FALL_GRAVITY = 0.34;
    const FALL_ROTATION_DRIFT = 0.18;
    const FALL_FADE_DISTANCE = 360;
    const FALL_RESET_DISTANCE = 420;

    charEls.forEach((char) => {
      let raf = null;
      let angle = 0;
      let velocity = 0;
      let phase = "idle";
      let fallY = 0;
      let fallVY = 0;

      function spring(target, current, vel, stiffness, damping) {
        const force = (target - current) * stiffness;
        vel = vel * damping + force;
        return [current + vel, vel];
      }

      function tick() {
        if (phase === "hanging") {
          const [a, v] = spring(22, angle, velocity, 0.08, 0.72);
          angle = a;
          velocity = v;
          char.style.transform = `rotate(${angle}deg)`;
          if (Math.abs(angle - 22) < 0.5 && Math.abs(velocity) < 0.3) {
            angle = 22;
            velocity = 0;
            char.style.transform = `rotate(22deg)`;
            raf = null;
            return;
          }
        } else if (phase === "falling") {
          fallVY += FALL_GRAVITY;
          fallY += fallVY;
          angle += velocity * FALL_ROTATION_DRIFT;
          char.style.transform = `rotate(${angle}deg) translate3d(0, ${fallY}px, 0)`;
          char.style.opacity = String(Math.max(0, 1 - fallY / FALL_FADE_DISTANCE));
          if (fallY > FALL_RESET_DISTANCE) {
            phase = "idle";
            angle = 0;
            velocity = 0;
            fallY = 0;
            fallVY = 0;
            char.style.transform = "";
            char.style.opacity = "";
            raf = null;
            return;
          }
        } else if (phase === "returning") {
          const [a, v] = spring(0, angle, velocity, 0.06, 0.75);
          angle = a;
          velocity = v;
          char.style.transform = `rotate(${angle}deg)`;
          if (Math.abs(angle) < 0.3 && Math.abs(velocity) < 0.2) {
            angle = 0;
            velocity = 0;
            char.style.transform = "";
            char.style.opacity = "";
            raf = null;
            return;
          }
        } else {
          raf = null;
          return;
        }
        raf = requestAnimationFrame(tick);
      }

      const onEnter = () => {
        if (phase === "falling") return;
        cancelAnimationFrame(raf);
        phase = "hanging";
        velocity = 3.5;
        fallY = 0;
        fallVY = 0;
        char.style.opacity = "1";
        raf = requestAnimationFrame(tick);
      };

      const onLeave = () => {
        if (phase === "falling") return;
        cancelAnimationFrame(raf);
        if (Math.random() < 0.22) {
          phase = "falling";
          fallVY = -1;
          fallY = 0;
          velocity = (Math.random() - 0.5) * 4;
        } else {
          phase = "returning";
          velocity = velocity * 0.3;
        }
        raf = requestAnimationFrame(tick);
      };

      char.addEventListener("mouseenter", onEnter);
      char.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        char.removeEventListener("mouseenter", onEnter);
        char.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ref]);
}

// ─── HangingText ──────────────────────────────────────────────────────────────

const HangingText = memo(function HangingText({ children }) {
  const text = typeof children === "string" ? children : String(children);

  const nodes = useMemo(
    () =>
      [...text].map((ch, i) =>
        ch === " " ? (
          <span key={i} className="inline-block w-[0.28em]" aria-hidden />
        ) : (
          <span
            key={i}
            className="hang-char inline-block cursor-default select-none"
            style={HANG_CHAR_STYLE}
          >
            {ch}
          </span>
        ),
      ),
    [text],
  );

  return <>{nodes}</>;
});

function HeroHeader() {
  const bgUrl = HEADER_IMG.homeHeaderBg;
  const titleRef = useRef(null);
  const [titlePhase, setTitlePhase] = useState(() =>
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 1
      : 0
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setTitlePhase(1);
      return undefined;
    }
    const id = window.setInterval(() => {
      setTitlePhase((p) => (p === 0 ? 1 : 0));
    }, TITLE_ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useHangingChars(titleRef);

  return (
    <header className="header home-header">
      <div className="animation--fade header-background lazy" data-bg={bgUrl}>
        <div className="animation--fade-in sun">
          <LazySwapImage alt="the sun" src={HEADER_IMG.sun} dataSrc={HEADER_IMG.sun2} />
        </div>
        <div className="animation--pop-fade-in nature mountains">
          <LazySwapImage alt="montains" src={HEADER_IMG.mountains} dataSrc={HEADER_IMG.mountains2} />
        </div>

        {CLOUD_LAYERS.map(({ alt, wrapperClass, dataSrcKey, srcKey }) => (
          <div key={srcKey} className={wrapperClass}>
            <LazySwapImage alt={alt} src={HEADER_IMG[srcKey]} dataSrc={HEADER_IMG[dataSrcKey]} />
          </div>
        ))}

        <div className="animation--pop-fade-in nature forest__fourth-line">
          <LazySwapImage
            alt="the fourth layer of the coding forest"
            src={HEADER_IMG.forestFourth}
            dataSrc={HEADER_IMG.forestFourth2}
          />
        </div>

        {SMALL_BIRD_SLOTS.map(({ container, variant }) => (
          <div key={container} className={`bird-container bird-container--${container}`}>
            <div
              className={`bird bird--${variant} bird--small lazy`}
              data-bg={HEADER_IMG.birdCells}
            />
          </div>
        ))}

        <div className="titles">
          <h1
            ref={titleRef}
            className="animation--fade-in title--upper"
            aria-live="polite"
          >
            <span className="hero-title-visually-hidden">
              {titlePhase === 0 ? "Hadi Baydoun" : "Front-end Developer"}
            </span>
            <div className="hero-title-cycle" aria-hidden="true">
              <div
                className={`hero-title-cycle__panel hero-title-cycle__panel--name ${titlePhase === 0
                  ? "hero-title-cycle__panel--active"
                  : "hero-title-cycle__panel--inactive"
                  }`}
              >
                <HangingText>Hadi Baydoun</HangingText>
              </div>
              <div
                className={`hero-title-cycle__panel ${titlePhase === 1
                  ? "hero-title-cycle__panel--active"
                  : "hero-title-cycle__panel--inactive"
                  }`}
              >
                <HangingText>Front-end</HangingText>
                <br />
                <span>
                  <HangingText>Developer</HangingText>
                </span>
              </div>
            </div>
          </h1>
        </div>

        <div className="animation--pop-fade-in nature forest__third-line">
          <LazySwapImage
            alt="the third layer of the coding forest"
            src={HEADER_IMG.forestThird}
            dataSrc={HEADER_IMG.forestThird2}
          />
        </div>
        <div className="animation--pop-fade-in nature forest__second-line">
          <LazySwapImage
            alt="the seconde layer of the coding forest"
            src={HEADER_IMG.forestSecond}
            dataSrc={HEADER_IMG.forestSecond2}
          />
        </div>

        {LARGE_BIRD_SLOTS.map(({ container, variant }) => (
          <div
            key={container}
            className={`bird-container bird-container--${container} bird--large`}
          >
            <div
              className={`bird bird--${variant} bird--large lazy`}
              data-bg={HEADER_IMG.birdCells}
            />
          </div>
        ))}

        <div className="animation--pop-fade-in nature forest__front-line">
          <LazySwapImage
            alt="first layer of the coding forest"
            src={HEADER_IMG.forestFirst}
            dataSrc={HEADER_IMG.forestFirst2}
          />
        </div>
      </div>

      <div className="container--tree">
        {HEADER_TREES.map((tree, idx) => (
          <div key={tree.treeClass ?? idx} className={tree.treeClass}>
            {tree.useLazySwap ? (
              <LazySwapImage
                alt={TREE_ALT_MSG}
                src={HEADER_IMG[tree.srcKey]}
                dataSrc={HEADER_IMG[tree.dataSrcKey]}
              />
            ) : (
              <img src={HEADER_IMG[tree.blurKey]} alt={TREE_ALT_MSG} />
            )}
          </div>
        ))}
      </div>
    </header>
  );
}

const MemoHeroHeader = memo(HeroHeader);
export { MemoHeroHeader as HeroHeader };
