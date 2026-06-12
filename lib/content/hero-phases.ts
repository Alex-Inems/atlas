import type { HeroPhase } from "@/lib/types/content";
import { asPhaseIndex } from "@/lib/types/branded";
import { MOTION } from "@/lib/motion/tokens";

export const HERO_PHASES = [
    {
        num: "01",
        title: "Foundation",
        headline: "We dig deep\nbefore we build high",
        description:
            "Geotechnical analysis, reinforced footings, and site logistics — every landmark starts below grade.",
        accentLineIndex: asPhaseIndex(1),
        media: {
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
            transformOrigin: "center bottom",
            kenBurnsScale: MOTION.cinematic.kenBurnsFromScale,
            kenBurnsDurationMs: MOTION.hero.phaseIntervalMs,
        },
    },
    {
        num: "02",
        title: "Structure",
        headline: "Steel rises.\nConcrete sets.",
        description:
            "Crane operations, welding, and structural QA in seamless coordination across the site.",
        accentLineIndex: asPhaseIndex(1),
        media: {
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80",
            transformOrigin: "center center",
            kenBurnsScale: MOTION.cinematic.kenBurnsFromScale,
            kenBurnsDurationMs: MOTION.hero.phaseIntervalMs,
        },
    },
    {
        num: "03",
        title: "Envelope",
        headline: "Seal the shell.\nPower the core.",
        description:
            "Curtain walls, MEP rough-ins, and weatherproofing transform raw frame into climate-controlled space.",
        accentLineIndex: asPhaseIndex(1),
        media: {
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
            transformOrigin: "center top",
            kenBurnsScale: MOTION.cinematic.kenBurnsFromScale,
            kenBurnsDurationMs: MOTION.hero.phaseIntervalMs,
        },
    },
    {
        num: "04",
        title: "Delivery",
        headline: "Built to last.\nHanded over.",
        description:
            "Final finishes, commissioning, and punch-list completion — turnkey delivery at the highest standard.",
        accentLineIndex: asPhaseIndex(1),
        media: {
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80",
            transformOrigin: "center center",
            kenBurnsScale: MOTION.cinematic.kenBurnsFromScale,
            kenBurnsDurationMs: MOTION.hero.phaseIntervalMs,
        },
    },
] as const satisfies readonly HeroPhase[];

export const HERO_PHASE_COUNT = HERO_PHASES.length;
