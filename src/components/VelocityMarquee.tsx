/**
 * VelocityMarquee Component
 * 
 * WHAT IT DOES:
 * Renders the VelocityMarquee UI component or visual effect.
 * 
 * INSTRUCTOR NOTE / HOW TO MODIFY:
 * - If sir asks to remove this specific feature entirely, the safest and easiest way is to go to src/App.tsx and comment out or remove its tag. Do not delete this file.
 */
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useInView
} from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

export function VelocityMarquee({ children, baseVelocity = 100 }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -50, v)}%`);

  const [isHovering, setIsHovering] = useState(false);
  const skewX = useTransform(smoothVelocity, [-1000, 1000], [-15, 15]);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_t, delta) => {
    if (!isInView) return; // PAUSE CALCULATION WHEN OFF-SCREEN

    const activeVelocity = isHovering ? baseVelocity * 0.15 : baseVelocity;
    let moveBy = directionFactor.current * activeVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="overflow-hidden w-full whitespace-nowrap flex flex-nowrap m-0 leading-[0.8] tracking-tighter py-8 select-none pointer-events-auto cursor-none border-y border-neutral-100"
    >
      <motion.div className="flex font-display font-black text-[6rem] md:text-[12rem] lg:text-[16rem] uppercase text-black opacity-30 will-change-transform transform-gpu" style={{ x, skewX }}>
        <span className="block pr-16">{children} —</span>
        <span className="block pr-16">{children} —</span>
        <span className="block pr-16">{children} —</span>
        <span className="block pr-16">{children} —</span>
      </motion.div>
    </div>
  );
}
