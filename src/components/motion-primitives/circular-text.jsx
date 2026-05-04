import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";

const BASE_DIAMETER = 160;
/** Applied to the incoming `diameter` prop so the ring renders smaller without changing callers. */
const LAYOUT_SCALE = 0.78;
const DESKTOP_DIAMETER_THRESHOLD = 640;
const DESKTOP_MIN_LETTER_PX = 28;
const DESKTOP_MAX_LETTER_PX = 60;

const CircularText = memo(function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  interactive = true,
  diameter = BASE_DIAMETER,
  className = "",
}) {
  const letters = useMemo(() => Array.from(text), [text]);
  const resolvedDiameter = Math.max(1, Math.round(diameter * LAYOUT_SCALE));
  const radiusScale = resolvedDiameter / BASE_DIAMETER;
  const letterFontPx = useMemo(() => {
    const n = Math.max(letters.length, 1);
    const arcPerGlyph = (Math.PI * resolvedDiameter) / n;
    const isDesktopSized = resolvedDiameter >= DESKTOP_DIAMETER_THRESHOLD;

    if (isDesktopSized) {
      return Math.round(
        Math.max(
          DESKTOP_MIN_LETTER_PX,
          Math.min(DESKTOP_MAX_LETTER_PX, arcPerGlyph * 0.32),
        ),
      );
    }

    const responsiveMinPx = Math.max(10, resolvedDiameter * 0.045);
    const responsiveMaxPx = Math.min(DESKTOP_MIN_LETTER_PX, resolvedDiameter * 0.065);

    return Math.round(
      Math.max(responsiveMinPx, Math.min(responsiveMaxPx, arcPerGlyph * 0.32)),
    );
  }, [letters.length, resolvedDiameter]);
  const [hovered, setHovered] = useState(false);

  const rotateDuration = useMemo(() => {
    if (!interactive || !hovered) return spinDuration;
    switch (onHover) {
      case "slowDown":
        return spinDuration * 2;
      case "speedUp":
        return spinDuration / 4;
      case "pause":
        return spinDuration * 120;
      case "goBonkers":
        return spinDuration / 20;
      default:
        return spinDuration;
    }
  }, [interactive, hovered, onHover, spinDuration]);

  const scale =
    interactive && hovered && onHover === "goBonkers" ? 0.8 : 1;

  return (
    <motion.div
      className={`m-0 mx-auto rounded-full relative text-white font-black text-center origin-center shrink-0 ${interactive ? "cursor-pointer" : "cursor-default"} ${className}`}
      style={{ width: resolvedDiameter, height: resolvedDiameter }}
      initial={{ rotate: 0, scale: 1 }}
      animate={{ rotate: 360, scale }}
      transition={{
        rotate: {
          duration: rotateDuration,
          repeat: Infinity,
          ease: "linear",
        },
        scale: { type: "spring", damping: 20, stiffness: 300 },
      }}
      {...(interactive
        ? {
          onHoverStart: () => setHovered(true),
          onHoverEnd: () => setHovered(false),
        }
        : {})}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const radius = resolvedDiameter * 0.009;
        const transform = `rotate(${rotationDeg}deg) translateY(-${radius}px)`;

        return (
          <span
            key={`${i}-${letter}`}
            className="absolute inline-block inset-0 font-black"
            style={{
              transform,
              WebkitTransform: transform,
              fontSize: letterFontPx,
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
});

export default CircularText;
