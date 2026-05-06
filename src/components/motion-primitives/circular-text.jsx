import { memo, useMemo } from "react";
import { motion } from "framer-motion";

const BASE_DIAMETER = 160;
/** Applied to the incoming `diameter` prop so the ring renders smaller without changing callers proportionally beyond this factor. */
const LAYOUT_SCALE = 0.66;
const DESKTOP_DIAMETER_THRESHOLD = 640;
const DESKTOP_MIN_LETTER_PX = 28;
const DESKTOP_MAX_LETTER_PX = 60;

const CircularText = memo(function CircularText({
  text,
  spinDuration = 20,
  diameter = BASE_DIAMETER,
  className = "",
}) {
  const letters = useMemo(() => Array.from(text), [text]);
  const resolvedDiameter = Math.max(1, Math.round(diameter * LAYOUT_SCALE));
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

  return (
    <motion.div
      className={`m-0 ml-auto rounded-full relative text-white font-black text-center origin-center shrink-0 pointer-events-none ${className}`}
      style={{ width: resolvedDiameter, height: resolvedDiameter }}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        rotate: {
          duration: spinDuration,
          repeat: Infinity,
          ease: "linear",
        },
      }}
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
