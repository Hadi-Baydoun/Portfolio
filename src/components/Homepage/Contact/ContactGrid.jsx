import { memo, useCallback, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FileDown, Mail } from "lucide-react";
import githubIcon from "@/assets/github.svg";
import linkedinIcon from "@/assets/linkedin.svg";
import { CV_DOWNLOAD_HREF } from "@/constants/cvPublic";
import { useTypewriter } from "@/components/motion-primitives/useTypewriter";

const CONNECT_TYPEWRITER_TEXT = "connect";

const CONTACT_CARD_SPRING = { stiffness: 42, damping: 32, mass: 0.85 };

const FLOAT_ICON_STYLE = { transform: "translateZ(50px)" };
const FLOAT_TITLE_STYLE = { transform: "translateZ(30px)" };
const FLOAT_FLARE_STYLE = { transform: "translateZ(10px)" };

const CV_DOWNLOAD_VIEWPORT = { once: true, amount: 0.35 };
const CV_DOWNLOAD_TRANSITION = { duration: 0.45, ease: "easeOut" };

const ContactCard = memo(function ContactCard({ icon, title, href }) {
    const Icon = typeof icon === "string" ? null : icon;

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, CONTACT_CARD_SPRING);
    const mouseYSpring = useSpring(y, CONTACT_CARD_SPRING);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "15deg"]);

    const handleMouseMove = useCallback(
        (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            x.set(mouseX / width - 0.5);
            y.set(mouseY / height - 0.5);
        },
        [x, y],
    );

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    const motionStyle = useMemo(
        () => ({
            rotateY,
            rotateX,
            transformStyle: "preserve-3d",
        }),
        [rotateX, rotateY],
    );

    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={motionStyle}
            className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/80 p-10 shadow-md shadow-slate-900/5 backdrop-blur-md transition-[colors,box-shadow] duration-500 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/15"
        >
            {/* Floating Icon */}
            <div
                style={FLOAT_ICON_STYLE}
                className="mb-4 rounded-full bg-[#1a2e22] p-5 text-white shadow-2xl transition-transform duration-300"
            >
                {Icon ? (
                    <Icon size={32} strokeWidth={1.5} />
                ) : (
                    <img src={icon} alt="" className="h-8 w-8 invert" />
                )}
            </div>

            {/* Floating Text */}
            <h3
                style={FLOAT_TITLE_STYLE}
                className="text-xl font-bold tracking-tight text-[#1a2e22]"
            >
                {title}
            </h3>

            {/* Bottom "Reflection" Flare */}
            <div
                style={FLOAT_FLARE_STYLE}
                className="mt-2 h-1 w-8 rounded-full bg-[#F15533] opacity-0 transition-all group-hover:w-12 group-hover:opacity-100"
            />
        </motion.a>
    );
});

export default function ContactGrid() {
    const headlineTriggerRef = useRef(null);
    const { typedText, showCursor } = useTypewriter(CONNECT_TYPEWRITER_TEXT, {
        triggerRef: headlineTriggerRef,
        charDelay: 100,
        threshold: 0.35,
    });

    return (
        <section id="contact" className="relative z-10 bg-transparent px-6 pt-20 mt-10">
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

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
                <ContactCard icon={Mail} title="Email" href="mailto:hadibaydoun17@gmail.com" />
                <ContactCard icon={githubIcon} title="GitHub" href="https://github.com/Hadi-Baydoun" />
                <ContactCard icon={linkedinIcon} title="LinkedIn" href="https://www.linkedin.com/in/hadi-baydoun-54431621b/" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={CV_DOWNLOAD_VIEWPORT}
                transition={CV_DOWNLOAD_TRANSITION}
                className="mx-auto mt-14 flex max-w-6xl justify-center px-2"
            >
                <a
                    href={CV_DOWNLOAD_HREF}
                    download="Hadi-Imad-Baydoun-CV.pdf"
                    aria-label="Download CV (PDF)"
                    style={{
                        color: "#1c2e57",
                        fontSize: "clamp(1.1rem, 2.8vw, 1.35rem)",
                    }}
                    className="inline-flex min-h-16 w-full max-w-xl items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/90 to-slate-100/80 px-10 py-5 text-center !font-bold uppercase tracking-[0.08em] shadow-md shadow-slate-900/8 ring-1 ring-slate-900/5 transition-transform duration-200 hover:scale-[1.04] active:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#F15533] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
                >
                    <FileDown
                        className="h-7 w-7 shrink-0 text-[#F15533]"
                        strokeWidth={2}
                        aria-hidden
                    />
                    Download CV
                </a>
            </motion.div>
        </section>
    );
}