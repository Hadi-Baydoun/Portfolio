import { LazySwapImage } from "@/components/Homepage/hero/LazySwapImage";
import { CONTACT_HEADER_IMG } from "@/components/Contact/exploreHeaderAssets";
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
    const bgUrl = CONTACT_HEADER_IMG.headerBg;
    const titleRef = useRef(null);
    useHangingChars(titleRef);


    return (
        <header className="header contact-header" id="hero">
            <div className="animation--fade header-background lazy" data-bg={bgUrl}>
                <div className="animation--fade-in sun">
                    <LazySwapImage
                        alt="the clouds of forest"
                        src={CONTACT_HEADER_IMG.clouds}
                        dataSrc={CONTACT_HEADER_IMG.clouds}
                    />
                </div>

                <div className="animation--pop-fade-in nature mountains">
                    <img
                        src={CONTACT_HEADER_IMG.mountains}
                        alt=" front forest seconde"
                    />
                </div>

                <div className="animation--pop-fade-in nature forest__fourth-line">
                    <LazySwapImage
                        alt="the fourth layer of  forest"
                        src={CONTACT_HEADER_IMG.forthForest}
                        dataSrc={CONTACT_HEADER_IMG.forthForest}
                    />
                </div>

                <div className="animation--pop-fade-in nature forest__fourth-line">
                    <LazySwapImage
                        alt="the third layer of forest"
                        src={CONTACT_HEADER_IMG.thirdForest}
                        dataSrc={CONTACT_HEADER_IMG.thirdForest}
                    />
                </div>

                <div className="animation--pop-fade-in nature forest__third-line">
                    <LazySwapImage
                        alt="the third layer of  forest"
                        src={CONTACT_HEADER_IMG.secondWater}
                        dataSrc={CONTACT_HEADER_IMG.secondWater}
                    />
                </div>

                <div className="titles">
                    <h1
                        ref={titleRef}
                        className="animation--fade-in title--upper"
                    >
                        <HangingText>Contact</HangingText>
                    </h1>
                </div>

                <div className="animation--pop-fade-in nature forest__second-line">
                    <LazySwapImage
                        alt=" front forest seconde"
                        src={CONTACT_HEADER_IMG.firstRocks}
                        dataSrc={CONTACT_HEADER_IMG.firstRocks}
                    />
                </div>

                <div className="animation--pop-fade-in nature forest__front-line">
                    <LazySwapImage
                        alt=" front forest"
                        src={CONTACT_HEADER_IMG.front}
                        dataSrc={CONTACT_HEADER_IMG.front}
                    />
                </div>
            </div>

            <div className="container--tree">
                <div className="tree tree--left animation--pop-in">
                    <LazySwapImage
                        alt="a close up tree from the forest"
                        src={CONTACT_HEADER_IMG.bushesLeft}
                        dataSrc={CONTACT_HEADER_IMG.bushesLeft}
                    />
                </div>

                <div className="tree tree--right-top animation--pop-in">
                    <LazySwapImage
                        alt="a close up tree from the forest"
                        src={CONTACT_HEADER_IMG.bushesRight}
                        dataSrc={CONTACT_HEADER_IMG.bushesRight}
                    />
                </div>
            </div>
        </header>
    );
}

export default memo(Hero);
