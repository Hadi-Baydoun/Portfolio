import { LazySwapImage } from "@/components/Homepage/hero/LazySwapImage";
import { EXPLORE_HEADER_IMG } from "@/components/Explore/exploreHeaderAssets";
import { memo, useEffect, useMemo, useRef } from "react";

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

function Hero() {
    const bgUrl = EXPLORE_HEADER_IMG.headerBg;
    const titleRef = useRef(null);
    useHangingChars(titleRef);


    return (
        <header className="header portfolio-header" id="hero">
            <div className="animation--fade header-background lazy" data-bg={bgUrl}>
                <div className="animation--fade-in stars">
                    <img
                        src={EXPLORE_HEADER_IMG.stars}
                        alt="the stars spotted from the forest"
                    />
                </div>

                {/* Shooting stars */}
                <div className="stars-container">
                    <div className="shooting-star"></div>
                    <div className="shooting-star"></div>
                    <div className="shooting-star"></div>
                </div>

                {/* Title */}
                <div className="titles">
                    <h1
                        ref={titleRef}
                        className="animation--fade-in title--upper"
                    >
                        <HangingText>explore</HangingText>
                    </h1>
                </div>

                {/* Forest layers */}
                <div className="animation--pop-fade-in nature forest__third-line">
                    <LazySwapImage
                        alt="the front layer of the forest"
                        src={EXPLORE_HEADER_IMG.portfolioFront2}
                    />
                </div>

                <div className="animation--pop-fade-in nature forest__second-line">
                    <LazySwapImage
                        alt=" seconde forest layer"
                        src={EXPLORE_HEADER_IMG.forestSecond2}
                    />
                </div>

                <div className="animation--pop-fade-in nature forest__front-line">
                    <LazySwapImage
                        alt="the first layer of  forest"
                        src={EXPLORE_HEADER_IMG.forestFirst2}
                    />
                </div>
            </div>

            {/* Grass */}
            <div className="container--grass">
                <div className="grass grass--left-back animation--pop-in">
                    <LazySwapImage
                        alt="a close up grass from the  forest"
                        src={EXPLORE_HEADER_IMG.grassLeftBack2}
                    />
                </div>

                <div className="grass grass--left-front animation--pop-in">
                    <LazySwapImage
                        alt="a close up grass from the  forest"
                        src={EXPLORE_HEADER_IMG.grassLeftFront2}
                    />
                </div>

                <div className="grass grass--right-top animation--pop-in">
                    <LazySwapImage
                        alt="a close up grass from the  forest"
                        src={EXPLORE_HEADER_IMG.grassRight2}
                    />
                </div>
            </div>
        </header>
    );
}

export default memo(Hero);
