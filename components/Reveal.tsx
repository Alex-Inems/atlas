"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { MOTION } from "@/lib/motion/tokens";
import { createRevealTransition, revealViewport } from "@/lib/motion/variants";
import { useMotionPreference } from "@/providers/MotionPreferenceProvider";

interface RevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

const Reveal = ({ children, delay = 0, className = "" }: RevealProps) => {
    const { reducedMotion } = useMotionPreference();

    if (reducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: MOTION.distance.revealY }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={createRevealTransition(delay)}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;
