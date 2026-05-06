import { memo, useRef } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTypewriter } from "@/components/motion-primitives/useTypewriter";


const DUMMY_PROJECTS = [
    {
        slug: "aurora-commerce",
        title: "Aurora Commerce",

        image: "https://picsum.photos/seed/aurora-commerce/1200/720",
        imageAlt: "Preview of the Aurora Commerce storefront concept",
        skills: ["React", "Framer Motion", "Stripe"],
        websiteUrl: "https://example.com/aurora",
        year: "2025",
        featured: true,
    },
    {
        slug: "studio-os",
        title: "Studio OS",

        image: "https://picsum.photos/seed/studio-os/960/600",
        imageAlt: "Preview of the Studio OS dashboard UI",
        skills: ["TypeScript", "Vite", "TanStack Query"],
        websiteUrl: "https://example.com/studio-os",
        year: "2025",
        featured: false,
    },
    {
        slug: "trailmaps",
        title: "Trailmaps",

        image: "https://picsum.photos/seed/trailmaps-outdoor/960/600",
        imageAlt: "Preview of the Trailmaps route planning interface",
        skills: ["React", "Maps API", "PWA"],
        websiteUrl: "https://example.com/trailmaps",
        year: "2024",
        featured: false,
    },
    {
        slug: "pulse-health",
        title: "Pulse Health",

        image: "https://picsum.photos/seed/pulse-healthcare/960/600",
        imageAlt: "Preview of the Pulse Health intake flow",
        skills: ["A11y", "React Hook Form", "i18n"],
        websiteUrl: "https://example.com/pulse",
        year: "2024",
        featured: false,
    },
    {
        slug: "orbit-analytics",
        title: "Orbit Analytics",

        image: "https://picsum.photos/seed/orbit-analytics/960/600",
        imageAlt: "Preview of the Orbit Analytics metrics wall",
        skills: ["D3", "WebSockets", "Redis"],
        websiteUrl: "https://example.com/orbit",
        year: "2024",
        featured: false,
    },
];

const PROJECTS_TITLE_TYPEWRITER_TEXT = "projects";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

const cardHoverTransition = {
    type: "spring",
    stiffness: 320,
    damping: 22,
};

function ProjectCardMedia({ image, imageAlt, featured }) {
    return (
        <div
            className={`relative isolate overflow-hidden rounded-2xl bg-[#e8ede9] ring-1 ring-[#dfe8e2]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${featured ? "aspect-16/11 min-h-[220px] lg:aspect-auto lg:min-h-[min(100%,320px)] lg:flex-1" : "aspect-16/11 min-h-[180px] sm:min-h-[200px]"
                }`}
        >
            <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#1a2e22]/35 via-[#1a2e22]/05 to-transparent"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_20%_0%,rgba(205,74,38,0.2),transparent_55%)]"
                aria-hidden
            />
        </div>
    );
}

function Projects() {
    const sectionRef = useRef(null);
    const headlineTriggerRef = useRef(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const orbPrimaryY = useTransform(
        scrollYProgress,
        [0, 1],
        reduceMotion ? [0, 0] : [0, 72],
    );
    const orbSecondaryY = useTransform(
        scrollYProgress,
        [0, 1],
        reduceMotion ? [0, 0] : [0, -56],
    );
    const lineScaleX = useTransform(scrollYProgress, [0.08, 0.42], [0.15, 1]);

    const { typedText, showCursor } = useTypewriter(
        PROJECTS_TITLE_TYPEWRITER_TEXT,
        {
            triggerRef: headlineTriggerRef,
            charDelay: 95,
            threshold: 0.35,
        },
    );

    return (
        <motion.section
            ref={sectionRef}
            id="projects"
            className="projects-section relative isolate overflow-hidden px-5 py-24 sm:py-28"
            aria-labelledby="projects-heading"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            <motion.div
                className="pointer-events-none absolute -left-24 top-[18%] size-112 rounded-full bg-[radial-gradient(circle_at_center,rgba(205,74,38,0.14)_0%,transparent_68%)] blur-3xl"
                style={{ y: orbPrimaryY }}
                aria-hidden
            />
            <motion.div
                className="pointer-events-none absolute -right-32 bottom-[8%] size-104 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,90,58,0.12)_0%,transparent_70%)] blur-3xl"
                style={{ y: orbSecondaryY }}
                aria-hidden
            />

            <motion.div
                ref={headlineTriggerRef}
                className="relative z-1 mx-auto max-w-3xl text-center"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
            >

                <h2
                    id="projects-heading"
                    className="mt-3 font-bushcraft text-4xl leading-tight tracking-wide text-[#1a2e22] sm:text-5xl"
                >
                    latest{" "}
                    <span
                        className="text-[#F15533]"
                        aria-label={PROJECTS_TITLE_TYPEWRITER_TEXT}
                    >
                        {typedText}
                        {showCursor ? (
                            <span
                                className="ml-0.5 inline-block font-light opacity-80"
                                aria-hidden
                            >
                                |
                            </span>
                        ) : null}
                    </span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl font-inter text-[0.95rem] leading-relaxed text-[#000000] sm:text-base">
                    Each project includes tags that represent the company I worked with while building it, as these were developed in a professional context rather than freelance work.
                </p>

            </motion.div>

            <motion.ul
                className="relative z-1 mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 md:gap-7 lg:gap-8"
                role="list"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.12 }}
            >
                {DUMMY_PROJECTS.map((project) => (
                    <motion.li
                        key={project.slug}
                        role="listitem"
                        variants={fadeUpVariants}
                        className={project.featured ? "md:col-span-2" : undefined}
                    >
                        <motion.article
                            className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/50 p-1 shadow-[0_16px_48px_-28px_rgba(45,25,20,0.12)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_22px_56px_-24px_rgba(205,74,38,0.18)] ${project.featured ? "lg:flex-row lg:gap-3 lg:p-1.5" : ""
                                }`}
                            whileHover={
                                reduceMotion ? undefined : { y: -6, transition: cardHoverTransition }
                            }
                        >
                            <span
                                className="pointer-events-none absolute inset-0 rounded-[1.65rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(205,74,38,0.06) 0%, transparent 42%, rgba(34,90,58,0.06) 100%)",
                                }}
                                aria-hidden
                            />

                            <div
                                className={`relative z-1 p-4 sm:p-5 ${project.featured ? "lg:flex lg:w-[46%] lg:flex-col lg:justify-center lg:pb-6 lg:pl-5 lg:pr-2 lg:pt-6" : "pb-2 sm:pb-3"}`}
                            >
                                <ProjectCardMedia
                                    image={project.image}
                                    imageAlt={project.imageAlt}
                                    featured={project.featured}
                                />
                            </div>

                            <div
                                className={`relative z-1 flex flex-1 flex-col px-5 pb-5 pt-1 sm:px-6 sm:pb-6 sm:pt-0 ${project.featured ? "lg:w-[54%] lg:justify-center lg:py-6 lg:pr-6" : ""}`}
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-[#1a2e22]/06 px-3 py-1 font-inter text-[11px] font-semibold uppercase tracking-wider text-[#2a3d30] ring-1 ring-[#1a2e22]/08">
                                        {project.year}
                                    </span>
                                    {project.featured ? (
                                        <span className="rounded-full bg-[#CD4A26]/12 px-3 py-1 font-inter text-[11px] font-semibold uppercase tracking-wider text-[#9a3018] ring-1 ring-[#CD4A26]/22">
                                            Featured
                                        </span>
                                    ) : null}
                                </div>

                                <h3 className="mt-4 font-bushcraft text-2xl tracking-wide text-[#1a2e22] sm:text-[1.65rem] text-start pt-5">
                                    {project.title}
                                </h3>



                                <div className="mt-2">

                                    <div className="mt-2.5 flex flex-wrap gap-2">
                                        {project.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-linear-to-br from-[#f8faf9] to-[#eef2ef] px-3 py-1 font-inter text-xs font-medium text-[#2a3d30] ring-1 ring-[#dfe8e2]/90"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <motion.a
                                    href={project.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative z-10 mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#1a2e22] px-5 py-2.5 font-inter text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(26,46,34,0.55)] ring-1 ring-[#1a2e22]/90 transition-colors hover:bg-[#243d30]"
                                    whileHover={
                                        reduceMotion ? undefined : { scale: 1.02 }
                                    }
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Visit website
                                    <ArrowUpRight className="size-4 opacity-90" aria-hidden />
                                </motion.a>
                            </div>
                        </motion.article>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.section>
    );
}

export default memo(Projects);
