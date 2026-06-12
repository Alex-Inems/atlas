"use client";

import { motion } from "framer-motion";
import type { HeroPhase } from "@/lib/types/content";
import { MOTION } from "@/lib/motion/tokens";
import { createFallLineVariant, heroExitTransition } from "@/lib/motion/variants";

interface Props {
    readonly phase: HeroPhase;
    readonly phaseKey: number;
}

const HeroPhaseCopy = ({ phase, phaseKey }: Props) => (
    <motion.div
        key={phaseKey}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: heroExitTransition }}
    >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight whitespace-pre-line mb-6 overflow-hidden">
            {phase.headline.split("\n").map((line, i) => (
                <motion.span
                    key={i}
                    className="block"
                    variants={createFallLineVariant(
                        MOTION.stagger.heroLineBase + i * MOTION.stagger.heroLineStep,
                    )}
                >
                    {i === phase.accentLineIndex ? (
                        <span className="text-safety">{line}</span>
                    ) : (
                        line
                    )}
                </motion.span>
            ))}
        </h1>
        <motion.p
            className="text-white/50 text-lg leading-relaxed max-w-md"
            variants={createFallLineVariant(MOTION.stagger.heroDescription)}
        >
            {phase.description}
        </motion.p>
    </motion.div>
);

export default HeroPhaseCopy;
