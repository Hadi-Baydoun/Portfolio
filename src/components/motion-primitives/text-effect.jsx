import React, {
    useMemo,
    useRef,
    useImperativeHandle,
    forwardRef,
    useCallback,
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
    type,
    segmentClassName,
}) => {
    const distance = useMotionValue(0);
    const elRef = useRef(null);

    // Batch mouse tracking into a single effect
    React.useEffect(() => {
        let animationId = null;

        const unsubscribe = mouseX.on("change", () => {
            // Cancel pending animation frame and schedule new one
            if (animationId) cancelAnimationFrame(animationId);

            animationId = requestAnimationFrame(() => {
                const x = mouseX.get();
                const y = mouseY.get();

                // Quick exit if mouse is off-screen
                if (x === -1000 || y === -1000) {
                    distance.set(0);
                    return;
                }

                const el = elRef.current;
                if (!el) return;

                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;

                const lineHeight = rect.height * 2.5;
                const dy = Math.abs(y - cy);

                // Early exit if outside vertical band
                if (dy > lineHeight) {
                    distance.set(0);
                    return;
                }

                const dx = x - cx;
                const d = Math.hypot(dx, dy);
                const t = Math.max(0, 1 - d / proximityRadius);

                // Smooth easing: smoothstep function
                distance.set(t * t * (3 - 2 * t));
            });
        });

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            unsubscribe();
        };
    }, [mouseX, mouseY, distance, proximityRadius]);

    // Tighter spring config for snappier response
    const springConfig = { stiffness: 180, damping: 26, mass: 0.5 };

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
            ref={elRef}
            className={segmentClassName}
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
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "subpixel-antialiased",
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
        inViewMargin = "-50px",
        inViewOnce = true,
        delay = 0,
        proximityHover = false,
        proximityRadius = 85,
        proximityMaxScale = 0.3,
        proximityMaxY = -12,
        style: wrapStyle,
        segmentClassName,
        ...rest
    } = props;

    const localRef = useRef(null);
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    useImperativeHandle(ref, () => localRef.current);

    // Optimized line runs calculation
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
            const startIndex = globalIndex;

            if (type === "chars") {
                /** Keep whole words on one line (per-word nowrap); still animate per character. */
                const charEntries = [];
                let g = 0;
                let i = 0;
                while (i < line.length) {
                    const ch = line[i];
                    if (ch === " " || ch === "\t") {
                        charEntries.push({
                            kind: "single",
                            text: ch,
                            index: globalIndex + g,
                            key: `${lineIndex}-c-${g}`,
                        });
                        g += 1;
                        i += 1;
                    } else {
                        let word = "";
                        while (i < line.length && line[i] !== " " && line[i] !== "\t") {
                            word += line[i];
                            i += 1;
                        }
                        charEntries.push({
                            kind: "word",
                            text: word,
                            startIndex: globalIndex + g,
                            key: `${lineIndex}-w-${g}`,
                        });
                        g += word.length;
                    }
                }
                globalIndex += g;
                return { lineIndex, startIndex, charEntries };
            }

            const parts = (line.match(WORD_TOKEN_PATTERN) || []);

            globalIndex += parts.length;

            const fragments = parts.map((part, i) => (
                <React.Fragment key={`${lineIndex}-${i}`}>{part}</React.Fragment>
            ));

            return { lineIndex, fragments, startIndex };
        });
    }, [text, type, children]);

    const inViewResult = useInView(localRef, { once: inViewOnce, margin: inViewMargin });
    const isInView = !inView || inViewResult;

    // Memoized entrance animation config
    const stagger = useMemo(() =>
        motionVariants.stagger ?? (type === "chars" ? 0.03 : 0.1),
        [motionVariants.stagger, type]
    );

    const initialItem = useMemo(() => ({
        opacity: 0,
        y: 40,
        rotateX: 45,
        scale: 0.9,
        ...motionVariants.initial
    }), [motionVariants.initial]);

    const animateTarget = useMemo(() =>
        isInView ? {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            ...motionVariants.animate
        } : initialItem,
        [isInView, motionVariants.animate, initialItem]
    );

    // Premium entrance easing
    const entranceTransition = useMemo(() => ({
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
        ...motionVariants.transition
    }), [motionVariants.transition]);

    // Debounced mouse move handler
    const handleMouseMove = useCallback((e) => {
        if (proximityHover) {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        }
    }, [proximityHover, mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(-1000);
        mouseY.set(-1000);
    }, [mouseX, mouseY]);

    return (
        <motion.span
            ref={localRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                display: "inline-block",
                perspective: "1000px",
                willChange: "transform, opacity",
                ...wrapStyle,
            }}
            {...rest}
        >
            {lineRuns.map(({ lineIndex, fragments, startIndex, charEntries }) => (
                <span
                    key={`line-${lineIndex}`}
                    style={{ display: children != null ? "inline" : "block" }}
                >
                    {charEntries
                        ? charEntries.map((entry) =>
                            entry.kind === "single" ? (
                                <ConnectedItem
                                    key={entry.key}
                                    item={entry.text}
                                    mouseX={mouseX}
                                    mouseY={mouseY}
                                    type={type}
                                    proximityRadius={proximityRadius}
                                    proximityMaxScale={proximityMaxScale}
                                    proximityMaxY={proximityMaxY}
                                    initialItem={initialItem}
                                    animateTarget={animateTarget}
                                    entranceTransition={entranceTransition}
                                    revealDelay={(delay / 1000) + (entry.index * stagger)}
                                    segmentClassName={segmentClassName}
                                />
                            ) : (
                                <span
                                    key={entry.key}
                                    style={{ display: "inline-block", whiteSpace: "nowrap" }}
                                >
                                    {Array.from(entry.text).map((char, j) => {
                                        const index = entry.startIndex + j;
                                        const ck = `${entry.key}-${j}`;
                                        return (
                                            <ConnectedItem
                                                key={ck}
                                                item={char}
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
                                                segmentClassName={segmentClassName}
                                            />
                                        );
                                    })}
                                </span>
                            ),
                        )
                        : fragments.map((item, i) => {
                            const index = startIndex + i;
                            const itemKey = `${lineIndex}-${i}`;

                            return (
                                <ConnectedItem
                                    key={itemKey}
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
                                    segmentClassName={segmentClassName}
                                />
                            );
                        })}
                </span>
            ))}
        </motion.span>
    );
});

SplittingText.displayName = "SplittingText";

export default SplittingText;