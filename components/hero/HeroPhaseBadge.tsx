"use client";

import { motion } from "framer-motion";
import type { HeroPhase } from "@/lib/types/content";
import { MOTION } from "@/lib/motion/tokens";
import { heroBadgeTransition } from "@/lib/motion/variants";

interface Props {
    readonly phase: HeroPhase;
    readonly phaseKey: number;
}

const HeroPhaseBadge = ({ phase, phaseKey }: Props) => (
    <motion.div
        key={`badge-${phaseKey}`}
        initial={{ opacity: 0, y: -MOTION.distance.heroBadgeY }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        transition={heroBadgeTransition}
        className="flex items-center gap-3 mb-auto"
    >
        <span className="text-safety font-mono text-sm font-bold">{phase.num}</span>
        <span className="w-8 h-px bg-safety" />
        <span className="text-xs tracking-[0.25em] uppercase text-white/50 font-medium">
            {phase.title}
        </span>
    </motion.div>
);

export default HeroPhaseBadge;
