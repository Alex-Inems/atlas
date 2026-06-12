"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HERO_PHASES } from "@/lib/content/hero-phases";
import { MOTION } from "@/lib/motion/tokens";
import { crossfadeTransition, kenBurnsTransition } from "@/lib/motion/variants";

interface Props {
    activeIndex: number;
}

const ConstructionAnimation = ({ activeIndex }: Props) => {
    const frame = HERO_PHASES[activeIndex].media;

    return (
        <div className="absolute inset-0 overflow-hidden bg-charcoal">
            <AnimatePresence mode="sync">
                <motion.div
                    key={activeIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={crossfadeTransition}
                >
                    <motion.img
                        src={frame.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ scale: frame.kenBurnsScale }}
                        animate={{ scale: 1 }}
                        transition={kenBurnsTransition(MOTION.duration.kenBurns)}
                        style={{ transformOrigin: frame.transformOrigin }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-charcoal/50" />
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at center, transparent 30%, #0a0a0a 100%)",
                    opacity: MOTION.cinematic.vignetteOpacity,
                }}
            />
        </div>
    );
};

export default ConstructionAnimation;
