"use client";

import { AnimatePresence } from "framer-motion";
import ConstructionAnimation from "./ConstructionAnimation";
import HeroPhaseBadge from "./hero/HeroPhaseBadge";
import HeroPhaseCopy from "./hero/HeroPhaseCopy";
import HeroPhaseRail from "./hero/HeroPhaseRail";
import { HERO_PHASES, HERO_PHASE_COUNT } from "@/lib/content/hero-phases";
import { HERO_ELEMENT_ID } from "@/lib/navigation/theme";
import { usePhaseOrchestrator } from "@/hooks/usePhaseOrchestrator";

const Hero = () => {
    const { activeIndex, progress, goTo } = usePhaseOrchestrator({
        phaseCount: HERO_PHASE_COUNT,
    });

    const phase = HERO_PHASES[activeIndex];

    return (
        <div id={HERO_ELEMENT_ID} className="relative h-screen bg-charcoal text-white">
            <div className="absolute inset-0 z-0">
                <ConstructionAnimation activeIndex={activeIndex} />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/40 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto w-full px-6 md:px-10 pt-28 pb-10">
                <AnimatePresence mode="wait">
                    <HeroPhaseBadge phase={phase} phaseKey={activeIndex} />
                </AnimatePresence>

                <div className="mt-auto mb-8 max-w-2xl">
                    <AnimatePresence mode="wait">
                        <HeroPhaseCopy phase={phase} phaseKey={activeIndex} />
                    </AnimatePresence>
                </div>

                <HeroPhaseRail
                    phases={HERO_PHASES}
                    activeIndex={activeIndex}
                    progress={progress}
                    onSelect={goTo}
                />
            </div>
        </div>
    );
};

export default Hero;
