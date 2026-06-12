"use client";

import { motion } from "framer-motion";
import type { HeroPhase } from "@/lib/types/content";
const formatPhaseOrdinal = (index: number): string => String(index + 1).padStart(2, "0");

interface Props {
    readonly phases: readonly HeroPhase[];
    readonly activeIndex: number;
    readonly progress: number;
    readonly onSelect: (index: number) => void;
}

const HeroPhaseRail = ({ phases, activeIndex, progress, onSelect }: Props) => (
    <div className="flex items-end justify-between">
        <div className="flex gap-3">
            {phases.map((p, i) => (
                <button
                    key={p.num}
                    type="button"
                    onClick={() => onSelect(i)}
                    className="group flex flex-col items-start gap-1 bg-transparent border-none p-0 cursor-pointer"
                >
                    <div className="relative h-1 rounded-full bg-white/20 w-12 overflow-hidden">
                        {i === activeIndex ? (
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-safety rounded-full"
                                style={{ width: `${progress * 100}%` }}
                            />
                        ) : (
                            <motion.div
                                className="h-full bg-safety rounded-full"
                                animate={{ width: i < activeIndex ? "100%" : "0%" }}
                                transition={{ duration: 0.4 }}
                            />
                        )}
                    </div>
                    <span
                        className={`text-[10px] tracking-widest uppercase font-bold transition-colors ${
                            i === activeIndex
                                ? "text-safety"
                                : "text-white/30 group-hover:text-white/60"
                        }`}
                    >
                        {p.title}
                    </span>
                </button>
            ))}
        </div>

        <div className="hidden md:flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/30 font-bold">
                Auto
            </span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-[10px] font-mono text-white/50">
                    {formatPhaseOrdinal(activeIndex)}
                </span>
            </div>
        </div>

        <div className="text-right hidden sm:block">
            <div className="text-3xl font-black font-mono text-safety">
                {formatPhaseOrdinal(activeIndex)}
                <span className="text-white/20"> / {formatPhaseOrdinal(phases.length - 1)}</span>
            </div>
        </div>
    </div>
);

export default HeroPhaseRail;
