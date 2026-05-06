import { memo, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, FileDown, Mail } from "lucide-react";
import githubIcon from "@/assets/github.svg";
import linkedinIcon from "@/assets/linkedin.svg";
import { CV_DOWNLOAD_HREF } from "@/constants/cvPublic";
import { useTypewriter } from "@/components/motion-primitives/useTypewriter";
import { ParticleCanvas } from "@/components/motion-primitives/particle-canvas";

const CONNECT_TYPEWRITER_TEXT = "connect";

const CV_DOWNLOAD_VIEWPORT = { once: true, amount: 0.35 };
/** Gentle reveal — slightly longer with a smooth ease curve */
const CV_DOWNLOAD_TRANSITION = {
    duration: 0.62,
    ease: [0.22, 1, 0.36, 1],
};

/** Organic ink blobs: erupt from varied points, overlap, and read as a coral flood on hover */
const CV_INK_BLOBS = [
    {
        left: "-12%",
        top: "-38%",
        w: "58%",
        h: "92%",
        br: "58% 42% 62% 38% / 48% 55% 45% 52%",
        ox: "22%",
        oy: "8%",
        delay: 0,
    },
    {
        left: "38%",
        top: "-32%",
        w: "52%",
        h: "88%",
        br: "45% 55% 48% 52% / 60% 40% 52% 48%",
        ox: "52%",
        oy: "6%",
        delay: 28,
    },
    {
        left: "68%",
        top: "8%",
        w: "56%",
        h: "82%",
        br: "52% 48% 58% 42% / 46% 54% 48% 52%",
        ox: "82%",
        oy: "28%",
        delay: 52,
    },
    {
        left: "48%",
        top: "48%",
        w: "62%",
        h: "76%",
        br: "48% 52% 45% 55% / 55% 45% 50% 50%",
        ox: "62%",
        oy: "88%",
        delay: 36,
    },
    {
        left: "-18%",
        top: "32%",
        w: "54%",
        h: "90%",
        br: "55% 45% 50% 50% / 42% 58% 52% 48%",
        ox: "12%",
        oy: "58%",
        delay: 64,
    },
    {
        left: "18%",
        top: "28%",
        w: "48%",
        h: "72%",
        br: "50% 50% 45% 55% / 52% 48% 46% 54%",
        ox: "42%",
        oy: "48%",
        delay: 16,
    },
];

const ContactCard = memo(function ContactCard({ icon, title, href }) {
    const Icon = typeof icon === "string" ? null : icon;

    const cardRef = useRef(null);
    const reduceMotion = useReducedMotion();

    const [hovered, setHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cardSize, setCardSize] = useState({ w: 0, h: 0 });

    const handleMouseEnter = () => {
        if (reduceMotion) return;
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setCardSize({ w: r.width, h: r.height });
        setHovered(true);
    };

    const handleMouseMove = (e) => {
        if (reduceMotion) return;
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    const handleMouseLeave = () => {
        setHovered(false);
        if (cardRef.current) cardRef.current.style.transform = "";
    };

    return (
        <a
            ref={cardRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                position: "relative",
                background: hovered ? "rgba(255,247,240,1)" : "rgba(255,255,255,0.92)",
                border: `2px dashed ${hovered ? "#F15533" : "rgb(212,212,212)"}`,
                boxShadow: hovered
                    ? "0 20px 52px rgba(255,100,100,0.14)"
                    : "0 2px 12px rgba(0,0,0,0.045)",
                overflow: "hidden",
                cursor: "pointer",
                transformStyle: "preserve-3d",
                willChange: "transform",
                transition:
                    "transform .25s ease, border-color .4s ease, background .4s ease, box-shadow .4s ease",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                backdropFilter: "blur(12px)",
            }}
            className="group flex min-h-[156px] flex-col items-center justify-center rounded-[18px] px-4 pb-5 pt-8 text-center sm:min-h-0 sm:rounded-3xl sm:p-8 lg:p-10"
        >
            <ParticleCanvas active={hovered} mousePos={mousePos} size={cardSize} />

            {/* Corner badge (matches About stats cards) */}
            <div
                aria-hidden
                className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-dashed border-[#F15533] sm:right-3.5 sm:top-3.5 sm:h-8 sm:w-8"
                style={{
                    opacity: hovered ? 1 : 0,
                    transform: hovered
                        ? "scale(1) rotate(0deg)"
                        : "scale(0.4) rotate(-25deg)",
                    transition: "all .45s cubic-bezier(.34,1.56,.64,1)",
                }}
            >
                <ExternalLink aria-hidden strokeWidth={2} className="h-3 w-3 text-[#F15533] sm:h-3.5 sm:w-3.5" />
            </div>

            <div className="mb-3 rounded-full bg-[#1a2e22] p-3.5 text-white shadow-2xl transition-transform duration-300 sm:mb-4 sm:p-5">
                {Icon ? (
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.5} aria-hidden />
                ) : (
                    <img src={icon} alt="" className="h-7 w-7 invert sm:h-8 sm:w-8" />
                )}
            </div>

            <h3 className="w-full text-lg font-bold tracking-tight text-[#1a2e22] sm:text-xl">
                {title}
            </h3>

            <div className="mt-2 h-1 w-8 rounded-full bg-[#F15533] opacity-0 transition-all group-hover:w-12 group-hover:opacity-100" />
        </a>
    );
});

export default function ContactGrid() {
    const headlineTriggerRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const [cvInkActive, setCvInkActive] = useState(false);
    const { typedText, showCursor } = useTypewriter(CONNECT_TYPEWRITER_TEXT, {
        triggerRef: headlineTriggerRef,
        charDelay: 100,
        threshold: 0.35,
    });

    const cvSurfaceClass =
        cvInkActive && reduceMotion
            ? "bg-[#F15533] text-[#1a2e22]"
            : cvInkActive
                ? "bg-transparent text-[#1a2e22]"
                : "bg-[#1a2e22] text-white";

    return (
        <section id="contact" className="relative z-10 bg-transparent px-6 pt-16">
            <div
                ref={headlineTriggerRef}
                className="mx-auto mb-16 max-w-6xl text-center"
            >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="font-bushcraft text-4xl uppercase tracking-tight text-[#1a2e22] md:text-6xl"
                >
                    Let&apos;s{" "}
                    <span className="text-[#F15533]" aria-label={CONNECT_TYPEWRITER_TEXT}>
                        {typedText}
                        {showCursor ? (
                            <span className="ml-0.5 inline-block font-light opacity-80" aria-hidden>
                                |
                            </span>
                        ) : null}
                    </span>
                </motion.h2>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-9 lg:grid-cols-3 lg:gap-10">
                <ContactCard icon={Mail} title="Email" href="mailto:hadibaydoun17@gmail.com" />
                <ContactCard icon={githubIcon} title="GitHub" href="https://github.com/Hadi-Baydoun" />
                <ContactCard icon={linkedinIcon} title="LinkedIn" href="https://www.linkedin.com/in/hadi-baydoun-54431621b/" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={CV_DOWNLOAD_VIEWPORT}
                transition={CV_DOWNLOAD_TRANSITION}
                className="mx-auto mt-14 flex max-w-6xl justify-center px-2"
            >
                <span className="inline-flex rounded-full shadow-[0_10px_34px_-4px_rgba(26,46,34,0.55),0_4px_14px_-2px_rgba(0,0,0,0.14)] transition-shadow duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] hover:shadow-[0_18px_46px_-6px_rgba(241,85,51,0.35),0_10px_28px_-6px_rgba(26,46,34,0.35)] motion-reduce:transition-none">
                    <a
                        href={CV_DOWNLOAD_HREF}
                        download="Hadi-Imad-Baydoun-CV.pdf"
                        aria-label="Download CV (PDF)"
                        onMouseEnter={() => setCvInkActive(true)}
                        onMouseLeave={() => setCvInkActive(false)}
                        onFocus={() => setCvInkActive(true)}
                        onBlur={() => setCvInkActive(false)}
                        style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            padding: "1.2rem 2.5rem",
                            borderRadius: "999px",
                            overflow: "hidden",
                            minHeight: "64px",
                            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                        }}
                        className={`isolate rounded-full transition-[background-color,color,transform] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-colors motion-reduce:duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F15533] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${cvSurfaceClass} ${cvInkActive && !reduceMotion ? "scale-[1.02]" : "scale-100"}`}
                    >
                        {/* Coral ink flood — driven by hover/focus state so Tailwind group-hover is not required */}
                        {!reduceMotion ? (
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
                            >
                                {CV_INK_BLOBS.map((b, i) => (
                                    <span
                                        key={i}
                                        aria-hidden
                                        className="pointer-events-none absolute bg-[#F15533]"
                                        style={{
                                            left: b.left,
                                            top: b.top,
                                            width: b.w,
                                            height: b.h,
                                            borderRadius: b.br,
                                            transformOrigin: `${b.ox} ${b.oy}`,
                                            transform: cvInkActive ? "scale(1.4)" : "scale(0.08)",
                                            filter: cvInkActive ? "blur(1px)" : "blur(4px)",
                                            opacity: cvInkActive ? 1 : 0,
                                            transitionProperty: "transform, filter, opacity",
                                            transitionDuration: cvInkActive ? "0.82s" : "0.95s",
                                            transitionTimingFunction:
                                                "cubic-bezier(0.33, 1, 0.68, 1)",
                                            transitionDelay: `${b.delay}ms`,
                                        }}
                                    />
                                ))}
                            </span>
                        ) : null}

                        <FileDown className="relative z-10 h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
                        <span className="relative z-10">Download CV</span>
                    </a>
                </span>
            </motion.div>
        </section>
    );
}
