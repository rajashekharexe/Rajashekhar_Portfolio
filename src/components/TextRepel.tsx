import { cn } from "../utils";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type MotionValue,
    useInView
} from "framer-motion";
import { useEffect, useRef, useCallback } from "react";

interface TextRepelProps {
    text: string;
    className?: string;
    letterClassName?: string;
    radius?: number;
    strength?: number;
    mode?: "repel" | "attract";
    stiffness?: number;
    damping?: number;
    mass?: number;
}

/**
 * RepelLetter
 * Calculates continuous Euclidean distance and angular trajectory vector
 * relative to the cursor, driving spring-damped displacements.
 */
function RepelLetter({
    letter,
    mouseX,
    mouseY,
    radius,
    strength,
    mode,
    stiffness,
    damping,
    mass,
    className,
}: {
    letter: string;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    radius: number;
    strength: number;
    mode: "repel" | "attract";
    stiffness: number;
    damping: number;
    mass: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness, damping, mass });
    const springY = useSpring(y, { stiffness, damping, mass });
    const rotate  = useTransform(springX, (v) => v * 0.3);

    // ── Cache absolute document position (no DOM read in hot path) ──────────
    // Stores the letter's center in DOCUMENT coordinates (adds scrollY)
    const absCenter = useRef({ x: 0, y: 0 });

    const readPos = useCallback(() => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        absCenter.current = {
            x: r.left + r.width  / 2 + window.scrollX,
            y: r.top  + r.height / 2 + window.scrollY,
        };
    }, []);

    useEffect(() => {
        // ── Hot path: only reads JS values — zero DOM queries ───────────────
        const update = () => {
            // Convert cached absolute pos → current viewport pos (cheap)
            const lx = absCenter.current.x - window.scrollX - springX.get();
            const ly = absCenter.current.y - window.scrollY - springY.get();

            const mx = mouseX.get();
            const my = mouseY.get();
            const dx = lx - mx;
            const dy = ly - my;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius && distance > 0) {
                const force = ((1 - distance / radius) ** 2) * strength;
                const angle = Math.atan2(dy, dx);
                const dir   = mode === "attract" ? -1 : 1;
                x.set(Math.cos(angle) * force * dir);
                y.set(Math.sin(angle) * force * dir);
            } else {
                x.set(0);
                y.set(0);
            }
        };

        // Initial cache population
        readPos();

        // Refresh cache only on scroll / resize (infrequent)
        window.addEventListener("scroll", readPos,  { passive: true });
        window.addEventListener("resize", readPos,  { passive: true });

        const unsub1 = mouseX.on("change", update);
        const unsub2 = mouseY.on("change", update);

        return () => {
            unsub1();
            unsub2();
            window.removeEventListener("scroll", readPos);
            window.removeEventListener("resize", readPos);
        };
    }, [mouseX, mouseY, radius, strength, mode, x, y, springX, springY, readPos]);

    if (letter === " ") {
        return <span className="inline-block whitespace-pre"> </span>;
    }

    return (
        <motion.span
            ref={ref}
            className={cn("inline-block whitespace-pre will-change-transform", className)}
            style={{ x: springX, y: springY, rotate }}
            aria-hidden
        >
            {letter}
        </motion.span>
    );
}

/**
 * TextRepel
 * Deconstructs string streams into discrete typography nodes mapped to global cursor vector fields.
 */
export function TextRepel({
    text,
    className,
    letterClassName,
    radius    = 120,
    strength  = 45,
    mode      = "repel",
    stiffness = 180,
    damping   = 14,
    mass      = 0.4,
}: TextRepelProps) {
    const mouseX = useMotionValue(-9999);
    const mouseY = useMotionValue(-9999);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef);

    useEffect(() => {
        if (!isInView) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        const handleMouseLeave = () => {
            mouseX.set(-9999);
            mouseY.set(-9999);
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [mouseX, mouseY, isInView]);

    return (
        <div
            ref={containerRef}
            data-text-repel
            className={cn(
                "inline-flex flex-wrap items-center justify-center cursor-default select-none",
                className
            )}
            aria-label={text}
        >
            {text.split(" ").map((word, wi) => {
                const before     = text.split(" ").slice(0, wi);
                const startIndex = before.join(" ").length + (wi > 0 ? 1 : 0);
                return (
                    <span key={wi} className="inline-flex whitespace-nowrap mr-[0.27em]">
                        {word.split("").map((letter, li) => (
                            <RepelLetter
                                key={startIndex + li}
                                letter={letter}
                                mouseX={mouseX}
                                mouseY={mouseY}
                                radius={radius}
                                strength={strength}
                                mode={mode}
                                stiffness={stiffness}
                                damping={damping}
                                mass={mass}
                                className={letterClassName}
                            />
                        ))}
                    </span>
                );
            })}
        </div>
    );
}
