import { memo, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTypewriter } from "@/components/motion-primitives/useTypewriter";
import mobile_arts from "@/assets/Projects/mobile_arts.webp";
import adstalk from "@/assets/Projects/adstalk_pic.webp";
import mystic from "@/assets/Projects/mystic.webp";
import rbs from "@/assets/Projects/rbs.webp";
import tecleef from "@/assets/Projects/tecleef.webp";

const PROJECTS = [
    {
        title: "Mobile Arts",
        image: mobile_arts,
        imageAlt: "Mobile Arts Website",
        skills: ["ReactJS", "Framer Motion", "Tailwind", "ThreeJS"],
        websiteUrl: "https://mobileartsme.com/",
        company: "Mobile Arts",
    },
    {
        title: "Adstalk",
        image: adstalk,
        imageAlt: "Adstalk Website",
        skills: ["ReactJS", "Tailwind", "Framer Motion"],
        websiteUrl: "https://www.adstalk.ai/",
        company: "Mobile Arts",
    },
    {
        title: "Mystic Mist",
        image: mystic,
        imageAlt: "Mystic Mist Website",
        skills: ["ReactJS", "Strapi CMS", "Framer Motion"],
        websiteUrl: "https://mystic-mist.vercel.app/",
        company: "Freelance",
    },
    {
        title: "Tecleef",
        image: tecleef,
        imageAlt: "Tecleef Website",
        skills: ["ReactJS", "Python", "ERPNext"],
        websiteUrl: "https://tecleef.com/",
        company: "HoldCo Corp.",
    },
    {
        title: "RBS",
        image: rbs,
        imageAlt: "RBS Website",
        skills: ["Python", "React", "Tailwind", "ERPNext"],
        websiteUrl: "https://rbsme.com/",
        company: "HoldCo Corp.",
    },
];

const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

function ProjectCard({ project }) {
    const cardRef = useRef(null);


    // Parallax effect for the image inside the card
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });
    const yImage = useTransform(scrollYProgress, [0, 1], [-20, 20]);

    return (
        <motion.article
            ref={cardRef}
            variants={fadeUpVariants}
            className="group relative h-full"
        >
            <div className="group relative flex h-auto flex-col rounded-[30px]">

                {/* Main card layer — rest: hard BR offset; hover: same shape, stronger fill */}
                <div className="relative z-10 flex flex-col overflow-hidden rounded-[30px] bg-white shadow-[8px_8px_0_0_rgba(241,85,51,0.22)] transition-shadow duration-300 ease-out group-hover:shadow-[8px_8px_0_0_rgba(241,85,51,0.55)]">

                    {/* Image Section */}
                    <div className="relative h-48 shrink-0 overflow-hidden sm:h-52 lg:h-56">

                        <motion.img
                            style={{ y: yImage, scale: 1.1 }}
                            src={project.image}
                            alt={project.imageAlt}
                            draggable={false}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-[#421a34]/70 via-transparent to-transparent opacity-70" />

                        {/* Company badge */}
                        <div className="absolute left-4 top-4">
                            <span className="rounded-full border border-[rgba(241,85,51,0.4)] bg-[#fff7ef]/95 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-[#421a34] uppercase shadow-[0_6px_14px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                                {project.company}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 p-6 sm:p-8">
                        <div className="flex w-full flex-col gap-4">

                            <div className="flex items-start justify-between gap-4">
                                <h3 className="font-bushcraft text-3xl tracking-tight text-[#1a2e22]">
                                    {project.title}
                                </h3>

                                <motion.a
                                    href={project.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-[#ffbb71] to-[#f15533] text-white shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0px_0px_0px_rgba(0,0,0,0.2),8px_8px_20px_rgba(241,85,51,0.35)] hover:translate-y-[-1px]"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ArrowUpRight className="size-5" />
                                </motion.a>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full border border-[rgba(241,85,51,0.2)] bg-[rgba(255,255,255,0.7)] px-2.5 py-1 text-[11px] font-semibold text-[#421a34] uppercase tracking-[0.06em]"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* bottom accent line */}
                    {/* <div className="h-1 w-0 bg-[#F15533] transition-all duration-300 group-hover:w-full shadow-[0_0_12px_rgba(241,85,51,0.6)]" /> */}

                </div>
            </div>
        </motion.article>
    );
}

function Projects() {
    const sectionRef = useRef(null);
    const headlineTriggerRef = useRef(null);
    const { typedText, showCursor } = useTypewriter("projects", {
        triggerRef: headlineTriggerRef,
    });

    const PROJECTS_TITLE_TYPEWRITER_TEXT = "projects";

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="section margin-top--large relative  pt-20 sm:pt-24"
        >

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
                <p className="mx-auto mt-4 max-w-3xl font-inter text-[0.95rem] leading-relaxed text-[#000000] sm:text-base mb-6">
                    Each project includes tags that represent the company I worked with while building it, as these were developed in a professional context rather than freelance work.
                </p>

            </motion.div>

            <motion.div
                className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 pb-8 px-4 md:px-8 lg:px-10"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                    show: { transition: { staggerChildren: 0.15 } },
                }}
            >
                <Swiper
                    modules={[Autoplay]}
                    className="select-none"
                    style={{ padding: "2rem 0", backgroundColor: "transparent", boxShadow: "none" }}
                    grabCursor
                    touchStartPreventDefault={false}
                    watchOverflow
                    observer
                    observeParents
                    loop={true}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={650}
                    spaceBetween={28}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                            centeredSlides: false,
                        },
                        768: {
                            slidesPerView: 2,
                            centeredSlides: false,
                        },
                        1024: {
                            slidesPerView: 2.5,
                            centeredSlides: true,
                        },
                        1440: {
                            slidesPerView: 3,
                            centeredSlides: true,
                        },
                    }}
                >
                    {PROJECTS.map((project) => (
                        <SwiperSlide key={project.title} className="h-auto">
                            <ProjectCard project={project} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </section>
    );
}

export default memo(Projects);