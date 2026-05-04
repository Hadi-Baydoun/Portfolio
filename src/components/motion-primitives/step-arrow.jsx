// StepArrow.jsx
import { motion } from "framer-motion";

const plum = "var(--portfolio-plum, #421a34)";
const coral = "var(--portfolio-coral, #ff6464)";
const peach = "var(--portfolio-peach, #ffbb71)";

const gradients = {
    left: [plum, coral, peach],   // tail=plum (top), head=peach (bottom)
    right: [peach, coral, plum],
    down: [plum, coral, peach],
};

export function StepArrow({ direction = "left", delay = 0, index }) {
    const id = `sa-grad-${index}`;
    const [c1, c2, c3] = gradients[direction] ?? gradients.left;

    /* ── DOWN (mobile stacked layout) ── */
    if (direction === "down") {
        return (
            <svg viewBox="0 0 80 120" className="step-arrow-svg"
                style={{ display: "block", overflow: "visible", height: "auto" }}
                preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor={c1} />
                        <stop offset="50%" stopColor={c2} />
                        <stop offset="100%" stopColor={c3} />
                    </linearGradient>
                </defs>
                {/* Tail dot at very top — aligns with card bottom edge */}
                <circle cx={40} cy={6} r={5} fill={coral} opacity={0.5} />
                {/* Straight-ish curve from top to bottom */}
                <motion.path
                    d="M 40 6 C 40 40, 40 80, 40 110"
                    fill="none"
                    stroke={`url(#${id})`}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Arrowhead at very bottom */}
                <motion.path d="M 40 110 L 30 97" fill="none" stroke={`url(#${id})`}
                    strokeWidth={3} strokeLinecap="round"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: delay + 0.55 }} />
                <motion.path d="M 40 110 L 50 97" fill="none" stroke={`url(#${id})`}
                    strokeWidth={3} strokeLinecap="round"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: delay + 0.55 }} />
            </svg>
        );
    }

    /*
     * ── LEFT / RIGHT (desktop zig-zag) ──
     *
     * "left"  = card is on the LEFT  → arrow column is on the RIGHT
     *           Tail starts at LEFT  edge of the right column  (x=4,  y=6)
     *           Head ends   at RIGHT edge of the left column   (x=76, y=114)
     *           i.e. the arrow sweeps from top-left → bottom-right
     *           pointing toward the next card which is on the right.
     *
     * "right" = card is on the RIGHT → arrow column is on the LEFT
     *           Tail starts at RIGHT edge of the left column   (x=76, y=6)
     *           Head ends   at LEFT  edge of the right column  (x=4,  y=114)
     *           i.e. the arrow sweeps from top-right → bottom-left
     *           pointing toward the next card which is on the left.
     */
    const isLeft = direction === "left";

    const tailX = isLeft ? 4 : 76;   // where the dot sits (near card border)
    const headX = isLeft ? 76 : 4;    // where the arrowhead lands

    // Cubic bezier: start near the card edge at top, curve across, end near next card edge at bottom
    const path = isLeft
        ? "M 4 6 C 10 40, 70 76, 76 114"   // left-col card → sweeps right → right-col next card
        : "M 76 6 C 70 40, 10 76, 4 114";  // right-col card → sweeps left → left-col next card

    // Arrowhead legs — point back along the path direction
    const headA = isLeft ? "M 76 114 L 58 106" : "M 4 114 L 22 106";
    const headB = isLeft ? "M 76 114 L 72 96" : "M 4 114 L 8 96";

    const gradX1 = isLeft ? "0%" : "100%";
    const gradX2 = isLeft ? "100%" : "0%";

    return (
        <svg viewBox="0 0 80 120" className="step-arrow-svg"
            style={{ display: "block", overflow: "visible", height: "auto" }}
            preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id={id} x1={gradX1} y1="0%" x2={gradX2} y2="100%">
                    <stop offset="0%" stopColor={c1} />
                    <stop offset="50%" stopColor={c2} />
                    <stop offset="100%" stopColor={c3} />
                </linearGradient>
            </defs>

            {/* Tail dot — sits right at the card's border */}
            <circle cx={tailX} cy={6} r={5}
                fill={isLeft ? plum : peach} opacity={0.55} />

            {/* Main curve */}
            <motion.path
                d={path}
                fill="none"
                stroke={`url(#${id})`}
                strokeWidth={3.5}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Arrowhead */}
            <motion.path d={headA} fill="none" stroke={`url(#${id})`}
                strokeWidth={3} strokeLinecap="round"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: delay + 0.55 }} />
            <motion.path d={headB} fill="none" stroke={`url(#${id})`}
                strokeWidth={3} strokeLinecap="round"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: delay + 0.55 }} />
        </svg>
    );
}