import { motion } from "framer-motion";

/**
 * Work experience rows: copy card + arrow toward the next row (desktop zig-zag, mobile down).
 * `animationOnLeft` flips visual vs copy column order.
 */
export function LinearProcessRow({
  sectionClass,
  animationOnLeft,
  title,
  body,
  eyebrow,
  tags = [],
  showArrowToNext = false,
  connectorSrc,
  /** Shown on the last row when there is no “next” connector (e.g. PNG on the right of the card). */
  endArrowSrc,
  /** Public URL (e.g. `/file.pdf` from `/public`) for the Download CV control beside the end arrow. */
  cvDownloadHref,
  cvDownloadLabel = "Download CV",
}) {
  const hasConnector = showArrowToNext && connectorSrc;
  const hasEndArrow = Boolean(endArrowSrc);
  const hasCvCta = Boolean(cvDownloadHref);
  const showVisualColumn = hasConnector || hasEndArrow || hasCvCta;
  const useEndVisualStyle = hasEndArrow || hasCvCta;
  const textBlock = (
    <motion.div
      className={`linear-block linear-block--${animationOnLeft ? "right" : "left"} linear-block--copy`}
      initial={{ opacity: 0, x: animationOnLeft ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="linear-block__card">
        <span className="linear-block__eyebrow">{eyebrow}</span>
        <h4>{title}</h4>
        <p>{body}</p>
        <div
          className="linear-block__tags"
          aria-label={`${eyebrow} focus areas`}
        >
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const visualBlock = showVisualColumn ? (
      <motion.div
        className={
          (animationOnLeft
            ? "linear-block linear-block--left image-left linear-block--visual linear-block--visual-plain linear-block--visual-arrow"
            : "linear-block linear-block--right linear-block--visual linear-block--visual-plain linear-block--visual-arrow") +
          (useEndVisualStyle ? " linear-block--visual-arrow-end" : "")
        }
        initial={{ opacity: 0, scale: 0.94, x: animationOnLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
      >
        {hasConnector ? (
          <div className="linear-block__step-arrow-wrap" aria-hidden>
            <video
              className="linear-block__step-connector"
              src={connectorSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        ) : hasCvCta && hasEndArrow ? (
          <div className="linear-block__end-cta">
            <div className="linear-block__step-arrow-wrap" aria-hidden>
              <span className="linear-block__end-arrow-sway">
                <img
                  className="linear-block__step-connector linear-block__step-connector--end"
                  src={endArrowSrc}
                  alt=""
                />
              </span>
            </div>
            <a
              className="linear-block__cv-download"
              href={cvDownloadHref}
              download="Hadi-Imad-Baydoun-CV.pdf"
              aria-label={`${cvDownloadLabel} (PDF)`}
            >
              {cvDownloadLabel}
            </a>
          </div>
        ) : hasCvCta ? (
          <div className="linear-block__end-cta linear-block__end-cta--cv-only">
            <a
              className="linear-block__cv-download"
              href={cvDownloadHref}
              download="Hadi-Imad-Baydoun-CV.pdf"
              aria-label={`${cvDownloadLabel} (PDF)`}
            >
              {cvDownloadLabel}
            </a>
          </div>
        ) : hasEndArrow ? (
          <div className="linear-block__step-arrow-wrap" aria-hidden>
            <span className="linear-block__end-arrow-sway">
              <img
                className="linear-block__step-connector linear-block__step-connector--end"
                src={endArrowSrc}
                alt=""
              />
            </span>
          </div>
        ) : null}
      </motion.div>
    ) : null;

  return (
    <div className="container">
      <section className="section process-section">
        <motion.div
          className={`linear-content linear-content--creative ${sectionClass}${
            showArrowToNext || endArrowSrc || cvDownloadHref
              ? ""
              : " linear-content--creative--tail"
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {animationOnLeft ? (
            <>
              {visualBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {visualBlock}
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
}
