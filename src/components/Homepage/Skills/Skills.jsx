import { memo, useRef } from "react";
import { motion } from "framer-motion";
import { EXPLORE_SKILLS } from "@/components/Homepage/Skills/exploreSkillsAssets";
import { useTypewriter } from "@/components/motion-primitives/useTypewriter";

const SKILLS_HEADING_TYPEWRITER_TEXT = "skills";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const Skills = () => {
    const skillsHeadlineTriggerRef = useRef(null);
    const { typedText, showCursor } = useTypewriter(SKILLS_HEADING_TYPEWRITER_TEXT, {
        triggerRef: skillsHeadlineTriggerRef,
        charDelay: 100,
        threshold: 0.35,
    });

    return (
        <motion.section
            id="skills"
            className="portfolio-skills-section relative isolate overflow-hidden bg-transparent px-5 py-24 sm:py-28"
            aria-labelledby="skills-heading"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={container}
        >



            {/* Header */}
            <motion.div
                ref={skillsHeadlineTriggerRef}
                className="relative z-1 mx-auto max-w-4xl text-center"
                variants={fadeUp}
            >
                <h2
                    id="skills-heading"
                    className="font-bushcraft text-4xl leading-tight tracking-wide text-[#1a2e22] sm:text-5xl"
                >
                    <span className="text-[#F15533]" aria-label={SKILLS_HEADING_TYPEWRITER_TEXT}>
                        {typedText}
                        {showCursor ? (
                            <span className="ml-0.5 inline-block font-light opacity-80" aria-hidden>
                                |
                            </span>
                        ) : null}
                    </span>{" "}
                    i build with
                </h2>

                <div className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#000000] sm:text-base font-inter">
                    Languages, frameworks, and design tooling that I reach for.
                </div>
            </motion.div>

            {/* Grid */}
            <motion.ul
                className="relative z-1 mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-x-6 md:gap-x-0 gap-y-10 sm:mt-16 md:grid-cols-5 lg:grid-cols-7 lg:gap-x-32 sm:gap-y-12"
                role="list"
                variants={container}
            >
                {EXPLORE_SKILLS.map(({ src, label }) => (
                    <motion.li
                        key={label}
                        className="flex flex-col items-center text-center"
                        variants={fadeUp}
                        whileHover={{ y: -6, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >

                        <div className="group relative">
                            <div
                                aria-hidden
                                className="absolute inset-[-6px] rounded-full bg-[conic-gradient(from_210deg,rgba(34,90,58,0.2),transparent_42%,rgba(180,200,172,0.35)_72%,rgba(34,90,58,0.18))] opacity-70 blur-[1px] transition duration-500 group-hover:opacity-100 group-hover:blur-none"
                            />
                            <div className="relative flex size-23 items-center justify-center rounded-full bg-linear-to-br from-white to-[#f4f7f5] p-[3px] shadow-[0_8px_28px_-12px_rgba(15,42,26,0.18),inset_0_1px_0_rgba(255,255,255,1)] ring ring-[#dfe8e2]/90 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_36px_-10px_rgba(34,90,58,0.22),inset_0_1px_0_rgba(255,255,255,1)] group-hover:ring-[#b8cfb8]/65 sm:size-25">
                                <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#f8faf9] to-[#eef2ef]">
                                    <img
                                        src={src}
                                        alt=""
                                        role="presentation"
                                        className="size-[62%] object-contain transition duration-300 group-hover:scale-105"
                                    />
                                </span>
                            </div>
                        </div>

                        <span className="mt-4 font-bushcraft text-[0.95rem] tracking-wide text-[#2a3d30] sm:text-base">
                            {label}
                        </span>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.section>
    );
};

export default memo(Skills);