import React, {
    useMemo,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

const WORD_TOKEN_PATTERN = /\S+\s*/g;

const ConnectedItem = ({
    item,
    mouseX,
    mouseY,
    proximityRadius,
    proximityMaxScale,
    proximityMaxY,
    initialItem,
    animateTarget,
    entranceTransition,
    revealDelay,
    type
}) => {
    const itemRef = useRef(null);

    const distance = useMotionValue(0);

    React.useEffect(() => {
        const unsubscribe = mouseX.on("change", (x) => {
            const y = mouseY.get();
            if (x === -1000 || y === -1000) {
                distance.set(0);
                return;
            }

            const el = itemRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const lineHeight = rect.height * 2.5; // tolerance band per line
            const dy = Math.abs(y - cy);

            if (dy > lineHeight) {
                distance.set(0);
                return;
            }

            const dx = x - cx;
            const d = Math.hypot(dx, dy);

            const t = Math.max(0, 1 - d / proximityRadius);

            distance.set(t * t * (3 - 2 * t));
        });

        return () => unsubscribe();
    }, [mouseX, mouseY, distance, proximityRadius]);

    const springConfig = { stiffness: 120, damping: 22, mass: 0.6 };

    const scale = useSpring(
        useTransform(distance, (v) => 1 + v * proximityMaxScale),
        springConfig
    );

    const yTransform = useSpring(
        useTransform(distance, (v) => v * proximityMaxY),
        springConfig
    );

    return (
        <motion.span
            ref={itemRef}
            initial={initialItem}
            animate={animateTarget}
            style={{
                display: "inline-block",
                whiteSpace: type === "chars" ? "pre" : "normal",
                scale,
                y: yTransform,
                position: "relative",
                zIndex: 1,
                willChange: "transform",
            }}
            transition={{
                ...entranceTransition,
                delay: revealDelay,
            }}
        >
            {item}
        </motion.span>
    );
};

const SplittingText = forwardRef(function SplittingText(props, ref) {
    const {
        text,
        children,
        type = "chars",
        motionVariants = {},
        inView = false,
        inViewMargin = "-50px", // Trigger slightly before it enters center view
        inViewOnce = true,
        delay = 0,
        proximityHover = false,
        proximityRadius = 85,
        proximityMaxScale = 0.3, // Slightly more pronounced scale
        proximityMaxY = -12,
        style: wrapStyle,
        ...rest
    } = props;

    const localRef = useRef(null);
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    useImperativeHandle(ref, () => localRef.current);

    const lineRuns = useMemo(() => {
        if (children != null) {
            return [{
                lineIndex: 0,
                fragments: [<React.Fragment key="text-effect-slot">{children}</React.Fragment>],
                startIndex: 0,
            }];
        }
        if (typeof text !== "string") return [];
        const normalized = text
            .replace(/\r\n/g, "\n")
            .replace(/\\n/g, "\n");
        const lines = normalized.split("\n");

        let globalIndex = 0;
        return lines.map((line, lineIndex) => {
            const parts = type === "words"
                ? (line.match(WORD_TOKEN_PATTERN) || [])
                : line.split("");

            const startIndex = globalIndex;
            globalIndex += parts.length;

            const fragments = parts.map((part, i) => (
                <React.Fragment key={`${lineIndex}-${i}`}>{part}</React.Fragment>
            ));

            return { lineIndex, fragments, startIndex };
        });
    }, [text, type, children]);

    const inViewResult = useInView(localRef, { once: inViewOnce, margin: inViewMargin });
    const isInView = !inView || inViewResult;

    // --- FANCY ENTRANCE CONFIG ---
    const stagger = motionVariants.stagger ?? (type === "chars" ? 0.04 : 0.12);

    const initialItem = {
        opacity: 0,
        y: 40,
        rotateX: 45,
        scale: 0.9,
        ...motionVariants.initial
    };

    const animateTarget = isInView ? {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        ...motionVariants.animate
    } : initialItem;

    // The secret sauce: A custom ease-out cubic bezier for that "premium" glide
    const entranceTransition = {
        duration: 1.2,
        ease: [0.215, 0.61, 0.355, 1],
        ...motionVariants.transition
    };

    return (
        <motion.span
            ref={localRef}
            onMouseMove={(e) => {
                if (proximityHover) {
                    mouseX.set(e.clientX);
                    mouseY.set(e.clientY);
                }
            }}
            onMouseLeave={() => {
                mouseX.set(-1000);
                mouseY.set(-1000);
            }}
            style={{
                display: "inline-block",
                perspective: "1000px", // Needed for the rotateX effect
                willChange: "transform, opacity",
                ...wrapStyle,
            }}
            {...rest}
        >
            {lineRuns.map(({ lineIndex, fragments, startIndex }) => (
                <span
                    key={`line-${lineIndex}`}
                    style={{ display: children != null ? "inline" : "block" }}
                >
                    {fragments.map((item, i) => {
                        const index = startIndex + i;
                        return (
                            <ConnectedItem
                                key={`${lineIndex}-${i}`}
                                item={item}
                                mouseX={mouseX}
                                mouseY={mouseY}
                                type={type}
                                proximityRadius={proximityRadius}
                                proximityMaxScale={proximityMaxScale}
                                proximityMaxY={proximityMaxY}
                                initialItem={initialItem}
                                animateTarget={animateTarget}
                                entranceTransition={entranceTransition}
                                revealDelay={(delay / 1000) + (index * stagger)}
                            />
                        );
                    })}
                </span>
            ))}
        </motion.span>
    );
});

export default SplittingText;