import { useEffect, useRef } from "react";

/**
 * Animated particle constellation (orange network) for card hovers.
 * Used by About stats and Contact grid for a consistent hover treatment.
 */
export function ParticleCanvas({ active, mousePos, size }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(0);
    const ptRef = useRef([]);

    useEffect(() => {
        if (!active) return;
        const cnv = canvasRef.current;
        if (!cnv) return;
        const { w: W, h: H } = size;
        cnv.width = W;
        cnv.height = H;
        const ctx = cnv.getContext("2d");

        ptRef.current = Array.from({ length: 38 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            da: Math.random() * 0.015 + 0.005,
            phase: Math.random() * Math.PI * 2,
        }));

        function draw(ts) {
            ctx.clearRect(0, 0, W, H);
            const { x: mx, y: my } = mousePos;

            ptRef.current.forEach((p) => {
                p.x += p.vx + (mx / W - 0.5) * 0.35;
                p.y += p.vy + (my / H - 0.5) * 0.35;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;
                const pulse = 0.5 + 0.5 * Math.sin(ts * 0.001 * p.da * 60 + p.phase);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(241,85,51,${pulse * 0.55})`;
                ctx.fill();
            });

            for (let i = 0; i < ptRef.current.length; i++) {
                for (let j = i + 1; j < ptRef.current.length; j++) {
                    const a = ptRef.current[i];
                    const b = ptRef.current[j];
                    const d = Math.hypot(a.x - b.x, a.y - b.y);
                    if (d < 72) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(241,85,51,${(1 - d / 72) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            rafRef.current = requestAnimationFrame(draw);
        }

        rafRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafRef.current);
    }, [active, size]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                opacity: active ? 1 : 0,
                transition: "opacity .5s ease",
            }}
        />
    );
}
