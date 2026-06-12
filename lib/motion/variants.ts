import type { Variants, Transition } from "framer-motion";
import { MOTION } from "./tokens";

type EaseTuple = readonly [number, number, number, number];

const brandTransition = (overrides: Partial<Transition> = {}): Transition => ({
    ease: MOTION.ease.brand as EaseTuple,
    ...overrides,
});

export const createFallLineVariant = (delay: number): Variants => ({
    hidden: { opacity: 0, y: -MOTION.distance.heroFallY },
    visible: {
        opacity: 1,
        y: 0,
        transition: brandTransition({ duration: MOTION.duration.heroLine, delay }),
    },
});

export const revealViewport = {
    once: MOTION.viewport.revealOnce,
    margin: MOTION.viewport.revealMargin,
} as const;

export const createRevealTransition = (delay = 0): Transition =>
    brandTransition({ duration: MOTION.duration.reveal, delay });

export const heroBadgeTransition = brandTransition({
    duration: MOTION.duration.heroBadge,
    delay: 0.05,
});

export const heroExitTransition: Transition = {
    duration: MOTION.duration.heroExit,
    ease: "easeIn",
};

export const crossfadeTransition = brandTransition({ duration: MOTION.duration.crossfade });

export const kenBurnsTransition = (duration: number): Transition => ({
    duration,
    ease: "linear",
});
