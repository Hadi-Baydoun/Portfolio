import { useRef } from "react";
import { motion } from "framer-motion";

import { useTypewriter } from "@/components/motion-primitives/useTypewriter";

/**
 * Single work-experience card row; zig-zags via `animationOnLeft` (see `Experience` + `homepage.css` solo-copy rules).
 */
function ExperienceStepMarker({ stepIndex }) {
  return (
    <div className="linear-block__step-index" aria-hidden>
      <span className="linear-block__step-ring" />
      <span className="linear-block__step-line" />
      <motion.span
        className="linear-block__step-digit font-inter"
        initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      >
        {stepIndex}
      </motion.span>
    </div>
  );
}

export function LinearProcessRow({
  sectionClass,
  animationOnLeft,
  stepIndex,
  titlePrefix,
  titleHighlight,
  body,
  eyebrow,
  tags = [],
}) {
  const titleTriggerRef = useRef(null);
  const { typedText, showCursor } = useTypewriter(titleHighlight, {
    triggerRef: titleTriggerRef,
    charDelay: 100,
    threshold: 0.35,
  });

  const textBlock = (
    <motion.div
      className={`linear-block linear-block--${animationOnLeft ? "right" : "left"} linear-block--copy linear-block--experience-step`}
      initial={{ opacity: 0, x: animationOnLeft ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="linear-block__experience-anchor">
        <div className="linear-block__card">
          <span className="sr-only">Experience step {stepIndex}</span>
          <span className="linear-block__eyebrow">{eyebrow}</span>
          <h4
            ref={titleTriggerRef}
            className="font-inter font-extrabold! text-lg! leading-snug! mb-3! text-[#000000]! sm:text-xl! md:text-2xl!"
          >
            {titlePrefix}
            <span className="highlight font-inter" aria-label={titleHighlight}>
              {typedText}
              {showCursor ? (
                <span className="ml-0.5 inline-block font-light opacity-80" aria-hidden>
                  |
                </span>
              ) : null}
            </span>
          </h4>
          <p className="font-inter text-sm! leading-relaxed! sm:text-base!">
            {body}
          </p>
          <div
            className="linear-block__tags"
            aria-label={`${eyebrow} focus areas`}
          >
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <ExperienceStepMarker stepIndex={stepIndex} />
      </div>
    </motion.div>
  );

  return (
    <div className="container">
      <section className="section process-section">
        <motion.div
          className={`linear-content linear-content--creative linear-content--creative--tail linear-content--solo-copy ${sectionClass}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {textBlock}
        </motion.div>
      </section>
    </div>
  );
}
